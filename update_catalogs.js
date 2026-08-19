const fs = require('fs');
const file = 'c:\\\\Users\\\\MJP\\\\Desktop\\\\BHLI\\\\Bheli_portal\\\\src\\\\components\\\\HolidayPackageDetail.tsx';
let content = fs.readFileSync(file, 'utf8');

const newCatalogs = `const catalogs = {
  domestic: {
    eyebrow: "Explore India",
    title: "Incredible India",
    subtitle: "Diverse Destinations for Every Traveler",
    description: "Discover hill stations, heritage cities, beaches, wildlife, pilgrimage destinations and snowfall escapes across India.",
    icon: MapPinned,
    accent: "from-[#0875b7] to-[#13a5d8]",
    summary: ["India-wide journeys", "LTC package options", "Personal travel assistance"],
    sections: [
      {
        title: "Hill Stations & Nature Retreats",
        description: "Refreshing breaks surrounded by mountains, forests, lakes and scenic valleys.",
        icon: Compass,
        items: [
          { title: "South India", description: "Yercaud, Ooty, Munnar, Coorg, Kodaikanal, Chikmagalur, Wayanad, Sakleshpur.", tags: ["Ooty", "Munnar", "Coorg"], image: "https://images.pexels.com/photos/1666012/pexels-photo-1666012.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "North India", description: "Mussoorie, Nainital, Auli, Kurseong, Dalhousie.", tags: ["Mussoorie", "Nainital", "Auli"], image: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "West & Central India", description: "Lonavala, Mahabaleshwar, Mount Abu.", tags: ["Lonavala", "Mount Abu"], image: "https://images.pexels.com/photos/1450361/pexels-photo-1450361.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Northeast India", description: "Meghalaya, Mechuka, Shillong, Gangtok, Kalimpong, Sikkim.", tags: ["Shillong", "Gangtok"], image: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Leisure & Historical Destinations",
        description: "Explore historic cities, forts, palaces, monuments and local traditions.",
        icon: Landmark,
        items: [
          { title: "Rajasthan & North", description: "Jaipur, Udaipur, Agra, Jaisalmer, Jodhpur, Delhi.", tags: ["Jaipur", "Udaipur", "Agra"], image: "https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Central & South", description: "Hampi, Mysuru, Hyderabad, Khajuraho, Gwalior, Madurai, Thanjavur.", tags: ["Hampi", "Mysuru"], image: "https://images.pexels.com/photos/2446702/pexels-photo-2446702.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Beaches & Island Destinations",
        description: "Relax by the coast with laid-back stays, water activities and island experiences.",
        icon: Plane,
        items: [
          { title: "West Coast", description: "Goa, Kovalam, Varkala, Gokarna, Mumbai, Mangalore, Kozhikode, Daman.", tags: ["Goa", "Gokarna", "Kovalam"], image: "https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "East Coast & Islands", description: "Lakshadweep, Puri, Nellore, Chennai, Kanyakumari, Puducherry, Andaman and Nicobar.", tags: ["Andaman", "Lakshadweep"], image: "https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "National Parks & Wildlife Safaris",
        description: "Plan safaris, forest stays and outdoor activities for an active holiday.",
        icon: Route,
        items: [
          { title: "Wildlife Reserves", description: "Jim Corbett, Ranthambore, Kaziranga, Bandipur, Dandeli, Bekal.", tags: ["Jim Corbett", "Ranthambore", "Kaziranga"], image: "https://images.pexels.com/photos/4038869/pexels-photo-4038869.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Spiritual & Pilgrimage Tours",
        description: "Comfortable, carefully planned visits to important spiritual destinations.",
        icon: Heart,
        items: [
          { title: "North India Circuit", description: "Varanasi, Haridwar, Rishikesh, Prayagraj, Badrinath, Pushkar, Ayodhya.", tags: ["Varanasi", "Rishikesh"], image: "https://images.pexels.com/photos/7178726/pexels-photo-7178726.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Himalayan & Buddhist", description: "Spiti Valley, Dharamshala, Leh.", tags: ["Spiti Valley", "Leh"], image: "https://images.pexels.com/photos/3636151/pexels-photo-3636151.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "South India Circuit", description: "Tirupati, Rameswaram, Tiruvannamalai, Nellore.", tags: ["Tirupati", "Rameswaram"], image: "https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Multi-Faith Destinations", description: "Amritsar, Ajmer, Mumbai.", tags: ["Amritsar", "Ajmer"], image: "https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Top Snowfall Destinations",
        description: "Winter itineraries designed around snow views, seasonal activities and cosy stays.",
        icon: Sparkles,
        items: [
          { title: "Kashmir & Himachal", description: "Kashmir, Gulmarg, Pahalgam, Manali, Shimla, Spiti Valley, Kasol.", tags: ["Gulmarg", "Manali", "Shimla"], image: "https://images.pexels.com/photos/700871/pexels-photo-700871.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Uttarakhand & Northeast", description: "Auli, Sikkim, Lachung, Darjeeling, Tawang.", tags: ["Auli", "Sikkim", "Darjeeling"], image: "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "All-India Domestic LTC Package",
        description: "Choose your preferred destination anywhere in India. Book today and enjoy a memorable holiday.",
        icon: ShieldCheck,
        items: [
          { title: "Silver Package", description: "Budget Hotel & Resort (Couple + 1 Child). Includes Breakfast, Dinner, Airport/Railway transfers, Sightseeing.", tags: ["₹9,999 + Taxes", "Economy", "3N/4D"], image: "https://images.pexels.com/photos/4006143/pexels-photo-4006143.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Gold Package", description: "3-Star Hotel & Resort (Couple + 1 Child). Includes Breakfast, Dinner, Airport/Railway transfers, Sightseeing, Local Guide.", tags: ["₹13,999 + Taxes", "Standard", "3N/4D"], image: "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Platinum Package", description: "4/5-Star Luxury Hotels (Couple + 1 Child). Includes Breakfast, Dinner, Airport/Railway transfers, Sightseeing, Local Guide.", tags: ["₹24,999 + Taxes", "Premium Luxury", "3N/4D"], image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
    ],
  },
  international: {
    eyebrow: "Explore the world",
    title: "Top International Destinations",
    subtitle: "Premium Travel Packages | Best Deals | Trusted Service",
    description: "Explore the world with us through popular, budget-friendly, honeymoon, luxury, European and emerging international holiday ideas.",
    icon: Globe2,
    accent: "from-[#061f3b] to-[#13a5d8]",
    summary: ["Worldwide destinations", "Best Price Guarantee", "24/7 Customer Support"],
    sections: [
      {
        title: "Most Popular & High-Demand Destinations",
        description: "Amazing Places. Unforgettable Memories.",
        icon: Landmark,
        items: [
          { title: "UAE (Dubai / Abu Dhabi)", description: "Experience luxury shopping, thrilling desert safaris, and the iconic Burj Khalifa.", tags: ["Luxury Shopping", "Desert Safari", "Burj Khalifa"], image: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Singapore", description: "World-class attractions including Universal Studios, Sentosa Island, and vibrant city experiences.", tags: ["Universal Studios", "Sentosa Island", "City Experience"], image: "https://images.pexels.com/photos/3152124/pexels-photo-3152124.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Thailand", description: "Beautiful beaches in Phuket and Krabi, paired with the legendary Bangkok nightlife.", tags: ["Phuket", "Krabi", "Bangkok Nightlife"], image: "https://images.pexels.com/photos/1682748/pexels-photo-1682748.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Budget-Friendly International Packages",
        description: "Perfect for LTC & Economical Travel. Best value for money.",
        icon: MapPin,
        items: [
          { title: "Nepal", description: "Explore Kathmandu, Pokhara, and witness the breathtaking Everest views.", tags: ["Kathmandu", "Pokhara", "Everest Views"], image: "https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Vietnam", description: "Cruise through Halong Bay, explore historic Hanoi, and relax on beautiful beaches.", tags: ["Halong Bay", "Hanoi", "Beaches"], image: "https://images.pexels.com/photos/3058827/pexels-photo-3058827.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Sri Lanka", description: "A perfect blend of pristine beaches, ancient culture, and exotic wildlife.", tags: ["Beaches", "Culture", "Wildlife"], image: "https://images.pexels.com/photos/4038869/pexels-photo-4038869.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Beach & Honeymoon Destinations",
        description: "Perfect for Love & Memories. Create memories that last forever.",
        icon: Heart,
        items: [
          { title: "Maldives", description: "Iconic water villas, luxury resorts, and the ultimate honeymoon paradise.", tags: ["Water Villas", "Luxury Resorts", "Honeymoon"], image: "https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Bali (Indonesia)", description: "Stunning beautiful beaches, spiritual temples, and vibrant nightlife.", tags: ["Beautiful Beaches", "Spiritual Temples", "Vibrant Nightlife"], image: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Mauritius", description: "Ideal for family trips, destination weddings, and a premium luxury experience.", tags: ["Family Trips", "Destination Weddings", "Luxury"], image: "https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Luxury & Europe Tour Packages",
        description: "Luxury Experience Starts Here. Europe calling, experience the best!",
        icon: Crown,
        items: [
          { title: "France (Paris)", description: "Visit the iconic Eiffel Tower, enjoy world-class shopping, and experience pure romance.", tags: ["Eiffel Tower", "Shopping", "Romance"], image: "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Switzerland", description: "Breathtaking Alps, scenic train journeys, and unforgettable snow experiences.", tags: ["Alps", "Scenic Trains", "Snow Experience"], image: "https://images.pexels.com/photos/700871/pexels-photo-700871.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Italy", description: "Explore the ancient streets of Rome, romantic Venice canals, and rich cultural history.", tags: ["Rome", "Venice", "Culture & History"], image: "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Trending & Emerging Destinations",
        description: "New Places, New Experiences. Explore more, live more!",
        icon: Sparkles,
        items: [
          { title: "Georgia", description: "Stunning landscapes, rich culture, delicious wine, and perfect for explorers.", tags: ["Stunning Landscapes", "Rich Culture", "Delicious Wine"], image: "https://images.pexels.com/photos/3636151/pexels-photo-3636151.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Philippines", description: "Endless island hopping, crystal clear beaches, adventure activities, and picture-perfect destinations.", tags: ["Island Hopping", "Crystal Clear Beaches", "Adventure"], image: "https://images.pexels.com/photos/2450296/pexels-photo-2450296.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Cambodia", description: "Explore ancient temples, enjoy relaxing getaways, uncover hidden gems, and experience rich culture.", tags: ["Ancient Temples", "Relaxing Getaways", "Hidden Gems"], image: "https://images.pexels.com/photos/2087391/pexels-photo-2087391.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Our Travel Packages",
        description: "Handpicked Destinations • Best Prices • Unforgettable Experiences",
        icon: UsersRound,
        items: [
          { title: "Budget Packages", description: "Nepal, Vietnam, Thailand, Sri Lanka.", tags: ["₹50K - ₹90K", "Best Value"], image: "https://images.pexels.com/photos/1162607/pexels-photo-1162607.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Mid-Range Packages", description: "Singapore, Dubai, Bali.", tags: ["₹90K - ₹1.5L", "Standard Comfort"], image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Premium Packages", description: "Maldives, Europe (France), Europe (Switzerland).", tags: ["₹2L - ₹5L+", "Premium Stays"], image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
      {
        title: "Why Choose BookingHospitality?",
        description: "We Make Travel Easy, Safe & Memorable.",
        icon: ShieldCheck,
        items: [
          { title: "Flight + Hotel Combos", description: "Best flight and hotel combinations for a hassle-free experience.", tags: ["Hassle-free"], image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Best Price Guarantee", description: "Competitive prices and exclusive deals you won't find elsewhere.", tags: ["Exclusive Deals"], image: "https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Trusted & Reliable", description: "100% trusted brand with thousands of happy travelers.", tags: ["100% Trusted"], image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "24/7 Customer Support", description: "We're here for you 24/7 before, during & after your trip.", tags: ["Always Available"], image: "https://images.pexels.com/photos/3282133/pexels-photo-3282133.jpeg?auto=compress&cs=tinysrgb&w=600" },
          { title: "Customized Travel Plans", description: "Personalized itineraries designed to match your style and budget.", tags: ["Personalized"], image: "https://images.pexels.com/photos/2104152/pexels-photo-2104152.jpeg?auto=compress&cs=tinysrgb&w=600" },
        ],
      },
    ],
  },
};`;

const startIndex = content.indexOf('const catalogs = {');
const endIndex = content.indexOf('export default function HolidayPackageDetail({');

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.substring(0, startIndex) + newCatalogs + '\\n\\n' + content.substring(endIndex);
  fs.writeFileSync(file, newContent, 'utf8');
}
