import type { Resume, Item } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

function makeId(): string {
  return uuidv4();
}

export function createJohnDoeResume(template: string): Partial<Resume> {
  return {
    personal: {
      fullName: "John Doe",
      jobTitle: "Senior Software Engineer",
      details: [
        { id: makeId(), visible: true, type: "email", value: "john.doe@example.com" } as Item,
        { id: makeId(), visible: true, type: "phone", value: "+1 (555) 123-4567" } as Item,
        { id: makeId(), visible: true, type: "location", value: "San Francisco, CA" } as Item,
        { id: makeId(), visible: true, type: "link", value: { label: "github.com/johndoe", url: "https://github.com/johndoe" } } as Item,
        { id: makeId(), visible: true, type: "link", value: { label: "linkedin.com/in/johndoe", url: "https://linkedin.com/in/johndoe" } } as Item,
      ],
    },
    sections: [
      {
        id: makeId(),
        title: "Experience",
        visible: true,
        content: {
          id: makeId(),
          layout: "list",
          items: [
            {
              id: makeId(), visible: true, type: "heading",
              value: "ABC Tech Corp",
            } as Item,
            {
              id: makeId(), visible: true, type: "sub-heading",
              value: "Senior Software Engineer",
            } as Item,
            {
              id: makeId(), visible: true, type: "date-range",
              value: { startDate: "2020-06", endDate: undefined },
            } as Item,
            {
              id: makeId(), visible: true, type: "description",
              value: "- Led a team of 5 engineers to build a real-time analytics platform serving 2M+ daily users\n- Reduced API latency by 40% through query optimization and caching strategies\n- Migrated legacy monolith to microservices architecture, improving deployment frequency",
            } as Item,
            {
              id: makeId(), visible: true, type: "heading",
              value: "XYZ Solutions Inc.",
            } as Item,
            {
              id: makeId(), visible: true, type: "sub-heading",
              value: "Software Engineer",
            } as Item,
            {
              id: makeId(), visible: true, type: "date-range",
              value: { startDate: "2017-03", endDate: "2020-05" },
            } as Item,
            {
              id: makeId(), visible: true, type: "description",
              value: "- Built customer-facing dashboard with React and Node.js, increasing user engagement by 25%\n- Implemented CI/CD pipeline reducing release cycles from 2 weeks to 2 days\n- Mentored 3 junior developers through code reviews and pair programming",
            } as Item,
          ],
        },
      },
      {
        id: makeId(),
        title: "Education",
        visible: true,
        content: {
          id: makeId(),
          layout: "list",
          items: [
            {
              id: makeId(), visible: true, type: "heading",
              value: "University of California, Berkeley",
            } as Item,
            {
              id: makeId(), visible: true, type: "sub-heading",
              value: "B.S. Computer Science",
            } as Item,
            {
              id: makeId(), visible: true, type: "date-range",
              value: { startDate: "2013-09", endDate: "2017-05" },
            } as Item,
            {
              id: makeId(), visible: true, type: "description",
              value: "- GPA: 3.8/4.0\n- Dean's List 2015-2017\n- Undergraduate Research in Distributed Systems",
            } as Item,
          ],
        },
      },
      {
        id: makeId(),
        title: "Skills",
        visible: true,
        content: {
          id: makeId(),
          layout: "grid",
          columns: 2,
          items: [
            {
              id: makeId(), visible: true, type: "tags",
              value: { name: "Languages", items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"], display: "pill" },
            } as Item,
            {
              id: makeId(), visible: true, type: "tags",
              value: { name: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Redux", "GraphQL"], display: "pill" },
            } as Item,
            {
              id: makeId(), visible: true, type: "tags",
              value: { name: "Backend", items: ["Node.js", "PostgreSQL", "Redis", "Docker", "AWS"], display: "pill" },
            } as Item,
            {
              id: makeId(), visible: true, type: "tags",
              value: { name: "Tools", items: ["Git", "GitHub Actions", "Kubernetes", "Terraform", "Datadog"], display: "pill" },
            } as Item,
          ],
        },
      },
      {
        id: makeId(),
        title: "Professional Summary",
        visible: true,
        content: {
          id: makeId(),
          layout: "list",
          items: [
            {
              id: makeId(), visible: true, type: "description",
              value: "Senior Software Engineer with 7+ years of experience building scalable web applications and leading engineering teams. Passionate about clean architecture, developer experience, and mentoring. Proven track record of delivering high-impact products used by millions of users.",
            } as Item,
          ],
        },
      },
    ],
    metadata: {
      template,
      templateConfig: undefined,
      showFooter: false,
      showTopNote: false,
      typography: { fontFamily: "inter", fontSize: "md" },
      colors: {
        background: "#ffffff",
        text: "#1f2937",
        accents: ["#2563eb", "#3b82f6", "#e5e7eb", "#6b7280"],
      },
    },
  };
}
