// src/types/resume.ts

// --- Item Types ---
// Each type represents a specific UI Component behavior.
export type ItemType = 
  // Typography & Text
  | 'heading'        // H1/H2: Job Titles, Section Headers
  | 'sub-heading'    // H3/H4: Company Names, University Names
  | 'description'    // Markdown textarea: paragraphs, - bullets, 1. numbers, [links]()
  
  // Temporal & Spatial
  | 'date-range'     // Start - End: "Jan 2020 - Present"
  | 'location'       // Geographic: "New York, USA" (renders with pin icon)
  
  // Contact & Identity
  | 'email'          // Renders with mailto: link + icon
  | 'phone'          // Renders with tel: link + icon
  | 'link'           // Generic URL: Portfolio, Project Link
  
  // Visual Elements
  | 'tags'           // Multi-tag chips: "React", "TypeScript" (chip input)
  | 'rating'         // Skill Level: 4/5 stars, progress bar
  | 'separator'      // Horizontal Divider <hr />
  | 'image';         // Avatar or Company Logo

// --- Data Payload (Polymorphic) ---
// Depending on the type, the value structure changes.
// This is to make sure that "Date Range" is stored differently than a "Bullet".

// Basic interface for all items
interface BaseItem {
  id: string;
  visible: boolean;
  type: ItemType;
  
  metadata?: {
    color?: string;     // Hex code override for this specific item
    align?: 'left' | 'center' | 'right';
    colSpan?: number;   // If inside a grid, how many columns to span
  };
}

// Simple String Items (Heading, Text, Bullet, Location, Date, Phone, Email, Tag)
export interface StringItem extends BaseItem {
  type: 'heading' | 'sub-heading' | 'description' | 'location' | 'phone' | 'email';
  value: string; // The raw text content
}

// Complex Items (Date Ranges, Links, Socials, Ratings)

export interface DateRangeItem extends BaseItem {
  type: 'date-range';
  value: {
    startDate: string; // "2020-01"
    endDate?: string;  // "2022-05" or null (Present)
    format?: string;   // "MM/YYYY" vs "YYYY"
  };
}

export interface LinkItem extends BaseItem {
  type: 'link';
  value: {
    label: string; // "My Portfolio"
    url: string;   // "https://..."
  };
}

export interface RatingItem extends BaseItem {
  type: 'rating';
  value: {
    label: string; // "Spanish"
    score: number; // 4
    max: number;   // 5
    display: 'stars' | 'bar' | 'dots'; // Visual style
  };
}

export interface ImageItem extends BaseItem {
  type: 'image';
  value: {
    url: string;
    alt?: string;
    shape?: 'circle' | 'square';
  };
}

export interface SeparatorItem extends BaseItem {
  type: 'separator';
  value: null; // No content, just the line
}

export interface TagsItem extends BaseItem {
  type: 'tags';
  value: {
    name?: string;             // Optional group label ("Programming")
    items: string[];           // Tag strings
    display: 'text' | 'badge' | 'pill' | 'outline' | 'soft' | 'dot' | 'compact' | 'block' | 'sep'; // Visual style
  };
}

// The Union Type representing ANY item
export type Item = 
  | StringItem 
  | DateRangeItem 
  | LinkItem 
  | RatingItem 
  | ImageItem 
  | SeparatorItem
  | TagsItem;

// --- The Content Wrapper ---
export interface SectionContent {
  id: string;
  // This allows for future layout settings specifically for this block of content
  // e.g., "Display these items as a 2-column grid"
  layout: 'list' | 'grid' | 'inline'; 
  columns?: number; 
  items: Item[];
}

// --- The Section ---
export interface Section {
  id: string;
  title: string; // User-editable Title: "Work Experience"
  visible: boolean;
  
  // The container for all the items
  content: SectionContent; 
}

// --- Personal Info (Fixed Header) ---
export interface PersonalInfo {
  fullName: string;    // StringItem (heading)
  jobTitle?: string;   // StringItem (sub-heading)
  avatar?: string;     // ImageItem
  
  // The contact details (Email, Phone, Location, Socials) are just a list of Items
  details: Item[]; 
}

// --- The Resume Root ---
export interface Resume {
  id: string;
  userId: string;
  title: string;
  isPublic: boolean;
  
  metadata: {
    template: string;
    typography: { fontFamily: string; fontSize: 'sm' | 'md' | 'lg' };
  colors: { 
      background: string;   // Paper color
      text: string;         // Main body text color
      
      // Array for the template's color scheme.
      // Index 0: Primary Color
      // Index 1: Secondary Accent
      // Index 2: Border/Divider Color
      // Index 3: Muted/Subtext Color
      accents: string[];    
    };
  };

  personal: PersonalInfo;
  
  sections: Section[];
  
  createdAt: string;
  updatedAt: string;
}