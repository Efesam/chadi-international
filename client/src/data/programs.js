import {
  FaHeartbeat,
  FaLaptopCode,
  FaGraduationCap,
  FaSeedling,
  FaFemale,
  FaLeaf,
} from "react-icons/fa";

export const programs = [
  {
  id: 1,

  slug: "health-nutrition",

  title: "Health & Nutrition",

  shortDescription:
    "Improving maternal and child health through sustainable nutrition interventions.",

  description:
    "Our Health & Nutrition initiative focuses on reducing malnutrition, improving maternal health, promoting infant and young child nutrition, and supporting vulnerable families through community-based healthcare interventions.",

  beneficiaries: [
    "Children under five",
    "Pregnant women",
    "Nursing mothers",
    "Rural communities",
  ],

  objectives: [
    "Reduce child malnutrition",
    "Improve maternal health",
    "Promote nutrition education",
    "Strengthen community healthcare",
  ],

  icon: FaHeartbeat,

  color: "bg-red-100",

  image: "/images/programs/health.jpg",
},
  {
    id: 2,
    title: "SORCEST",
    slug: "sorcest",
    icon: FaLaptopCode,
    color: "bg-blue-100",
    beneficiaries: "Orphans • Children with Disabilities",
    description:
      "Providing education, digital skills, mentorship and talent development for vulnerable children.",
  },
  {
    id: 3,
    title: "START",
    slug: "start",
    icon: FaGraduationCap,
    color: "bg-yellow-100",
    beneficiaries: "Youth",
    description:
      "Supporting Talent Advancement in Rural Africa for Transformation through skills development and innovation.",
  },
  {
    id: 4,
    title: "HELP",
    slug: "help",
    icon: FaSeedling,
    color: "bg-green-100",
    beneficiaries: "Families",
    description:
      "Hunger Eradication and Livelihood Promotion through food security and economic empowerment.",
  },
  {
    id: 5,
    title: "Girlie M3",
    slug: "girlie-m3",
    icon: FaFemale,
    color: "bg-pink-100",
    beneficiaries: "Girls & Women",
    description:
      "Empowering women through mental wellness, menstrual health, skills acquisition and motherhood support.",
  },
  {
    id: 6,
    title: "SAFE Project",
    slug: "safe-project",
    icon: FaLeaf,
    color: "bg-emerald-100",
    beneficiaries: "Communities",
    description:
      "Climate action, environmental sustainability and resilience for vulnerable communities.",
  },
];