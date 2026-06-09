import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  // Add new content blocks (skip if already exists)
  const newBlocks = [
    { slug: 'register-url', title: 'Registration Form URL', content: 'https://forms.google.com/your-registration-form' },
    { slug: 'brochure-url', title: 'Brochure Download URL', content: '' },
    { slug: 'program-intro', title: 'Program Page Introduction', content: 'Explore our comprehensive two-day program featuring keynote addresses from world-renowned researchers, technical sessions, hands-on workshops, and poster presentations. The symposium covers cutting-edge topics in semiconductor technology, nanotechnology, AI, and quantum computing.' },
    { slug: 'sponsorship-intro', title: 'Sponsorship Introduction', content: 'Partner with the NEST Cluster Symposium 2026 and connect your brand with the brightest minds in science, engineering, and technology. Our sponsorship packages offer exceptional visibility and networking opportunities with leading researchers, industry professionals, and students from across India.' },
    { slug: 'sponsorship-contact', title: 'Sponsorship Contact Info', content: 'For sponsorship inquiries, please contact our sponsorship team at sponsorship@nestcluster.edu.in or call +91 361 258 2000.' },
    { slug: 'exhibition-intro', title: 'Exhibition Introduction', content: 'The NEST Cluster Symposium 2026 Exhibition provides an excellent platform for companies and organizations to showcase their latest products, services, and innovations. Exhibition booths are located in the main conference foyer, ensuring maximum visibility and foot traffic throughout the event.' },
    { slug: 'accommodation-intro', title: 'Accommodation Page Introduction', content: 'We have arranged comfortable accommodation options for all symposium attendees. Whether you prefer on-campus convenience or off-campus hotel stays, we have options to suit every budget and preference.' },
    { slug: 'contact-email', title: 'Contact Email', content: 'nestcluster@gmail.com' },
    { slug: 'contact-phone', title: 'Contact Phone', content: '+91 361 258 2000' },
    { slug: 'contact-address', title: 'Contact Address', content: 'NEST Cluster, IIT Guwahati, Amingaon, North Guwahati, Assam 781039, India' },
    { slug: 'contact-map-embed', title: 'Google Maps Embed URL', content: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.674890584498!2d91.69137831502486!3d26.19194998344695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5982d3f9ed5d%3A0x5b2e81e340d4060c!2sIIT%20Guwahati!5e0!3m2!1sen!2sin!4v1234567890' },
    { slug: 'contact-form-url', title: 'Contact Form URL', content: 'https://forms.google.com/your-contact-form' },
  ];

  for (const block of newBlocks) {
    const existing = await prisma.contentBlock.findUnique({ where: { slug: block.slug } });
    if (!existing) {
      await prisma.contentBlock.create({ data: block });
      console.log(`Created content block: ${block.slug}`);
    } else {
      console.log(`Skipped (exists): ${block.slug}`);
    }
  }

  // Seed Sponsor Tiers
  const tierCount = await prisma.sponsorTier.count();
  if (tierCount === 0) {
    await prisma.sponsorTier.createMany({
      data: [
        { name: 'Platinum', price: '\u20B910,00,000', color: '#6366f1', benefits: JSON.stringify(['Premium logo placement on all materials','Keynote session naming rights','Dedicated exhibition booth (Premium location)','10 complimentary registrations','Full-page ad in conference brochure','Social media feature & press mentions','VIP dinner & networking access']), order: 1 },
        { name: 'Gold', price: '\u20B95,00,000', color: '#f59e0b', benefits: JSON.stringify(['Logo on conference materials & website','Session sponsorship opportunity','Exhibition booth (Standard)','5 complimentary registrations','Half-page ad in conference brochure','Social media mentions']), order: 2 },
        { name: 'Silver', price: '\u20B92,50,000', color: '#94a3b8', benefits: JSON.stringify(['Logo on website & select materials','Exhibition table','3 complimentary registrations','Quarter-page ad in brochure','Logo on conference badge lanyard']), order: 3 },
        { name: 'Bronze', price: '\u20B91,00,000', color: '#d97706', benefits: JSON.stringify(['Logo on conference website','Shared exhibition space','2 complimentary registrations','Mention in conference brochure']), order: 4 },
      ],
    });
    console.log('Created sponsor tiers');
  }

  // Seed Accommodation Options
  const accomCount = await prisma.accommodationOption.count();
  if (accomCount === 0) {
    await prisma.accommodationOption.createMany({
      data: [
        { name: 'IIT Guwahati Guest House', type: 'On-Campus', priceRange: '\u20B92,000 \u2013 \u20B94,000 per night', amenities: 'Wi-Fi,Air Conditioning,Room Service,Laundry,Parking', description: 'Located within the scenic IIT Guwahati campus, the guest house offers comfortable rooms with modern amenities. Walking distance to all symposium venues.', contactInfo: 'guesthouse@iitg.ac.in | +91 361 258 2100', bookingUrl: '', order: 1 },
        { name: 'Hotel Brahmaputra Residency', type: 'Hotel', priceRange: '\u20B93,500 \u2013 \u20B96,000 per night', amenities: 'Wi-Fi,Swimming Pool,Restaurant,Gym,Airport Shuttle,Spa', description: 'A premium hotel located 15 minutes from the campus. Offers shuttle service to the symposium venue. Special discounted rates for symposium attendees.', contactInfo: 'reservations@brahmaputraresidency.com | +91 361 234 5678', bookingUrl: '', order: 2 },
        { name: 'Campus Hostel (Students)', type: 'On-Campus', priceRange: '\u20B9500 \u2013 \u20B91,000 per night', amenities: 'Wi-Fi,Common Room,Mess Facility,Laundry', description: 'Affordable hostel accommodation for student participants. Includes access to campus mess facilities. Limited availability \u2014 first come, first served.', contactInfo: 'hostel@iitg.ac.in | +91 361 258 2200', bookingUrl: '', order: 3 },
      ],
    });
    console.log('Created accommodation options');
  }

  console.log('Migration complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
