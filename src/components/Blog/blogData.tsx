import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "Boost Employee Engagement with Leon Services",
    paragraph:
      "Leon Services provides powerful tools to enhance employee engagement, streamline HR operations, and create a productive work environment. Discover how our solutions help organizations foster stronger connections with their teams.",
    image: "/images/blog/blog-01.jpg",
    author: {
      name: "Alex Johnson",
      image: "/images/blog/author-01.png",
      designation: "HR Specialist",
    },
    tags: ["HR", "Engagement"],
    publishDate: "2025",
  },
  {
    id: 2,
    title: "Simplify Recruitment with Leon’s HR Management System",
    paragraph:
      "Leon Services offers advanced recruitment features that simplify candidate tracking, automate hiring workflows, and ensure you find the right talent efficiently and effectively.",
    image: "/images/blog/blog-02.jpg",
    author: {
      name: "Jamie Lee",
      image: "/images/blog/author-02.png",
      designation: "Recruitment Expert",
    },
    tags: ["Recruitment", "HR"],
    publishDate: "2025",
  },
  {
    id: 3,
    title: "Track Performance and Ensure Compliance with Leon Services",
    paragraph:
      "Leverage Leon’s HR management tools to monitor employee performance, set measurable goals, and ensure compliance with labor regulations — all in one centralized platform.",
    image: "/images/blog/blog-03.jpg",
    author: {
      name: "Morgan Smith",
      image: "/images/blog/author-03.png",
      designation: "HR Analyst",
    },
    tags: ["Analytics", "HR", "Compliance"],
    publishDate: "2025",
  },
];

export default blogData;
