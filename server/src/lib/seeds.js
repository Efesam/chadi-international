// Seed data for each CMS collection. These only run once, the first time
// a collection's JSON file doesn't exist yet - after that, the admin panel
// is the source of truth and these functions are never called again.

export function seedProjects() {
  return [
    { id: "project_miycn", slug: "community-miycn", title: "Community MIYCN Campaign", image: "/uploads/projects/miycn.jpg", program: "Health & Nutrition", location: "Gombe State", status: "Active", featured: true, summary: "Improving maternal, infant and young child nutrition in underserved communities.", beneficiaries: "500+ Mothers & Children" },
    { id: "project_sorcest", slug: "sovcest-tech", title: "Digital Skills for Orphans", image: "/uploads/projects/sorcest.jpg", program: "SOVCEST", location: "Bauchi State", status: "Ongoing", featured: true, summary: "Providing technology education, mentorship and digital skills training for orphaned children.", beneficiaries: "150 Students" },
    { id: "project_help", slug: "help-food", title: "HELP Food Distribution", image: "/uploads/projects/help.jpg", program: "HELP", location: "Yobe State", status: "Completed", featured: true, summary: "Delivering food and livelihood support to vulnerable families.", beneficiaries: "1,200 Families" },
    { id: "project_start", slug: "start-program", title: "START Talent Development", image: "/uploads/projects/start.jpg", program: "START", location: "Gombe State", status: "Ongoing", featured: true, summary: "Supporting Talent Advancement in Rural Africa through technology, leadership and entrepreneurship training.", beneficiaries: "650+ Youths" },
    { id: "project_digital_skills", slug: "digital-skills-for-youth", title: "Digital Skills for Youth", image: "/uploads/projects/digital-skills.jpg", program: "Education", location: "Gombe State", status: "Ongoing", featured: false, summary: "Equipping young people with digital literacy, programming, graphic design and entrepreneurship skills.", beneficiaries: "650+ Youths" },
    { id: "project_clean_water", slug: "clean-water-project", title: "Clean Water for Rural Communities", image: "/uploads/projects/clean-water.jpg", program: "Water & Sanitation", location: "Bauchi State", status: "Completed", featured: false, summary: "Providing access to clean and safe drinking water through borehole construction and hygiene education.", beneficiaries: "3,500+ Residents" },
    { id: "project_women_business", slug: "women-business", title: "Women Entrepreneurship Program", image: "/uploads/projects/women-business.jpg", program: "Women Empowerment", location: "Adamawa State", status: "Ongoing", featured: false, summary: "Supporting women with vocational training, business mentorship and startup grants.", beneficiaries: "400 Women" },
    { id: "project_green_africa", slug: "green-africa", title: "Green Africa Campaign", image: "/uploads/projects/green-africa.jpg", program: "Climate Action", location: "Northeast Nigeria", status: "Ongoing", featured: false, summary: "Tree planting, environmental awareness and sustainable climate initiatives.", beneficiaries: "10 Communities" },
    { id: "project_school_support", slug: "school-support", title: "School Support Program", image: "/uploads/projects/school-support.jpg", program: "Education", location: "Yobe State", status: "Completed", featured: false, summary: "Distribution of educational materials, scholarships and classroom renovations.", beneficiaries: "2,000 Students" },
    { id: "project_maternal_health", slug: "maternal-health", title: "Maternal Health Outreach", image: "/uploads/projects/maternal-health.jpg", program: "Health", location: "Taraba State", status: "Ongoing", featured: false, summary: "Improving maternal healthcare through free medical outreach and awareness campaigns.", beneficiaries: "1,200 Mothers" },
    { id: "project_food_security", slug: "food-security", title: "Food Security Initiative", image: "/uploads/projects/food-security.jpg", program: "Agriculture", location: "Gombe State", status: "Ongoing", featured: false, summary: "Training farmers on climate-smart agriculture while providing improved seedlings and farming tools.", beneficiaries: "800 Farmers" },
    { id: "project_community_health", slug: "community-health", title: "Community Health Volunteers", image: "/uploads/projects/community-health.jpg", program: "Health", location: "Borno State", status: "Completed", featured: false, summary: "Training volunteers to provide basic healthcare services and health education in rural communities.", beneficiaries: "5,000 Residents" },
  ];
}

export function seedEvents() {
  return [
    { id: "event_1", title: "Community Health and Nutrition Outreach", date: "August 12, 2026", location: "Gombe State", type: "Health", description: "A practical outreach for mothers, caregivers and children with nutrition education, screening and referrals." },
    { id: "event_2", title: "Youth Digital Skills Bootcamp", date: "September 4, 2026", location: "Bauchi State", type: "Education", description: "Hands-on training in digital literacy, design, productivity tools and entrepreneurship for young people." },
    { id: "event_3", title: "Volunteer Orientation Day", date: "October 18, 2026", location: "Online and Field Hubs", type: "Volunteer", description: "An onboarding session for new volunteers supporting CHADI programs, campaigns and community mobilization." },
  ];
}

export function seedTeam() {
  return [
    { id: "team_1", name: "Caleb Omale", role: "Chief Executive Officer", department: "Executive", bio: "Founder of CHADI International.", email: "", linkedin: "", twitter: "", image: "", featured: true },
    { id: "team_2", name: "Doxa Ojo", role: "Programs Officer", department: "Programs", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_3", name: "Sarah Phrantline", role: "Assistant Programs Officer", department: "Programs", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_4", name: "Adonai O. Eveso", role: "Creativity, Research & Development Officer", department: "Research", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_5", name: "Rebecca Dongs", role: "Assistant Creativity, Research & Development Officer", department: "Research", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_6", name: "Williams Bissong", role: "Training & Community Mobilization Officer", department: "Community", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_7", name: "Hajara Waziri", role: "Health & Welfare Officer", department: "Health", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_8", name: "Liyatu Mala'aiki Abidan", role: "Assistant Health & Welfare Officer", department: "Health", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_9", name: "Juliet Jules", role: "Finance & Partnership Officer", department: "Finance", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_10", name: "Praise Zinariya", role: "Assistant Finance & Partnership Officer", department: "Finance", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_11", name: "Bathsheba Queen", role: "Community & Communications Manager", department: "Communications", bio: "", email: "", linkedin: "", twitter: "", image: "", featured: false },
  ];
}

export function seedNews() {
  return [
    {
      id: "news_1",
      slug: "miycn-community-outreach",
      title: "CHADI Reaches Hundreds Through MIYCN Community Outreach",
      category: "Health",
      date: "July 5, 2026",
      author: "CHADI Communications",
      image: "",
      excerpt: "Our MIYCN outreach empowered mothers and caregivers with practical nutrition knowledge.",
      content:
        "<p>Caleb Hope Alive Development Initiative (CHADI) successfully concluded a Maternal, Infant and Young Child Nutrition (MIYCN) outreach in Gombe State.</p><p>The outreach provided nutrition education, health screening, and counselling sessions for mothers and caregivers.</p><p>Over 500 beneficiaries participated in the program.</p>",
    },
    {
      id: "news_2",
      slug: "digital-skills-training",
      title: "Youth Complete Digital Skills Training",
      category: "Education",
      date: "June 18, 2026",
      author: "CHADI Communications",
      image: "",
      excerpt: "Young people graduated after completing CHADI's digital literacy programme.",
      content:
        "<p>Participants completed intensive training in digital literacy, graphic design, entrepreneurship, and productivity tools.</p><p>The programme prepares young people for employment and self-employment opportunities.</p>",
    },
  ];
}

// Gallery, Partners and Stories are brand-new content types with no existing
// real data - they seed empty on purpose so the admin adds genuine content
// through the dashboard rather than shipping placeholder/fake entries.
export function seedGallery() {
  return [];
}

export function seedPartners() {
  return [];
}

export function seedStories() {
  return [];
}

export function seedSettings() {
  return {
    stats: [
      { label: "Projects", value: 16 },
      { label: "Beneficiaries", value: 12000 },
      { label: "Volunteers", value: 250 },
      { label: "Communities", value: 30 },
    ],
    fundAllocation: [
      { category: "Programs & Field Work", percentage: 80 },
      { category: "Administration", percentage: 12 },
      { category: "Fundraising & Outreach", percentage: 8 },
    ],
    contactEmail: "info@chadiinternational.org",
    focusRegion: "Nigeria and underserved African communities",
    officeHours: "Monday to Friday, 9:00 AM - 5:00 PM",
    socials: { facebook: "", twitter: "", instagram: "", linkedin: "" },
  };
}
