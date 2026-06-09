import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const comparisonData = [
  {
    category: "Cost (INR)",
    platinum: "25 lakhs",
    diamond: "20 lakhs",
    gold: "15 lakhs",
    silver: "10 lakhs",
    bronze: "05 lakhs",
    isCost: true
  },
  {
    category: "Exhibitors",
    platinum: "Exhibit space in the expo area [incl. table, chair, electricity, TV and other items.] Exhibition space allocation will be made by the Conference organizers.",
    diamond: "Exhibit space in the expo area [incl. table, chair, electricity, TV and other items.] Exhibition space allocation will be made by the Conference organizers.",
    gold: "Exhibit space in the expo area [incl. table, chair, electricity, TV and other items.] Exhibition space allocation will be made by the Conference organizers.",
    silver: "Exhibit space in the expo area [incl. table, chair, electricity, TV and other items.] Exhibition space allocation will be made by the Conference organizers.",
    bronze: "—"
  },
  {
    category: "Sponsor Presentation",
    platinum: "10-minute sponsor presentation following your chosen presentation",
    diamond: "5-minute sponsor presentation following your chosen presentation",
    gold: "—",
    silver: "—",
    bronze: "—"
  },
  {
    category: "Advertisement",
    platinum: "Inclusion of the sponsor's logo in conference materials and gadgets provided to participants",
    diamond: "Inclusion of the sponsor's logo in conference materials and gadgets provided to participants",
    gold: "Inclusion of the sponsor's logo in conference materials and gadgets provided to participants",
    silver: "Inclusion of the sponsor's logo in conference materials and gadgets provided to participants",
    bronze: "—"
  },
  {
    category: "Pre-event Marketing",
    platinum: "Logo in email and Social-media post relating to your chosen presentation. Social media thank you sponsor post",
    diamond: "Social media thank you sponsor post",
    gold: "Social media thank you sponsor post",
    silver: "Social media thank you sponsor post",
    bronze: "—"
  },
  {
    category: "Conference Website",
    platinum: "Company logotype recognized as Platinum sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website.",
    diamond: "Company logotype recognized as Diamond sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website.",
    gold: "Company logotype recognized as Gold sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website.",
    silver: "Company logotype recognized as Silver sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website.",
    bronze: "Company logotype recognized as Bronze sponsor and URL link to sponsor's website placed on the conference website. Inclusion in the list of Sponsors & Exhibitors on the conference website."
  },
  {
    category: "Final Programme",
    platinum: "Company logotype recognized as Platinum sponsor in the Final Program",
    diamond: "Company logotype recognized as Diamond sponsor in the Final Program",
    gold: "Company logotype recognized as Gold sponsor in the Final Program",
    silver: "Company logotype recognized as Silver sponsor in the Final Program",
    bronze: "—"
  },
  {
    category: "List of Sponsors",
    platinum: "Company logotype recognized as Platinum sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall.",
    diamond: "Company logotype recognized as Diamond sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall.",
    gold: "Company logotype recognized as Gold sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall.",
    silver: "Company logotype recognized as Silver sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall.",
    bronze: "Company logotype recognized as Bronze sponsor to be shown on a roll-up with the List of Sponsors & Exhibitors at the entrance of the conference Hall."
  },
  {
    category: "Exhibitors Signage",
    platinum: "Presented as Platinum sponsor at the opening of the Conference and Expo area",
    diamond: "Presented as Diamond sponsor at the opening of the Conference and Expo area",
    gold: "Presented as Gold sponsor at the Conference and Expo area",
    silver: "Presented as Silver sponsor at the Conference and Expo area",
    bronze: "—"
  },
  {
    category: "Complimentary Registrations",
    platinum: "Free registration for 10 delegates",
    diamond: "Free registration for 8 delegates",
    gold: "Free registration for 6 delegates",
    silver: "Free registration for 4 delegates",
    bronze: "Free registration for 2 delegates"
  },
  {
    category: "Expo Area / Space",
    platinum: "9 x 9 m stall for 3 days",
    diamond: "6 x 6 m stall for 3 days",
    gold: "3 x 3 m stall for 3 days",
    silver: "3 x 3 m stall for 3 days",
    bronze: "—"
  }
];

async function main() {
  // Upsert the comparison data content block
  await prisma.contentBlock.upsert({
    where: { slug: 'sponsorship-comparison' },
    update: {
      content: JSON.stringify(comparisonData),
    },
    create: {
      slug: 'sponsorship-comparison',
      title: 'Sponsorship Comparison Data (JSON)',
      content: JSON.stringify(comparisonData),
    },
  });

  console.log('Sponsorship comparison data seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
