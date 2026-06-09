import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  // Seed Speakers
  await prisma.speaker.createMany({
    data: [
      {
        name: 'Dr. Rajesh Kumar',
        title: 'Director, NEST Cluster | IIT Guwahati',
        bio: 'Leading researcher in advanced materials and nanotechnology with over 20 years of experience in semiconductor research and innovation.',
        imageUrl: '',
        order: 1,
      },
      {
        name: 'Prof. Ananya Sharma',
        title: 'Head of AI Research, IISc Bangalore',
        bio: 'Pioneer in artificial intelligence applications for scientific discovery, with extensive work in machine learning for materials science.',
        imageUrl: '',
        order: 2,
      },
      {
        name: 'Dr. Vikram Patel',
        title: 'Chief Scientist, DRDO',
        bio: 'Expert in defense electronics and strategic technologies. Has led multiple national-level projects in sensor development.',
        imageUrl: '',
        order: 3,
      },
      {
        name: 'Prof. Meera Nair',
        title: 'Professor of Physics, IIT Bombay',
        bio: 'Renowned physicist specializing in quantum computing and photonics. Published over 150 peer-reviewed papers in top journals.',
        imageUrl: '',
        order: 4,
      },
    ],
  });

  // Seed Events
  await prisma.event.createMany({
    data: [
      {
        title: 'Opening Ceremony & Welcome Address',
        description: 'Inaugural address by the Director of NEST Cluster, followed by the lighting of the lamp and welcome remarks from distinguished guests.',
        speaker: 'Dr. Rajesh Kumar',
        date: '2026-08-15',
        startTime: '09:00',
        endTime: '10:00',
        location: 'Main Auditorium',
        category: 'ceremony',
        order: 1,
      },
      {
        title: 'Keynote: Future of Semiconductor Research in India',
        description: 'A comprehensive overview of India\'s semiconductor roadmap, current capabilities, and future opportunities in the global landscape.',
        speaker: 'Dr. Vikram Patel',
        date: '2026-08-15',
        startTime: '10:30',
        endTime: '11:30',
        location: 'Main Auditorium',
        category: 'keynote',
        order: 2,
      },
      {
        title: 'AI-Driven Materials Discovery',
        description: 'Exploring how machine learning and AI tools are revolutionizing the discovery of new materials for electronics and energy applications.',
        speaker: 'Prof. Ananya Sharma',
        date: '2026-08-15',
        startTime: '11:45',
        endTime: '12:45',
        location: 'Hall A',
        category: 'session',
        order: 3,
      },
      {
        title: 'Lunch & Networking',
        description: 'Networking session with refreshments. Opportunity to connect with researchers and industry professionals.',
        speaker: '',
        date: '2026-08-15',
        startTime: '13:00',
        endTime: '14:00',
        location: 'Dining Hall',
        category: 'break',
        order: 4,
      },
      {
        title: 'Quantum Computing: From Theory to Applications',
        description: 'Deep dive into quantum computing fundamentals and practical applications in cryptography, drug discovery, and optimization.',
        speaker: 'Prof. Meera Nair',
        date: '2026-08-15',
        startTime: '14:00',
        endTime: '15:00',
        location: 'Hall B',
        category: 'session',
        order: 5,
      },
      {
        title: 'Panel Discussion: Industry-Academia Collaboration',
        description: 'A panel of experts discussing strategies for strengthening partnerships between academic research institutions and the tech industry.',
        speaker: 'All Speakers',
        date: '2026-08-15',
        startTime: '15:30',
        endTime: '17:00',
        location: 'Main Auditorium',
        category: 'panel',
        order: 6,
      },
      {
        title: 'Workshop: Hands-on VLSI Design',
        description: 'Interactive workshop on Very Large Scale Integration design using modern EDA tools. Participants will design a basic digital circuit.',
        speaker: 'Dr. Rajesh Kumar',
        date: '2026-08-16',
        startTime: '09:30',
        endTime: '12:30',
        location: 'Computer Lab 1',
        category: 'workshop',
        order: 7,
      },
      {
        title: 'Poster Presentation & Awards',
        description: 'Research poster presentations by students and early-career researchers, followed by awards for the best presentations.',
        speaker: '',
        date: '2026-08-16',
        startTime: '14:00',
        endTime: '16:00',
        location: 'Exhibition Hall',
        category: 'session',
        order: 8,
      },
      {
        title: 'Closing Ceremony',
        description: 'Valedictory function with closing remarks, certificate distribution, and vote of thanks.',
        speaker: 'Dr. Rajesh Kumar',
        date: '2026-08-16',
        startTime: '16:30',
        endTime: '17:30',
        location: 'Main Auditorium',
        category: 'ceremony',
        order: 9,
      },
    ],
  });

  // Seed Content Blocks
  await prisma.contentBlock.createMany({
    data: [
      {
        slug: 'hero-title',
        title: 'Hero Title',
        content: 'NEST Cluster Symposium 2026',
      },
      {
        slug: 'hero-subtitle',
        title: 'Hero Subtitle',
        content: 'Advancing Science, Engineering & Technology for a Better Tomorrow',
      },
      {
        slug: 'hero-date',
        title: 'Hero Date',
        content: 'August 15-16, 2026 | IIT Guwahati Campus',
      },
      {
        slug: 'about-title',
        title: 'About Title',
        content: 'About the Symposium',
      },
      {
        slug: 'about-content',
        title: 'About Content',
        content: 'The NEST (Nano-Electronics, Sensors & Technology) Cluster Symposium brings together leading researchers, industry experts, and students to share groundbreaking research in semiconductor technology, nanotechnology, artificial intelligence, and quantum computing. This two-day event features keynote addresses, technical sessions, hands-on workshops, and poster presentations, providing a platform for knowledge exchange and collaboration.',
      },
      {
        slug: 'accommodation-content',
        title: 'Accommodation Content',
        content: 'Comfortable accommodation is available for all registered participants within the IIT Guwahati campus. The campus guest house offers modern amenities including Wi-Fi, air conditioning, and 24-hour room service. Participants are advised to book early as rooms fill up quickly. Off-campus hotels near the campus are also available at discounted rates for symposium attendees. Please contact the organizing committee for assistance with your booking.',
      },
      {
        slug: 'registration-info',
        title: 'Registration Information',
        content: 'Early bird registration is now open! Register before July 15, 2026 to avail the discounted rate. Student participants can apply for travel grants and fee waivers.',
      },
      // New content blocks
      {
        slug: 'register-url',
        title: 'Registration Form URL',
        content: 'https://forms.google.com/your-registration-form',
      },
      {
        slug: 'brochure-url',
        title: 'Brochure Download URL',
        content: '',
      },
      {
        slug: 'program-intro',
        title: 'Program Page Introduction',
        content: 'Explore our comprehensive two-day program featuring keynote addresses from world-renowned researchers, technical sessions, hands-on workshops, and poster presentations. The symposium covers cutting-edge topics in semiconductor technology, nanotechnology, AI, and quantum computing.',
      },
      {
        slug: 'sponsorship-intro',
        title: 'Sponsorship Introduction',
        content: 'Partner with the NEST Cluster Symposium 2026 and connect your brand with the brightest minds in science, engineering, and technology. Our sponsorship packages offer exceptional visibility and networking opportunities with leading researchers, industry professionals, and students from across India.',
      },
      {
        slug: 'sponsorship-contact',
        title: 'Sponsorship Contact Info',
        content: 'For sponsorship inquiries, please contact our sponsorship team at sponsorship@nestcluster.edu.in or call +91 361 258 2000.',
      },
      {
        slug: 'exhibition-intro',
        title: 'Exhibition Introduction',
        content: 'The NEST Cluster Symposium 2026 Exhibition provides an excellent platform for companies and organizations to showcase their latest products, services, and innovations. Exhibition booths are located in the main conference foyer, ensuring maximum visibility and foot traffic throughout the event.',
      },
      {
        slug: 'accommodation-intro',
        title: 'Accommodation Page Introduction',
        content: 'We have arranged comfortable accommodation options for all symposium attendees. Whether you prefer on-campus convenience or off-campus hotel stays, we have options to suit every budget and preference.',
      },
      {
        slug: 'contact-email',
        title: 'Contact Email',
        content: 'nestcluster@gmail.com',
      },
      {
        slug: 'contact-phone',
        title: 'Contact Phone',
        content: '+91 361 258 2000',
      },
      {
        slug: 'contact-address',
        title: 'Contact Address',
        content: 'NEST Cluster, IIT Guwahati, Amingaon, North Guwahati, Assam 781039, India',
      },
      {
        slug: 'contact-map-embed',
        title: 'Google Maps Embed URL',
        content: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.674890584498!2d91.69137831502486!3d26.19194998344695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5982d3f9ed5d%3A0x5b2e81e340d4060c!2sIIT%20Guwahati!5e0!3m2!1sen!2sin!4v1234567890',
      },
      {
        slug: 'contact-form-url',
        title: 'Contact Form URL',
        content: 'https://forms.google.com/your-contact-form',
      },
    ],
  });

  // Seed Sponsor Tiers
  await prisma.sponsorTier.createMany({
    data: [
      {
        name: 'Platinum',
        price: '₹10,00,000',
        color: '#6366f1',
        benefits: JSON.stringify([
          'Premium logo placement on all materials',
          'Keynote session naming rights',
          'Dedicated exhibition booth (Premium location)',
          '10 complimentary registrations',
          'Full-page ad in conference brochure',
          'Social media feature & press mentions',
          'VIP dinner & networking access',
        ]),
        order: 1,
      },
      {
        name: 'Gold',
        price: '₹5,00,000',
        color: '#f59e0b',
        benefits: JSON.stringify([
          'Logo on conference materials & website',
          'Session sponsorship opportunity',
          'Exhibition booth (Standard)',
          '5 complimentary registrations',
          'Half-page ad in conference brochure',
          'Social media mentions',
        ]),
        order: 2,
      },
      {
        name: 'Silver',
        price: '₹2,50,000',
        color: '#94a3b8',
        benefits: JSON.stringify([
          'Logo on website & select materials',
          'Exhibition table',
          '3 complimentary registrations',
          'Quarter-page ad in brochure',
          'Logo on conference badge lanyard',
        ]),
        order: 3,
      },
      {
        name: 'Bronze',
        price: '₹1,00,000',
        color: '#d97706',
        benefits: JSON.stringify([
          'Logo on conference website',
          'Shared exhibition space',
          '2 complimentary registrations',
          'Mention in conference brochure',
        ]),
        order: 4,
      },
    ],
  });

  // Seed Accommodation Options
  await prisma.accommodationOption.createMany({
    data: [
      {
        name: 'IIT Guwahati Guest House',
        type: 'On-Campus',
        priceRange: '₹2,000 – ₹4,000 per night',
        amenities: 'Wi-Fi,Air Conditioning,Room Service,Laundry,Parking',
        description: 'Located within the scenic IIT Guwahati campus, the guest house offers comfortable rooms with modern amenities. Walking distance to all symposium venues. Ideal for delegates who prefer convenience.',
        contactInfo: 'guesthouse@iitg.ac.in | +91 361 258 2100',
        bookingUrl: '',
        order: 1,
      },
      {
        name: 'Hotel Brahmaputra Residency',
        type: 'Hotel',
        priceRange: '₹3,500 – ₹6,000 per night',
        amenities: 'Wi-Fi,Swimming Pool,Restaurant,Gym,Airport Shuttle,Spa',
        description: 'A premium hotel located 15 minutes from the campus. Offers shuttle service to the symposium venue. Special discounted rates for symposium attendees.',
        contactInfo: 'reservations@brahmaputraresidency.com | +91 361 234 5678',
        bookingUrl: '',
        order: 2,
      },
      {
        name: 'Campus Hostel (Students)',
        type: 'On-Campus',
        priceRange: '₹500 – ₹1,000 per night',
        amenities: 'Wi-Fi,Common Room,Mess Facility,Laundry',
        description: 'Affordable hostel accommodation available exclusively for student participants. Includes access to campus mess facilities. Limited availability — first come, first served.',
        contactInfo: 'hostel@iitg.ac.in | +91 361 258 2200',
        bookingUrl: '',
        order: 3,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
