const fs = require('fs');
const path = require('path');

const sitemap = [
  // Home is already there, skip root
  // SERVICES
  'services',
  'services/hotel-reservations',
  'services/flight-bookings',
  'services/train-ticket-booking',
  'services/bus-ticket-booking',
  'services/taxi-services',
  'services/self-drive-car-rentals',
  'services/holiday-packages',
  'services/cruise-holidays',
  'services/visa-assistance',
  'services/travel-insurance',
  'services/currency-exchange',
  'services/event-management',
  'services/catering-services',
  'services/travel-consultancy',
  
  // DEFENCE HELP DESK
  'defence-help-desk',
  'defence-help-desk/mou-partners',
  'defence-help-desk/government-and-defence-bookings',
  'defence-help-desk/reservation-assistance',
  'defence-help-desk/ltc-travel-packages',
  'defence-help-desk/eligibility-and-benefits',
  'defence-help-desk/documentation',
  'defence-help-desk/faqs',
  'defence-help-desk/contact-defence-team',

  // ABOUT US
  'about-us',
  'about-us/company-profile',
  'about-us/vision-and-mission',
  'about-us/why-choose-bhli-llp',
  'about-us/our-journey',
  'about-us/certifications',
  'about-us/awards',
  'about-us/csr',

  // OUR TEAM
  'our-team',
  'our-team/leadership',
  'our-team/management',
  'our-team/sales-team',
  'our-team/operations-team',
  'our-team/customer-support',
  'our-team/team-portfolio',

  // GALLERY
  'gallery',
  'gallery/photo-gallery',
  'gallery/hotel-gallery',
  'gallery/event-gallery',
  'gallery/corporate-events',
  'gallery/video-gallery',
  'gallery/media-coverage',

  // CLIENTS
  'clients',
  'clients/ministry-of-defence',
  'clients/indian-army',
  'clients/indian-navy',
  'clients/indian-air-force',
  'clients/paramilitary-forces',
  'clients/government-departments',
  'clients/psus',
  'clients/corporate-clients',
  'clients/educational-institutions',

  // CHANNEL PARTNERS
  'channel-partners',
  'channel-partners/hotel-partners',
  'channel-partners/airline-partners',
  'channel-partners/travel-partners',
  'channel-partners/tourism-boards',
  'channel-partners/dmc-partners',
  'channel-partners/technology-partners',

  // TESTIMONIALS
  'testimonials',
  'testimonials/customer-reviews',
  'testimonials/corporate-reviews',
  'testimonials/government-clients',
  'testimonials/video-testimonials',

  // CONTACT US
  'contact-us',
  'contact-us/office-locations',
  'contact-us/travel-desk',
  'contact-us/defence-desk',
  'contact-us/enquiry-form',
  'contact-us/customer-support',
  'contact-us/whatsapp-support',
  'contact-us/email-support',
  'contact-us/careers',

  // EXTRA PAGES
  'offers',
  'blogs',
  'faqs',
  'vendor-registration',
  'become-a-partner',
  'privacy-policy',
  'terms-and-conditions',
  'cancellation-and-refund',
  'cookies-policy',

  // ADMIN PANEL
  'admin',
  'admin/dashboard',
  'admin/bookings',
  'admin/hotels',
  'admin/flights',
  'admin/bus',
  'admin/train',
  'admin/taxi',
  'admin/packages',
  'admin/visa-requests',
  'admin/catering',
  'admin/events',
  'admin/customers',
  'admin/defence-desk',
  'admin/partners',
  'admin/leads',
  'admin/cms',
  'admin/testimonials',
  'admin/gallery',
  'admin/users-and-roles',
  'admin/reports',
  'admin/settings'
];

const basePath = path.join(__dirname, '..', 'src', 'app');

function toTitleCase(str) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

sitemap.forEach(route => {
  const dirPath = path.join(basePath, route);
  const filePath = path.join(dirPath, 'page.tsx');
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    const pageName = toTitleCase(path.basename(route));
    const content = `import React from 'react';

export default function ${pageName.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <div className="max-w-4xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-serif">
          ${pageName}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This is the auto-generated boilerplate page for ${pageName}. Edit this file in \`src/app/${route}/page.tsx\`.
        </p>
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(filePath, content);
  }
});
