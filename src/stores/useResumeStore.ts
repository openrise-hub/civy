import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid'; 
import { Resume, Section, Item, PersonalInfo, ItemType } from '@/types/resume';
import { RESUME_LIMITS } from '@/constants/limits';

// --- Default Templates ---
// Used when creating new sections.
// Note: 'content.id' is a placeholder here; it gets replaced with a real UUID on creation.
export const SECTION_TEMPLATES: Record<string, Partial<Section>> = {
  experience: { 
    title: 'Experience', 
    visible: true,
    content: { id: '', layout: 'list', items: [] } 
  },
  education: { 
    title: 'Education', 
    visible: true,
    content: { id: '', layout: 'list', items: [] } 
  },
  skills: { 
    title: 'Skills', 
    visible: true,
    content: { id: '', layout: 'grid', columns: 3, items: [] } 
  },
  summary: { 
    title: 'Professional Summary', 
    visible: true,
    content: { id: '', layout: 'list', items: [] } 
  },
  custom: { 
    title: 'Custom Section', 
    visible: true,
    content: { id: '', layout: 'list', items: [] } 
  },
};

interface ResumeStore {
  resume: Resume;
  
  // Actions
  setResume: (resume: Resume) => void;
  updatePersonal: (personal: Partial<PersonalInfo>) => void;
  updateMetadata: (metadata: Partial<Resume['metadata']>) => void;
  
  addSection: (type?: string) => void; 
  removeSection: (sectionId: string) => void;
  reorderSections: (activeId: string, overId: string) => void;
  updateSection: (sectionId: string, data: Partial<Section>) => void; 

  addItem: (sectionId: string, type: ItemType) => void;
  removeItem: (sectionId: string, itemId: string) => void;
  updateItem: (sectionId: string, itemId: string, data: Partial<Item>) => void;
  reorderItems: (sectionId: string, activeId: string, overId: string) => void;
  duplicateItem: (sectionId: string, itemId: string) => void;
}

// --- Initial State ---
const initialResume: Resume = {
  id: '',
  userId: '',
  title: '',
  isPublic: false,
  metadata: {
    template: 'modern',
    typography: { fontFamily: 'inter', fontSize: 'md' },
    colors: { 
      background: '#ffffff',
      text: '#1f2937',
      accents: ['#2563eb', '#3b82f6', '#e5e7eb', '#6b7280'] 
    },
  },
  personal: {
    fullName: '',
    details: [],
  },
  sections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: initialResume,

  setResume: (resume) => set({ resume }),

  updatePersonal: (data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        personal: { ...state.resume.personal, ...data },
      },
    })),

  updateMetadata: (data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        metadata: { ...state.resume.metadata, ...data },
      },
    })),


  addSection: (type = 'custom') =>
    set((state) => {
      // Check section limit
      if (state.resume.sections.length >= RESUME_LIMITS.MAX_SECTIONS) {
        console.warn(`Cannot add section: maximum ${RESUME_LIMITS.MAX_SECTIONS} sections reached`);
        return {};
      }

      const template = SECTION_TEMPLATES[type] || SECTION_TEMPLATES.custom;
      return {
        resume: {
          ...state.resume,
          sections: [
            ...state.resume.sections,
            {
              id: uuidv4(),
              visible: true,
              title: template.title!,
              content: {
                // Generate unique ID for the content block
                id: uuidv4(),
                layout: template.content?.layout || 'list',
                columns: template.content?.columns,
                items: [],
              },
            },
          ],
        },
      };
    }),

  removeSection: (sectionId) =>
    set((state) => ({
      resume: {
        ...state.resume,
        sections: state.resume.sections.filter((s) => s.id !== sectionId),
      },
    })),

  reorderSections: (activeId, overId) =>
    set((state) => {
      const sections = [...state.resume.sections];
      const oldIndex = sections.findIndex((s) => s.id === activeId);
      const newIndex = sections.findIndex((s) => s.id === overId);

      if (oldIndex === -1 || newIndex === -1) return {};

      const [movedSection] = sections.splice(oldIndex, 1);
      sections.splice(newIndex, 0, movedSection);

      return { resume: { ...state.resume, sections } };
    }),

  updateSection: (sectionId, data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        sections: state.resume.sections.map((section) =>
          section.id === sectionId ? { ...section, ...data } : section
        ),
      },
    })),

  addItem: (sectionId, type) =>
    set((state) => {
      // Check item limit for this section
      const section = state.resume.sections.find((s) => s.id === sectionId);
      if (section && section.content.items.length >= RESUME_LIMITS.MAX_ITEMS_PER_SECTION) {
        console.warn(`Cannot add item: maximum ${RESUME_LIMITS.MAX_ITEMS_PER_SECTION} items per section reached`);
        return {};
      }

      let newItem: Partial<Item> = { id: uuidv4(), visible: true, type };
      
      // Initialize 'value' based on ItemType interface
      switch (type) {
        case 'date-range':
          newItem = { 
            ...newItem, 
            value: { startDate: '', endDate: '' } 
          } as Item;
          break;
          
        case 'rating':
          newItem = { 
            ...newItem, 
            value: { label: 'Skill', score: 3, max: 5, display: 'dots' } 
          } as Item;
          break;
          
        case 'image':
           newItem = { 
             ...newItem, 
             value: { url: '', shape: 'square' } 
           } as Item;
           break;
           
        case 'social':
        case 'link':
           newItem = { 
             ...newItem, 
             value: { label: '', url: '' } 
           } as Item;
           break;
           
        case 'separator':
           newItem = { 
             ...newItem, 
             value: null 
           } as Item;
           break;
           
        default:
          // Handles: heading, sub-heading, text, bullet, number, 
          // date, location, phone, email, tag.
          // These are all StringItems.
          newItem = { 
            ...newItem, 
            value: '' 
          } as Item;
      }

      return {
        resume: {
          ...state.resume,
          sections: state.resume.sections.map((section) => {
            if (section.id !== sectionId) return section;
            return {
              ...section,
              content: {
                ...section.content,
                items: [...section.content.items, newItem as Item],
              },
            };
          }),
        },
      };
    }),

  removeItem: (sectionId, itemId) =>
    set((state) => ({
      resume: {
        ...state.resume,
        sections: state.resume.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            content: {
              ...section.content,
              items: section.content.items.filter((item) => item.id !== itemId),
            },
          };
        }),
      },
    })),

  updateItem: (sectionId, itemId, data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        sections: state.resume.sections.map((section) => {
          if (section.id !== sectionId) return section;
          return {
            ...section,
            content: {
              ...section.content,
              items: section.content.items.map((item) =>
                item.id === itemId ? { ...item, ...data } as Item : item
              ),
            },
          };
        }),
      },
    })),

  reorderItems: (sectionId, activeId, overId) =>
    set((state) => ({
      resume: {
        ...state.resume,
        sections: state.resume.sections.map((section) => {
          if (section.id !== sectionId) return section;
          
          const items = [...section.content.items];
          const oldIndex = items.findIndex((i) => i.id === activeId);
          const newIndex = items.findIndex((i) => i.id === overId);
          
          if (oldIndex === -1 || newIndex === -1) return section;
          
          const [movedItem] = items.splice(oldIndex, 1);
          items.splice(newIndex, 0, movedItem);
          
          return {
            ...section,
            content: {
              ...section.content,
              items
            }
          };
        }),
      },
    })),

  duplicateItem: (sectionId, itemId) =>
    set((state) => {
      // Find the store and section
      const section = state.resume.sections.find((s) => s.id === sectionId);
      if (!section) return {};

      const itemIndex = section.content.items.findIndex((i) => i.id === itemId);
      if (itemIndex === -1) return {};

      const sourceItem = section.content.items[itemIndex];

      // Check limits
      if (section.content.items.length >= RESUME_LIMITS.MAX_ITEMS_PER_SECTION) {
        console.warn(`Cannot duplicate item: maximum ${RESUME_LIMITS.MAX_ITEMS_PER_SECTION} items per section reached`);
        return {};
      }

      // Create a deep copy and assign a new ID
      const newItem = {
        ...JSON.parse(JSON.stringify(sourceItem)),
        id: uuidv4(),
      };

      return {
        resume: {
          ...state.resume,
          sections: state.resume.sections.map((sec) => {
            if (sec.id !== sectionId) return sec;

            const newItems = [...sec.content.items];
            // Insert after the source item
            newItems.splice(itemIndex + 1, 0, newItem);

            return {
              ...sec,
              content: {
                ...sec.content,
                items: newItems
              }
            };
          }),
        },
      };
    }),
}));