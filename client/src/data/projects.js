import miycn from "../assets/projects/miycn.jpg";
import sorcest from "../assets/projects/sorcest.jpg";
import help from "../assets/projects/help.jpg";

export const projects = [
  {
    id: 1,
    title: "Community MIYCN Campaign",
    image: miycn,
    program: "Health & Nutrition",
    location: "Gombe State",
    status: "Active",
    featured: true,
    summary:
      "Improving maternal, infant and young child nutrition in underserved communities.",
    beneficiaries: "500+ Mothers & Children",
    slug: "community-miycn",
  },

  {
    id: 2,
    title: "Digital Skills for Orphans",
    image: sorcest,
    program: "SORCEST",
    location: "Bauchi State",
    status: "Ongoing",
    featured: true,
    summary:
      "Providing technology education and mentorship for orphaned children.",
    beneficiaries: "150 Students",
    slug: "sorcest-tech",
  },

  {
    id: 3,
    title: "HELP Food Distribution",
    image: help,
    program: "HELP",
    location: "Yobe State",
    status: "Completed",
    featured: true,
    summary:
      "Delivering food and livelihood support to vulnerable families.",
    beneficiaries: "1,200 Families",
    slug: "help-food",
  },
];