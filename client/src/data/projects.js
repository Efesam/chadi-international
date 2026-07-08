import help from "../assets/projects/help.jpg";
import miycn from "../assets/projects/miycn.jpg";
import sorcest from "../assets/projects/sorcest.jpg";
import start from "../assets/projects/start.jpg";

import cleanWater from "../assets/projects/clean-water.jpg";
import communityHealth from "../assets/projects/community-health.jpg";
import digitalSkills from "../assets/projects/digital-skills.jpg";
import foodSecurity from "../assets/projects/food-security.jpg";
import greenAfrica from "../assets/projects/green-africa.jpg";
import maternalHealth from "../assets/projects/maternal-health.jpg";
import schoolSupport from "../assets/projects/school-support.jpg";
import womenBusiness from "../assets/projects/women-business.jpg";

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
      "Providing technology education, mentorship and digital skills training for orphaned children.",
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
    summary: "Delivering food and livelihood support to vulnerable families.",
    beneficiaries: "1,200 Families",
    slug: "help-food",
  },

  {
    id: 4,
    title: "START Talent Development",
    image: start,
    program: "START",
    location: "Gombe State",
    status: "Ongoing",
    featured: true,
    summary:
      "Supporting Talent Advancement in Rural Africa through technology, leadership and entrepreneurship training.",
    beneficiaries: "650+ Youths",
    slug: "start-program",
  },

  {
    id: 5,
    title: "Digital Skills for Youth",
    image: digitalSkills,
    program: "Education",
    location: "Gombe State",
    status: "Ongoing",
    featured: false,
    summary:
      "Equipping young people with digital literacy, programming, graphic design and entrepreneurship skills.",
    beneficiaries: "650+ Youths",
    slug: "digital-skills-for-youth",
  },

  {
    id: 6,
    title: "Clean Water for Rural Communities",
    image: cleanWater,
    program: "Water & Sanitation",
    location: "Bauchi State",
    status: "Completed",
    featured: false,
    summary:
      "Providing access to clean and safe drinking water through borehole construction and hygiene education.",
    beneficiaries: "3,500+ Residents",
    slug: "clean-water-project",
  },

  {
    id: 7,
    title: "Women Entrepreneurship Program",
    image: womenBusiness,
    program: "Women Empowerment",
    location: "Adamawa State",
    status: "Ongoing",
    featured: false,
    summary:
      "Supporting women with vocational training, business mentorship and startup grants.",
    beneficiaries: "400 Women",
    slug: "women-business",
  },

  {
    id: 8,
    title: "Green Africa Campaign",
    image: greenAfrica,
    program: "Climate Action",
    location: "Northeast Nigeria",
    status: "Ongoing",
    featured: false,
    summary:
      "Tree planting, environmental awareness and sustainable climate initiatives.",
    beneficiaries: "10 Communities",
    slug: "green-africa",
  },

  {
    id: 9,
    title: "School Support Program",
    image: schoolSupport,
    program: "Education",
    location: "Yobe State",
    status: "Completed",
    featured: false,
    summary:
      "Distribution of educational materials, scholarships and classroom renovations.",
    beneficiaries: "2,000 Students",
    slug: "school-support",
  },

  {
    id: 10,
    title: "Maternal Health Outreach",
    image: maternalHealth,
    program: "Health",
    location: "Taraba State",
    status: "Ongoing",
    featured: false,
    summary:
      "Improving maternal healthcare through free medical outreach and awareness campaigns.",
    beneficiaries: "1,200 Mothers",
    slug: "maternal-health",
  },

  {
    id: 11,
    title: "Food Security Initiative",
    image: foodSecurity,
    program: "Agriculture",
    location: "Gombe State",
    status: "Ongoing",
    featured: false,
    summary:
      "Training farmers on climate-smart agriculture while providing improved seedlings and farming tools.",
    beneficiaries: "800 Farmers",
    slug: "food-security",
  },

  {
    id: 12,
    title: "Community Health Volunteers",
    image: communityHealth,
    program: "Health",
    location: "Borno State",
    status: "Completed",
    featured: false,
    summary:
      "Training volunteers to provide basic healthcare services and health education in rural communities.",
    beneficiaries: "5,000 Residents",
    slug: "community-health",
  },
];
