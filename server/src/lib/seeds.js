// Seed data for each CMS collection. These only run once, the first time
// a collection's JSON file doesn't exist yet - after that, the admin panel
// is the source of truth and these functions are never called again.

export function seedProjects() {
  return [
    { id: "project_miycn", slug: "community-miycn", title: "MIYCAN Project", image: "/uploads/projects/miycn.jpg", program: "MIYCAN", pillar: "PROTECT", location: "Gombe State", status: "Active", featured: true, summary: "Improving maternal, infant, young child and adolescent health through nutrition, health education and preventive healthcare in underserved communities.", beneficiaries: "500+ Mothers & Children" },
    { id: "project_sorcest", slug: "sovcest-tech", title: "SOVCEST Project", image: "/uploads/projects/sorcest.jpg", program: "SOVCEST", pillar: "PROTECT", location: "Gombe State", status: "Ongoing", featured: true, summary: "CHADI's flagship child protection and development programme supporting children with disabilities, orphans and vulnerable children through protection, counselling, education, skills acquisition and talent development.", beneficiaries: "150 Students" },
    { id: "project_help", slug: "help-food", title: "HELP Food Distribution", image: "/uploads/projects/help.jpg", program: "Child Relief and Recovery", pillar: "PROTECT", location: "Yobe State", status: "Completed", featured: true, summary: "Delivering food and livelihood support to vulnerable families as part of CHADI's humanitarian response.", beneficiaries: "1,200 Families" },
    { id: "project_start", slug: "start-program", title: "START Talent Development", image: "/uploads/projects/start.jpg", program: "SOVCEST", pillar: "PROTECT", location: "Gombe State", status: "Ongoing", featured: true, summary: "Supporting Talent Advancement in Rural Africa (START) - the talent development component of SOVCEST - through technology, leadership and entrepreneurship training for vulnerable children and youth.", beneficiaries: "650+ Youths" },
    { id: "project_digital_skills", slug: "digital-skills-for-youth", title: "Digital Skills for Youth", image: "/uploads/projects/digital-skills.jpg", program: "Future Ready Initiative", pillar: "EMPOWER", location: "Gombe State", status: "Ongoing", featured: false, summary: "Equipping young people with digital literacy, programming, graphic design and entrepreneurship skills.", beneficiaries: "650+ Youths" },
    { id: "project_clean_water", slug: "clean-water-project", title: "Clean Water for Rural Communities", image: "/uploads/projects/clean-water.jpg", program: "Child Relief and Recovery", pillar: "PROTECT", location: "Bauchi State", status: "Completed", featured: false, summary: "Providing access to clean and safe drinking water through borehole construction and hygiene education (WASH).", beneficiaries: "3,500+ Residents" },
    { id: "project_women_business", slug: "women-business", title: "Women Entrepreneurship Program", image: "/uploads/projects/women-business.jpg", program: "Future Ready Initiative", pillar: "EMPOWER", location: "Adamawa State", status: "Ongoing", featured: false, summary: "Supporting women with vocational training, business mentorship and startup grants.", beneficiaries: "400 Women" },
    { id: "project_green_africa", slug: "green-africa", title: "Green Africa Campaign", image: "/uploads/projects/green-africa.jpg", program: "Green Futures", pillar: "THRIVE", location: "Northeast Nigeria", status: "Ongoing", featured: false, summary: "Tree planting, environmental awareness and sustainable climate initiatives led by young people.", beneficiaries: "10 Communities" },
    { id: "project_school_support", slug: "school-support", title: "School Support Program", image: "/uploads/projects/school-support.jpg", program: "SOVCEST", pillar: "PROTECT", location: "Yobe State", status: "Completed", featured: false, summary: "Distribution of educational materials, scholarships and classroom renovations as part of SOVCEST's education support.", beneficiaries: "2,000 Students" },
    { id: "project_maternal_health", slug: "maternal-health", title: "Maternal Health Outreach", image: "/uploads/projects/maternal-health.jpg", program: "MIYCAN", pillar: "PROTECT", location: "Taraba State", status: "Ongoing", featured: false, summary: "Improving maternal healthcare through free medical outreach and awareness campaigns.", beneficiaries: "1,200 Mothers" },
    { id: "project_food_security", slug: "food-security", title: "Food Security Initiative", image: "/uploads/projects/food-security.jpg", program: "Green Futures", pillar: "THRIVE", location: "Gombe State", status: "Ongoing", featured: false, summary: "Training farmers on climate-smart agriculture while providing improved seedlings and farming tools.", beneficiaries: "800 Farmers" },
    { id: "project_community_health", slug: "community-health", title: "Community Health Volunteers", image: "/uploads/projects/community-health.jpg", program: "MIYCAN", pillar: "PROTECT", location: "Borno State", status: "Completed", featured: false, summary: "Training volunteers to provide basic healthcare services and health education in rural communities.", beneficiaries: "5,000 Residents" },
    { id: "project_choices", slug: "choices-project", title: "CHOICES Project", image: "/uploads/projects/choices.jpg", program: "CHOICES Project", pillar: "EMPOWER", location: "Bauchi State", status: "Ongoing", featured: false, summary: "Creating Healthy Opportunities, Informed Choices and Empowered Students - drug abuse prevention, life skills and leadership development for students.", beneficiaries: "300+ Students" },
    { id: "project_youth_leadership", slug: "youth-leadership-civic-engagement", title: "Youth Leadership and Civic Engagement Initiative", image: "/uploads/projects/youth-leadership.jpg", program: "Youth Leadership and Civic Engagement Initiative", pillar: "EMPOWER", location: "Gombe State", status: "Ongoing", featured: false, summary: "Building a generation of ethical, confident and community-minded young leaders through mentorship, volunteerism and civic education.", beneficiaries: "200+ Youth Leaders" },
    { id: "project_pad_period_care", slug: "pad-period-care-bank", title: "CHADI Pad and Period Care Bank", image: "/uploads/projects/pad-period-care.jpg", program: "CHADI Pad and Period Care Bank", pillar: "THRIVE", location: "Gombe State", status: "Ongoing", featured: false, summary: "Ending period poverty and promoting menstrual dignity so girls can remain healthy, confident and in school.", beneficiaries: "1,000+ Girls" },
    { id: "project_still_here", slug: "still-here", title: "Still Here", image: "/uploads/projects/still-here.jpg", program: "Still Here", pillar: "THRIVE", location: "Bauchi State", status: "Ongoing", featured: false, summary: "Promoting mental wellbeing and improving the lives of children and young people affected by mental health challenges and sickle cell disease through awareness, prevention, advocacy, counselling and survivor support.", beneficiaries: "500+ Young People" },
  ];
}

export function seedEvents() {
  return [
    { id: "event_1", title: "Community Health and Nutrition Outreach", date: "August 12, 2026", location: "Gombe State", type: "Health", image: "/uploads/projects/miycn.jpg", description: "A practical outreach for mothers, caregivers and children with nutrition education, screening and referrals." },
    { id: "event_2", title: "Youth Digital Skills Bootcamp", date: "September 4, 2026", location: "Bauchi State", type: "Education", image: "/uploads/projects/digital-skills.jpg", description: "Hands-on training in digital literacy, design, productivity tools and entrepreneurship for young people." },
    { id: "event_3", title: "Volunteer Orientation Day", date: "October 18, 2026", location: "Online and Field Hubs", type: "Volunteer", image: "/uploads/projects/start.jpg", description: "An onboarding session for new volunteers supporting CHADI programs, campaigns and community mobilization." },
  ];
}

export function seedTeam() {
  return [
    { id: "team_1", name: "Caleb Omale", role: "Chief Executive Officer", department: "Executive", bio: "Founder of CHADI International.", email: "", linkedin: "", twitter: "", image: "", featured: true },
    { id: "team_2", name: "Doxa Ojo", role: "Programs Officer", department: "Programs", bio: "Leads the design and day-to-day coordination of CHADI's community programs, ensuring initiatives are delivered where they're needed most.", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_3", name: "Sarah Phrantline", role: "Assistant Programs Officer", department: "Programs", bio: "Supports program planning and field coordination, helping CHADI's initiatives run smoothly from design to delivery.", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_4", name: "Adonai O. Eveso", role: "Creativity, Research & Development Officer", department: "Research", bio: "Drives research, creative direction and new program development to keep CHADI's work innovative and evidence-based.", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_5", name: "Rebecca Dongs", role: "Assistant Creativity, Research & Development Officer", department: "Research", bio: "Supports research and creative development, helping shape new ideas into practical community programs.", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_6", name: "Williams Bissong", role: "Training & Community Mobilization Officer", department: "Community", bio: "Leads training and mobilization efforts, building strong partnerships with the communities CHADI serves.", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_7", name: "Hajara Waziri", role: "Health & Welfare Officer", department: "Health", bio: "Oversees CHADI's health and welfare initiatives, connecting communities with essential care and support.", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_8", name: "Liyatu Mala'aiki Abidan", role: "Assistant Health & Welfare Officer", department: "Health", bio: "Supports the delivery of health and welfare programs, helping ensure care reaches those who need it most.", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_9", name: "Juliet Jules", role: "Finance & Partnership Officer", department: "Finance", bio: "Manages financial operations and partnership relationships that keep CHADI's programs accountable and well-funded.", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_10", name: "Praise Zinariya", role: "Assistant Finance & Partnership Officer", department: "Finance", bio: "Supports financial management and partner coordination across CHADI's programs.", email: "", linkedin: "", twitter: "", image: "", featured: false },
    { id: "team_11", name: "Bathsheba Queen", role: "Community & Communications Manager", department: "Communications", bio: "Leads community engagement and communications, sharing CHADI's work and impact with the public.", email: "", linkedin: "", twitter: "", image: "", featured: false },
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

export function seedBlog() {
  return [];
}

export function seedTestimonials() {
  return [
    {
      id: "testimonial_1",
      name: "Amina Yusuf",
      location: "Gombe State",
      image: "",
      quote: "CHADI gave me the opportunity to learn digital skills that completely changed my future.",
    },
    {
      id: "testimonial_2",
      name: "John Bala",
      location: "Bauchi State",
      image: "",
      quote: "Their healthcare outreach saved lives in our community. We are grateful for their dedication.",
    },
    {
      id: "testimonial_3",
      name: "Rebecca Musa",
      location: "Yobe State",
      image: "",
      quote: "The women empowerment program helped me start my own business and support my family.",
    },
  ];
}

export function seedFaqs() {
  return [
    {
      id: "faq_1",
      question: "What does CHADI do?",
      answer:
        "CHADI supports underserved communities through health, education, humanitarian relief, youth development, protection and livelihood programs.",
    },
    {
      id: "faq_2",
      question: "How can I volunteer?",
      answer:
        "You can apply through the volunteer page. The team will review your interest areas and follow up with next steps.",
    },
    {
      id: "faq_3",
      question: "Can organizations partner with CHADI?",
      answer: "Yes. CHADI welcomes program, funding, research and field implementation partnerships.",
    },
    {
      id: "faq_4",
      question: "Where does CHADI work?",
      answer:
        "CHADI focuses on Nigeria and underserved African communities, with projects designed around local needs.",
    },
  ];
}

export function seedReports() {
  return [];
}

export function seedBoard() {
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
    // Shown on donation receipts (PDF and email) when set - e.g. a CAC
    // registration number. Left blank by default since this is real
    // organizational information only CHADI can provide accurately.
    orgRegistration: "",
    // Also shown on donation receipts once set - a registered address and
    // phone number are what turn a receipt into something a donor's
    // accountant or tax authority will actually accept. Left blank by
    // default for the same reason as orgRegistration above.
    orgAddress: "",
    orgPhone: "",
    // An authorized signatory line on receipts (e.g. "Jane Doe, Executive
    // Director") - left blank by default since only CHADI can say who that
    // actually is; the receipt simply omits the signature line until set.
    receiptSignatory: "",
    // Shown on the public Governance page once written - left blank by
    // default rather than seeded with placeholder policy claims, since a
    // safeguarding policy is a real commitment only CHADI can accurately state.
    safeguardingPolicy: "",
    // The personal thank-you letter on a general (non-project) donation
    // receipt - left blank so lib/receiptImpact.js's own default letter is
    // used until CHADI writes their own. See that file for the {name}/
    // {percentage} placeholders it supports.
    donationLetter: "",
    // The 5-part automated "welcome series" sent to new newsletter
    // subscribers and new donors (see lib/emailSequence.js). Each step left
    // blank uses that file's own DEFAULT_TEMPLATES until CHADI writes their
    // own subject/body.
    emailSequence: {
      welcome: { subject: "", body: "" },
      story: { subject: "", body: "" },
      impact: { subject: "", body: "" },
      donationAsk: { subject: "", body: "" },
      updates: { subject: "", body: "" },
    },
  };
}
