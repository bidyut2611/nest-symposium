import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  // First, delete all existing events to avoid duplicates
  await prisma.event.deleteMany({});
  console.log('Cleared existing events.');

  // =============================================
  // DAY 1 — 10th August 2026
  // Registration & Inaugural Day
  // =============================================
  const day1Events = [
    {
      title: 'Registration & Welcome Desk',
      description: 'Delegate registration, badge collection, and info desk.',
      speaker: '',
      date: '2026-08-10',
      startTime: '11:00',
      endTime: '14:00',
      location: 'Registration Area',
      category: 'ceremony',
      order: 1,
    },
    {
      title: 'Lunch',
      description: 'Lunch for early arrivals, speakers, and delegates.',
      speaker: '',
      date: '2026-08-10',
      startTime: '14:00',
      endTime: '15:00',
      location: 'Dining Hall',
      category: 'break',
      order: 2,
    },
    {
      title: 'Inaugural Ceremony – Opening & Lamp Lighting',
      description: 'Opening remarks, lamp lighting, introduction to North Eastern Science & Technology Cluster.',
      speaker: '',
      date: '2026-08-10',
      startTime: '15:30',
      endTime: '16:00',
      location: 'Main Auditorium',
      category: 'ceremony',
      order: 3,
    },
    {
      title: 'Keynote & Special Addresses',
      description: 'Keynote by chief guest; addresses by invited dignitaries and institutional leaders.',
      speaker: '',
      date: '2026-08-10',
      startTime: '16:00',
      endTime: '17:15',
      location: 'Main Auditorium',
      category: 'keynote',
      order: 4,
    },
    {
      title: 'Inaugural Panel / Discussion',
      description: 'Panel on "Science, Technology and Innovation in North East India" (Govt, academia, industry, MSME, startup, and aligned agencies).',
      speaker: '',
      date: '2026-08-10',
      startTime: '17:15',
      endTime: '18:15',
      location: 'Main Auditorium',
      category: 'panel',
      order: 5,
    },
    {
      title: 'Vote of Thanks & Day-2 Briefing',
      description: 'Formal closing of inaugural session; announcements for the next day.',
      speaker: '',
      date: '2026-08-10',
      startTime: '18:15',
      endTime: '18:30',
      location: 'Main Auditorium',
      category: 'ceremony',
      order: 6,
    },
    {
      title: 'Cultural Programme by North Eastern States',
      description: 'Performances representing different states of the North East.',
      speaker: '',
      date: '2026-08-10',
      startTime: '18:30',
      endTime: '19:30',
      location: 'Main Auditorium',
      category: 'ceremony',
      order: 7,
    },
    {
      title: 'Gala / Networking Dinner',
      description: 'Informal interactions among speakers, government officers, faculty, and participants.',
      speaker: '',
      date: '2026-08-10',
      startTime: '19:30',
      endTime: '21:00',
      location: 'Banquet Hall',
      category: 'break',
      order: 8,
    },
  ];

  // =============================================
  // DAY 2 — 11th August 2026
  // Product Expo, Technologies & Hackathon Session
  // =============================================
  const day2Events = [
    {
      title: 'Product Expo by HUB, Spoke Institutes and Startups',
      description: 'Product exhibition running throughout the day by HUB, Spoke Institutes and Startups.',
      speaker: '',
      date: '2026-08-11',
      startTime: '10:00',
      endTime: '16:30',
      location: 'Exhibition Hall',
      category: 'session',
      order: 10,
    },
    {
      title: 'Session 1 – Technologies Sessions',
      description: 'Technical Talks across 4 halls: Hall 1 – Grassroot Technologies and Innovations | Hall 2 – Semiconductor and Artificial Intelligence | Hall 3 – Bamboo Innovation, Technologies and Skill Development | Hall 4 – Biodegradable Plastics and Solid Waste Management.',
      speaker: '',
      date: '2026-08-11',
      startTime: '10:00',
      endTime: '13:00',
      location: 'Hall 1, Hall 2, Hall 3, Hall 4',
      category: 'session',
      order: 11,
    },
    {
      title: 'Lunch Break',
      description: 'Buffet lunch; suggested seating mix of policy makers, faculty, and participants to encourage interaction.',
      speaker: '',
      date: '2026-08-11',
      startTime: '13:00',
      endTime: '14:15',
      location: 'Dining Hall',
      category: 'break',
      order: 12,
    },
    {
      title: 'Session 2 – Hackathon Sessions',
      description: 'Hackathon across 4 halls: Hall 1 – Grassroot Technologies and Innovations | Hall 2 – Semiconductor and Artificial Intelligence | Hall 3 – Bamboo Innovation, Technologies and Skill Development | Hall 4 – Biodegradable Plastics and Solid Waste Management.',
      speaker: '',
      date: '2026-08-11',
      startTime: '14:30',
      endTime: '16:30',
      location: 'Hall 1, Hall 2, Hall 3, Hall 4',
      category: 'workshop',
      order: 13,
    },
    {
      title: 'Poster Presentation (Tentative), Tea Break & Networking',
      description: 'Poster presentation by the Participants on each vertical (Tentative). Tea/coffee; targeted networking between government officers, faculty, industry, and start-ups.',
      speaker: '',
      date: '2026-08-11',
      startTime: '16:30',
      endTime: '17:00',
      location: 'Exhibition Hall',
      category: 'session',
      order: 14,
    },
    {
      title: 'Session 3 – Thematic Dialogue / Open House',
      description: 'Moderated discussion, feedback from stakeholders, and identification of collaboration opportunities for the Cluster.',
      speaker: '',
      date: '2026-08-11',
      startTime: '17:00',
      endTime: '17:30',
      location: 'Main Auditorium',
      category: 'panel',
      order: 15,
    },
    {
      title: 'Cultural Programme by North Eastern States',
      description: 'Performances representing different states of the North East.',
      speaker: '',
      date: '2026-08-11',
      startTime: '17:30',
      endTime: '18:30',
      location: 'Main Auditorium',
      category: 'ceremony',
      order: 16,
    },
    {
      title: 'Informal Dinner / City Time',
      description: 'Either host a dinner or have a free evening, depending on logistics and budget.',
      speaker: '',
      date: '2026-08-11',
      startTime: '19:30',
      endTime: '21:00',
      location: '',
      category: 'break',
      order: 17,
    },
  ];

  // =============================================
  // DAY 3 — 12th August 2026
  // Product Expo, Startup, Policy Making & Closing Ceremony
  // =============================================
  const day3Events = [
    {
      title: 'Product Expo by HUB, Spoke Institutes and Startups',
      description: 'Product exhibition running throughout the day by HUB, Spoke Institutes and Startups.',
      speaker: '',
      date: '2026-08-12',
      startTime: '10:00',
      endTime: '16:00',
      location: 'Exhibition Hall',
      category: 'session',
      order: 20,
    },
    {
      title: 'Session 4: Startup to Scale-Up – Interactive Entrepreneurship Session',
      description: 'Interactive session featuring: Icebreaker and Startup Bingo (0–20 min) – Participants interact through a fun networking bingo based on startups, innovation, sustainability, funding and entrepreneurship. | 60-second Startup Idea Challenge (20–50 min) – Teams or individuals pitch a startup idea in just 60 seconds based on themes like biodegradable products, AI, semiconductors, bamboo innovation, waste management etc. | Build a Startup Activity (50–100 min) – Teams develop a mini startup model including product idea, target customer, branding, revenue model and marketing strategy using charts/sticky notes. | Connect with NEST Cluster: From Idea to Scale-up (100–120 min) – Interactive discussion on how NEST Cluster can support startups through incubation, mentoring, prototyping, technical guidance, networking, funding opportunities, industry linkages, product validation, branding and technology commercialization.',
      speaker: '',
      date: '2026-08-12',
      startTime: '10:00',
      endTime: '13:00',
      location: 'Main Auditorium',
      category: 'workshop',
      order: 21,
    },
    {
      title: 'Lunch Break',
      description: 'Delegates encouraged to visit exhibition area before/after lunch.',
      speaker: '',
      date: '2026-08-12',
      startTime: '13:00',
      endTime: '14:15',
      location: 'Dining Hall',
      category: 'break',
      order: 22,
    },
    {
      title: 'Session 4: Policy and Future Map',
      description: 'Thematic talks by government officers on schemes, funding opportunities, and regional policies; includes a short comfort/stretch break around mid-session if needed. Parallel tracks across 4 halls: Hall 1 – Policies and Future Roadmap on Grassroot Technologies and Innovations | Hall 2 – Policies and Future Roadmap on Semiconductor and Artificial Intelligence | Hall 3 – Policies and Future Roadmap on Bamboo Innovation, Technologies and Skill Development | Hall 4 – Policies and Future Roadmap on Biodegradable Plastics and Solid Waste Management.',
      speaker: '',
      date: '2026-08-12',
      startTime: '14:30',
      endTime: '16:30',
      location: 'Hall 1, Hall 2, Hall 3, Hall 4',
      category: 'panel',
      order: 23,
    },
    {
      title: 'High Tea',
      description: 'Tea/coffee and light snacks; final networking opportunity.',
      speaker: '',
      date: '2026-08-12',
      startTime: '16:30',
      endTime: '16:45',
      location: 'Lobby Area',
      category: 'break',
      order: 24,
    },
    {
      title: 'Closing Ceremony & Prize Distribution',
      description: 'Brief report of the conference, feedback remarks, announcement of best oral/poster/expo awards, closing remarks, and formal vote of thanks.',
      speaker: '',
      date: '2026-08-12',
      startTime: '17:00',
      endTime: '18:30',
      location: 'Main Auditorium',
      category: 'ceremony',
      order: 25,
    },
  ];

  // Insert all events
  const allEvents = [...day1Events, ...day2Events, ...day3Events];

  await prisma.event.createMany({ data: allEvents });
  console.log(`Successfully inserted ${allEvents.length} events across 3 days.`);

  // Update the program-intro content block
  await prisma.contentBlock.updateMany({
    where: { slug: 'program-intro' },
    data: {
      content: 'Explore the comprehensive three-day Tentative Symposium Schedule for the NEST Cluster Symposium 2026 (10th – 12th August 2026). The program features inaugural ceremonies, technology sessions, hackathons, startup activities, policy discussions, cultural performances, and a closing ceremony with prize distribution.',
    },
  });

  // Update the hero-date content block
  await prisma.contentBlock.updateMany({
    where: { slug: 'hero-date' },
    data: {
      content: 'August 10-12, 2026 | IIT Guwahati Campus',
    },
  });

  console.log('Updated content blocks.');
  console.log('Done! All program data has been seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
