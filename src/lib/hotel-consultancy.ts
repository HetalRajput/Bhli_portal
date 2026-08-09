export type ConsultancySection = {
  title: string;
  description: string;
  points: string[];
};

export type ConsultancyService = {
  slug: string;
  number: string;
  title: string;
  detailTitle?: string;
  eyebrow: string;
  summary: string;
  introduction: string;
  image: string;
  sections: ConsultancySection[];
};

export const consultancyServices: ConsultancyService[] = [
  {
    slug: "concept-development",
    number: "01",
    title: "CONCEPTUALIZATION",
    eyebrow: "From opportunity to identity",
    summary: "The concept development phase is the first step to creating a successful restaurant business adopting a practical and methodic approach.",
    introduction: "We turn an initial vision into a clear guest proposition, brand direction and investment roadmap. Every recommendation is grounded in the intended market, location and operating model.",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400",
    sections: [
      { title: "Market opportunity", description: "Identify the gap your concept can credibly own.", points: ["Market and competitor review", "Target guest definition", "Location and site assessment"] },
      { title: "Brand and experience", description: "Translate the opportunity into a memorable guest experience.", points: ["Positioning, values and tone of voice", "Food and beverage philosophy", "Space, service and ambience direction"] },
      { title: "Commercial roadmap", description: "Give the idea a practical route to launch and growth.", points: ["Investment and pre-opening budgets", "Revenue and profit projections", "Marketing, rollout and exit planning"] },
    ],
  },
  {
    slug: "pre-opening-projects",
    number: "02",
    title: "PRE-OPENING PROJECTS",
    eyebrow: "Plan, coordinate, launch",
    summary: "Rezkon team supports the investors in preparing a detailed GANTT chart for the project with specific timelines to the opening of the project.",
    introduction: "Hotel and restaurant openings involve hundreds of connected decisions. We establish the programme, coordinate stakeholders and keep critical activities moving toward a confident opening day.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1400",
    sections: [
      { title: "Project planning", description: "Build a single source of truth for the opening.", points: ["Detailed milestone and dependency plan", "Budget tracking and procurement schedule", "Consultant, contractor and vendor coordination"] },
      { title: "Operational readiness", description: "Prepare the property, systems and team for real guests.", points: ["SOP and checklist development", "Technology and reporting set-up", "Recruitment and departmental readiness"] },
      { title: "Opening support", description: "Test the experience before the doors fully open.", points: ["Mock service and snag review", "Soft-opening coordination", "Post-opening stabilisation support"] },
    ],
  },
  {
    slug: "marketing-support",
    number: "03",
    title: "MARKETING SUPPORT",
    eyebrow: "Build demand with purpose",
    summary: "We help you with Pricing Support, media mix, global reports, social audit, campaign management, social media status report etc.",
    introduction: "Our marketing support aligns commercial goals with the right mix of traditional, partnership and digital activity—before opening and throughout day-to-day operations.",
    image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1400",
    sections: [
      { title: "Pricing and planning", description: "Match pricing and promotions to demand.", points: ["Competitor and willingness-to-pay review", "Seasonal price differentiation", "Promotional calendar and offer design"] },
      { title: "Channels and partnerships", description: "Reach relevant audiences efficiently.", points: ["Media channel and budget mix", "Partnership and event opportunities", "Sales collateral and launch campaigns"] },
      { title: "Digital performance", description: "Turn social activity into accountable growth.", points: ["Content and campaign planning", "Audience, reach and conversion reporting", "Trend, competitor and channel analysis"] },
    ],
  },
  {
    slug: "people-and-training",
    number: "04",
    title: "HR & TRAINING",
    detailTitle: "TRAINING & HR SUPPORT",
    eyebrow: "Create a service-led culture",
    summary: "We help you with Staff training, Training Resources, Advisory and Ethnic Cuisine Development.",
    introduction: "A top class hospitality team is critical for customer satisfaction and retention. This step begins with hiring the right employees, suited to the brand, followed by a good orientation and training program creating and retaining a competitive advantage in the marketplace.",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1400",
    sections: [
      {
        title: "STAFF TRAINING",
        description: "Includes:",
        points: [
          "Customized Training Program for Service Crew",
          "Customized Culinary Development Program & Food Safety Training",
          "Training Audit/Training Needs Analysis",
          "Creation of Staff Hygiene Standards - i.e; Grooming, Appearance",
        ],
      },
      {
        title: "TRAINING RESOURCES",
        description: "Includes:",
        points: [
          "Food & Beverage Certification Program",
          "Food Safety Guidelines & HACCP Implementation",
          "Standards Training Manual",
          "Developing Interview Questionnaire",
          "Developing Selection Decision Matrix",
        ],
      },
      {
        title: "ADVISORY",
        description: "Includes:",
        points: [
          "Detailed process flow audit to determine ideal staffing levels",
          "Manpower re-structure, multi-skilling and outsourcing",
          "Create a staff matrix and include job descriptions and key objectives",
          "Initial interviews for hiring and shortlisting candidates",
        ],
      },
      {
        title: "ETHNIC CUISINE DEVELOPMENT",
        description: "Includes:",
        points: [
          "Specialist support for regional Indian cuisines",
          "North Indian cuisine and menu development",
          "South Indian cuisine and menu development",
          "Menu refinement and practical culinary team training",
        ],
      },
    ],
  },
  {
    slug: "food-beverage-controls",
    number: "05",
    title: "F & B CONTROLS",
    eyebrow: "Protect quality and margin",
    summary: "We help you with the Menu Engineering, Cost Control and IT - Point of sale.",
    introduction: "A disciplined control environment helps teams buy well, reduce waste, protect product quality and understand the true performance of each outlet and menu item.",
    image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1400",
    sections: [
      { title: "Menu performance", description: "Use contribution and popularity data to guide decisions.", points: ["Menu engineering and item analysis", "Recipe costing and yield standards", "Pricing and product-mix recommendations"] },
      { title: "Cost control", description: "Create a controlled flow from purchase to consumption.", points: ["Procurement and receiving procedures", "Inventory, storage and production controls", "Waste reduction and vendor analysis"] },
      { title: "Systems and reporting", description: "Connect daily activity to reliable management information.", points: ["POS and inventory system recommendations", "Back-office configuration and training", "Operational dashboards and reporting routines"] },
    ],
  },
  {
    slug: "business-analysis",
    number: "06",
    title: "BUSINESS ANALYSIS",
    eyebrow: "Diagnose, improve, grow",
    summary: "We help you with the Site Survey, Ongoing Advisory and Restructure & Rebranding.",
    introduction: "We review the business through commercial, operational and guest-experience lenses, then prioritise actions that can strengthen the proposition and improve sustainable returns.",
    image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1400",
    sections: [
      { title: "Business review", description: "Establish an evidence-based view of current performance.", points: ["Site and guest-journey assessment", "Revenue, cost and productivity review", "Market and competitor benchmarking"] },
      { title: "Transformation plan", description: "Prioritise the changes with the greatest impact.", points: ["Concept refinement or repositioning", "Process and organisation redesign", "Brand, menu and service recommendations"] },
      { title: "Ongoing advisory", description: "Support leaders as improvements move into operation.", points: ["Implementation roadmap and governance", "Performance reviews and coaching", "Growth and expansion planning"] },
    ],
  },
];

export function getConsultancyService(slug: string) {
  return consultancyServices.find((service) => service.slug === slug);
}
