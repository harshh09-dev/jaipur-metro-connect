export interface Station {
  id: string;
  name: string;
  line: "pink" | "orange";
  order: number;
  facilities: string[];
  parking: boolean;
  accessible: boolean;
  nearbyPlaces: string[];
  contactNumber?: string;
  email?: string;
  lat?: number;
  lng?: number;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: Station[];
  status: "operational" | "planned";
  length: string;
  corridor: string;
}

// Pink Line — Operational since 3 June 2015 (Phase 1A: Mansarovar–Chandpole)
// Phase 1B: Chandpole–Badi Chaupar opened 23 September 2020
// Total length: 11.97 km, 11 stations, East–West Corridor
export const pinkLineStations: Station[] = [
  { id: "mansarovar", name: "Mansarovar", line: "pink", order: 1, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp", "Depot"], parking: true, accessible: true, nearbyPlaces: ["Mansarovar Housing Board", "Sector 7 Market", "Metro Depot"], contactNumber: "0141-2822151", email: "msor@jaipurmetrorail.in" },
  { id: "new-aatish-market", name: "New Aatish Market", line: "pink", order: 2, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Aatish Market", "Residential Area"], contactNumber: "0141-2822152", email: "namt@jaipurmetrorail.in" },
  { id: "vivek-vihar", name: "Vivek Vihar", line: "pink", order: 3, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Vivek Vihar Colony", "Schools"], contactNumber: "0141-2822153", email: "vkvr@jaipurmetrorail.in" },
  { id: "shyam-nagar", name: "Shyam Nagar", line: "pink", order: 4, facilities: ["Lift", "Escalator", "Wheelchair Ramp"], parking: false, accessible: true, nearbyPlaces: ["Shyam Nagar Market", "Hospital"], contactNumber: "0141-2822154", email: "smnr@jaipurmetrorail.in" },
  { id: "ram-nagar", name: "Ram Nagar", line: "pink", order: 5, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Ram Nagar Colony"], contactNumber: "0141-2822155", email: "rmnr@jaipurmetrorail.in" },
  { id: "civil-lines", name: "Civil Lines", line: "pink", order: 6, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp"], parking: true, accessible: true, nearbyPlaces: ["Rajasthan University", "SMS Hospital"], contactNumber: "0141-2822156", email: "cljp@jaipurmetrorail.in" },
  { id: "railway-station", name: "Railway Station", line: "pink", order: 7, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp", "Interchange"], parking: true, accessible: true, nearbyPlaces: ["Jaipur Junction Railway Station", "Sindhi Camp Bus Stand"], contactNumber: "0141-2822157", email: "mrsn@jaipurmetrorail.in" },
  { id: "sindhi-camp", name: "Sindhi Camp", line: "pink", order: 8, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp"], parking: true, accessible: true, nearbyPlaces: ["Sindhi Camp Bus Stand", "Hotels", "MI Road"], contactNumber: "0141-2822158", email: "sicp@jaipurmetrorail.in" },
  { id: "chandpole", name: "Chandpole", line: "pink", order: 9, facilities: ["Lift", "Escalator", "Wheelchair Ramp"], parking: false, accessible: true, nearbyPlaces: ["Chandpole Bazaar", "Old City Gate", "Chandpole Gate"], contactNumber: "0141-2822159", email: "cdpe@jaipurmetrorail.in" },
  { id: "chhoti-chaupar", name: "Chhoti Chaupar", line: "pink", order: 10, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Hawa Mahal", "Johari Bazaar", "Tripolia Bazaar"], contactNumber: "0141-2822160", email: "ctcp@jaipurmetrorail.in" },
  { id: "badi-chaupar", name: "Badi Chaupar", line: "pink", order: 11, facilities: ["Lift", "Escalator", "Wheelchair Ramp"], parking: false, accessible: true, nearbyPlaces: ["City Palace", "Jantar Mantar", "Hawa Mahal", "Albert Hall Museum"], contactNumber: "0141-2822161", email: "bicp@jaipurmetrorail.in" },
];

// Orange Line — Phase 2 (Planned, North–South Corridor)
// Sitapura Industrial Area to Ambabari — 23.099 km, 20 stations (planned)
export const orangeLineStations: Station[] = [
  { id: "ambabari", name: "Ambabari", line: "orange", order: 1, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Ambabari Circle", "Commercial Area"] },
  { id: "raja-park", name: "Raja Park", line: "orange", order: 2, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Raja Park Market", "Cafes"] },
  { id: "malviya-nagar", name: "Malviya Nagar", line: "orange", order: 3, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Malviya Nagar Market", "WTP"] },
  { id: "tonk-road", name: "Tonk Road", line: "orange", order: 4, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Tonk Road Commercial Hub"] },
  { id: "railway-station-orange", name: "Railway Station", line: "orange", order: 5, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp", "Interchange"], parking: true, accessible: true, nearbyPlaces: ["Jaipur Junction", "Interchange to Pink Line"] },
  { id: "jagatpura", name: "Jagatpura", line: "orange", order: 6, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Jagatpura Flyover", "IT Park"] },
  { id: "sitapura", name: "Sitapura", line: "orange", order: 7, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Sitapura Industrial Area", "SEZ"] },
];

export const allStations: Station[] = [...pinkLineStations, ...orangeLineStations];

export const metroLines: MetroLine[] = [
  { id: "pink", name: "Pink Line", color: "hsl(350, 60%, 45%)", stations: pinkLineStations, status: "operational", length: "11.97 km", corridor: "East–West Corridor" },
  { id: "orange", name: "Orange Line", color: "hsl(35, 90%, 52%)", stations: orangeLineStations, status: "planned", length: "23.099 km", corridor: "North–South Corridor" },
];

// Official JMRC Information
export const jmrcInfo = {
  fullName: "Jaipur Metro Rail Corporation Limited (JMRC)",
  established: "1 January 2010",
  commercialService: "3 June 2015",
  headquarters: "Khanij Bhavan, Tilak Marg, C-Scheme, Jaipur",
  website: "www.jaipurmetrorail.in",
  helpline: "0141-2822100",
  customerCare: "1800-180-6060",
  email: "cmd@jaipurmetrorail.in",
  proEmail: "pro@jaipurmetrorail.in",
  chairman: "Sh. Vaibhav Galriya, IAS",
  designation: "Chairman & Managing Director",
  trackGauge: "1,435 mm (Standard Gauge)",
  electrification: "25 kV 50 Hz AC Overhead Catenary",
  rollingStock: "10 trains, 4 coaches each",
  averageSpeed: "32 km/h",
  topSpeed: "80 km/h",
  dailyRidership: "55,000+",
  totalNetworkLength: "11.97 km (operational)",
  phase1A: { name: "Phase 1A", route: "Mansarovar – Chandpole", length: "9.63 km", stations: 9, opened: "3 June 2015" },
  phase1B: { name: "Phase 1B", route: "Chandpole – Badi Chaupar", length: "2.34 km", stations: 2, opened: "23 September 2020" },
  phase1C: { name: "Phase 1C (Planned)", route: "Badi Chaupar – Transport Nagar", length: "3.412 km", stations: 2 },
  phase1D: { name: "Phase 1D (Planned)", route: "Mansarovar – Ajmer Road", length: "1.312 km", stations: 1 },
  phase2: { name: "Phase 2 (Planned)", route: "Sitapura – Ambabari", length: "23.099 km", stations: 20 },
  notableFeature: "First metro in India to run on triple-storey elevated road and metro track",
};

// Do's and Don'ts from official website
export const dosAndDonts = {
  dos: [
    "Stand behind the yellow line on the platform",
    "Allow passengers to alight before boarding",
    "Keep your belongings with you at all times",
    "Report any suspicious activity to metro staff",
    "Use escalators safely, hold the handrail",
    "Carry a valid ticket or smart card",
    "Follow instructions of metro staff during emergencies",
    "Give priority to elderly, disabled and pregnant women",
  ],
  donts: [
    "Do not lean against train doors",
    "Do not smoke or consume alcohol",
    "Do not carry inflammable or explosive items",
    "Do not spit or litter inside the metro premises",
    "Do not eat or drink inside the metro train",
    "Do not cross the yellow safety line",
    "Do not obstruct the closing of train doors",
    "Do not travel on the roof or footboard",
  ],
};

// Offences and Penalties
export const offencesAndPenalties = [
  { offence: "Travelling without valid pass or ticket", penalty: "₹250 or three times the fare, whichever is more" },
  { offence: "Unauthorized entry into reserved area", penalty: "Up to ₹500" },
  { offence: "Smoking in metro premises", penalty: "₹200" },
  { offence: "Spitting, littering", penalty: "₹200" },
  { offence: "Carrying inflammable/dangerous goods", penalty: "Up to ₹500 and/or imprisonment" },
  { offence: "Obstructing metro employee on duty", penalty: "Up to ₹500 and/or imprisonment up to 6 months" },
  { offence: "Misuse of emergency equipment", penalty: "Up to ₹500" },
  { offence: "Pulling emergency alarm chain without cause", penalty: "Up to ₹1,000 and/or imprisonment up to 1 year" },
];

// Fare calculation
export function calculateFare(source: Station, destination: Station): { fare: number; stations: number; time: number; route: string[] } {
  const sameLine = source.line === destination.line;

  if (sameLine) {
    const stationCount = Math.abs(source.order - destination.order);
    const fare = Math.min(stationCount * 5, 25);
    const time = stationCount * 2.5 + 5;
    const line = source.line === "pink" ? pinkLineStations : orangeLineStations;
    const start = Math.min(source.order, destination.order);
    const end = Math.max(source.order, destination.order);
    const route = line.filter(s => s.order >= start && s.order <= end).map(s => s.name);
    if (source.order > destination.order) route.reverse();
    return { fare, stations: stationCount, time: Math.round(time), route };
  }

  // Inter-line transfer via Railway Station
  const pinkInterchange = pinkLineStations.find(s => s.id === "railway-station")!;
  const orangeInterchange = orangeLineStations.find(s => s.id === "railway-station-orange")!;

  const sourceLine = source.line === "pink" ? pinkLineStations : orangeLineStations;
  const destLine = destination.line === "pink" ? pinkLineStations : orangeLineStations;
  const sourceInterchange = source.line === "pink" ? pinkInterchange : orangeInterchange;
  const destInterchange = destination.line === "pink" ? pinkInterchange : orangeInterchange;

  const stationsToInterchange = Math.abs(source.order - sourceInterchange.order);
  const stationsFromInterchange = Math.abs(destInterchange.order - destination.order);
  const totalStations = stationsToInterchange + stationsFromInterchange;

  const fare = 30 + totalStations * 2;
  const time = totalStations * 2.5 + 5 + 5;

  const start1 = Math.min(source.order, sourceInterchange.order);
  const end1 = Math.max(source.order, sourceInterchange.order);
  const route1 = sourceLine.filter(s => s.order >= start1 && s.order <= end1).map(s => s.name);
  if (source.order > sourceInterchange.order) route1.reverse();

  const start2 = Math.min(destInterchange.order, destination.order);
  const end2 = Math.max(destInterchange.order, destination.order);
  const route2 = destLine.filter(s => s.order >= start2 && s.order <= end2).map(s => s.name);
  if (destInterchange.order > destination.order) route2.reverse();

  const route = [...route1, "(Transfer)", ...route2.slice(1)];

  return { fare, stations: totalStations, time: Math.round(time), route };
}

// Metro timings — Based on official JMRC data
export interface MetroTiming {
  line: string;
  firstTrain: string;
  lastTrain: string;
  frequency: string;
  holidayFirstTrain: string;
  holidayLastTrain: string;
  holidayFrequency: string;
}

export const metroTimings: MetroTiming[] = [
  {
    line: "Pink Line",
    firstTrain: "6:00 AM",
    lastTrain: "10:00 PM",
    frequency: "Every 10 minutes (Peak), Every 15 minutes (Off-Peak)",
    holidayFirstTrain: "7:00 AM",
    holidayLastTrain: "9:00 PM",
    holidayFrequency: "Every 15 minutes",
  },
];

// Smart Card / Fare Products from official JMRC data
export const fareProducts = {
  smartToken: {
    name: "Contactless Smart Token (CST)",
    types: [
      { name: "Single Journey Token", description: "One-time travel purpose" },
      { name: "Paid Exit Token", description: "For exit purpose (paid)" },
      { name: "Free Exit Token", description: "For exit purpose (free)" },
    ],
  },
  smartCard: {
    name: "Contactless Smart Card (CSC)",
    storeValue: [
      { name: "Store Value – 1 (SV-1)", description: "Multi-purpose card for regular commuters" },
      { name: "COMBO (12)", description: "12-trip combo card with discounted fare" },
      { name: "JMRC/HDFC Bank Co-Branded Smart Card", description: "Co-branded card with banking features" },
    ],
    touristCards: [
      { name: "One-Day Tour Card", description: "Unlimited travel for one day" },
      { name: "Three-Day Tour Card", description: "Unlimited travel for three days" },
    ],
  },
};

// Complaints
export type ComplaintCategory = "Cleanliness" | "Safety" | "Staff Behavior" | "Technical Issue" | "Delay" | "Other";
export type ComplaintPriority = "Low" | "Medium" | "High" | "Critical";
export type ComplaintStatus = "Submitted" | "Under Review" | "In Progress" | "Resolved" | "Closed";

export interface Complaint {
  id: string;
  referenceId: string;
  name: string;
  phone: string;
  email: string;
  station: string;
  category: ComplaintCategory;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedOfficer?: string;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
}

export const complaintCategories: ComplaintCategory[] = ["Cleanliness", "Safety", "Staff Behavior", "Technical Issue", "Delay", "Other"];
export const priorities: ComplaintPriority[] = ["Low", "Medium", "High", "Critical"];
export const statuses: ComplaintStatus[] = ["Submitted", "Under Review", "In Progress", "Resolved", "Closed"];

function generateId(): string {
  return "JMRC-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
}

const COMPLAINTS_KEY = "jmrc_complaints";

export function getComplaints(): Complaint[] {
  const data = localStorage.getItem(COMPLAINTS_KEY);
  if (!data) {
    const samples = generateSampleComplaints();
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(samples));
    return samples;
  }
  return JSON.parse(data);
}

export function saveComplaint(complaint: Omit<Complaint, "id" | "referenceId" | "status" | "createdAt" | "updatedAt" | "slaDeadline">): Complaint {
  const complaints = getComplaints();
  const now = new Date().toISOString();
  const slaHours = complaint.priority === "Critical" ? 4 : complaint.priority === "High" ? 24 : complaint.priority === "Medium" ? 48 : 72;
  const sla = new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString();

  const newComplaint: Complaint = {
    ...complaint,
    id: crypto.randomUUID(),
    referenceId: generateId(),
    status: "Submitted",
    createdAt: now,
    updatedAt: now,
    slaDeadline: sla,
  };
  complaints.unshift(newComplaint);
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  return newComplaint;
}

export function updateComplaint(id: string, updates: Partial<Complaint>): Complaint | null {
  const complaints = getComplaints();
  const idx = complaints.findIndex(c => c.id === id);
  if (idx === -1) return null;
  complaints[idx] = { ...complaints[idx], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
  return complaints[idx];
}

export function trackComplaint(referenceId: string, phone: string): Complaint | null {
  const complaints = getComplaints();
  return complaints.find(c => c.referenceId === referenceId && c.phone === phone) || null;
}

function generateSampleComplaints(): Complaint[] {
  return [
    { id: "1", referenceId: "JMRC-SAMPLE1", name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@example.com", station: "Chandpole", category: "Cleanliness", description: "Platform area needs cleaning near gate 2", priority: "Medium", status: "In Progress", assignedOfficer: "Mr. Sharma", createdAt: "2026-03-06T10:00:00Z", updatedAt: "2026-03-07T14:00:00Z", slaDeadline: "2026-03-08T10:00:00Z" },
    { id: "2", referenceId: "JMRC-SAMPLE2", name: "Priya Singh", phone: "9876543211", email: "priya@example.com", station: "Sindhi Camp", category: "Safety", description: "Broken handrail on escalator B", priority: "High", status: "Under Review", createdAt: "2026-03-07T09:00:00Z", updatedAt: "2026-03-07T09:00:00Z", slaDeadline: "2026-03-08T09:00:00Z" },
    { id: "3", referenceId: "JMRC-SAMPLE3", name: "Amit Jain", phone: "9876543212", email: "amit@example.com", station: "Mansarovar", category: "Delay", description: "Train delayed by 15 minutes during morning peak", priority: "High", status: "Resolved", assignedOfficer: "Ms. Gupta", createdAt: "2026-03-05T08:00:00Z", updatedAt: "2026-03-06T16:00:00Z", slaDeadline: "2026-03-06T08:00:00Z" },
    { id: "4", referenceId: "JMRC-SAMPLE4", name: "Sunita Devi", phone: "9876543213", email: "sunita@example.com", station: "Civil Lines", category: "Staff Behavior", description: "Staff was unhelpful at ticket counter", priority: "Low", status: "Submitted", createdAt: "2026-03-08T06:00:00Z", updatedAt: "2026-03-08T06:00:00Z", slaDeadline: "2026-03-11T06:00:00Z" },
    { id: "5", referenceId: "JMRC-SAMPLE5", name: "Mohammed Ali", phone: "9876543214", email: "ali@example.com", station: "Badi Chaupar", category: "Technical Issue", description: "Token vending machine not accepting coins", priority: "Critical", status: "In Progress", assignedOfficer: "Mr. Verma", createdAt: "2026-03-08T04:00:00Z", updatedAt: "2026-03-08T05:00:00Z", slaDeadline: "2026-03-08T08:00:00Z" },
  ];
}

// Service Alerts
export interface ServiceAlert {
  id: string;
  type: "delay" | "maintenance" | "emergency";
  title: string;
  description: string;
  affectedLine: string;
  affectedStations: string[];
  startTime: string;
  endTime?: string;
  active: boolean;
}

export const serviceAlerts: ServiceAlert[] = [
  { id: "1", type: "maintenance", title: "Scheduled Maintenance – Pink Line", description: "Track maintenance between Chandpole and Badi Chaupar. Shuttle bus service available.", affectedLine: "Pink Line", affectedStations: ["Chandpole", "Chhoti Chaupar", "Badi Chaupar"], startTime: "2026-03-10T00:00:00Z", endTime: "2026-03-10T05:00:00Z", active: true },
  { id: "2", type: "delay", title: "Minor Delays – Pink Line", description: "Expect 5-10 minute delays due to signal testing between Civil Lines and Railway Station.", affectedLine: "Pink Line", affectedStations: ["Civil Lines", "Railway Station"], startTime: "2026-03-08T14:00:00Z", endTime: "2026-03-08T18:00:00Z", active: true },
];

// Announcements
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "news" | "update" | "event";
}

export const announcements: Announcement[] = [
  { id: "1", title: "Phase 1C: Badi Chaupar to Transport Nagar Extension", content: "JMRC has prepared the Detailed Project Report (DPR) for Phase 1C extension from Badi Chaupar to Transport Nagar. The 3.412 km extension will include 2 stations — Ramganj Chaupar (underground) and Transport Nagar (elevated). Estimated cost: ₹856 crore.", date: "2026-03-05", category: "news" },
  { id: "2", title: "New Smart Card with 15% Discount on All Journeys", content: "JMRC introduces new rechargeable Store Value smart cards offering 15% discount on all journeys. Available at all station counters. JMRC/HDFC Bank co-branded cards also available.", date: "2026-03-03", category: "update" },
  { id: "3", title: "Women's Day Special – Free Travel for Women", content: "On March 8th, all women passengers can travel free on Jaipur Metro Pink Line. Valid on all stations from Mansarovar to Badi Chaupar.", date: "2026-03-01", category: "event" },
  { id: "4", title: "Extended Hours During Holi Festival", content: "Metro services will run extended hours during Holi celebrations. Last train at 11:30 PM on March 14. Regular frequency maintained.", date: "2026-02-28", category: "update" },
  { id: "5", title: "Phase 1D: Mansarovar to Ajmer Road Extension Planned", content: "JMRC plans to extend Pink Line from Mansarovar to Ajmer Road. The 1.312 km elevated extension will add 1 station at Ajmer Road with a 0.357 km loop line.", date: "2026-02-25", category: "news" },
];

// Metro Feeder Service info
export const feederServiceInfo = {
  description: "JMRC operates feeder bus services to connect metro stations with nearby residential and commercial areas for last-mile connectivity.",
  routes: [
    { from: "Mansarovar Metro Station", to: "Mansarovar Sector 1-12", frequency: "Every 15 minutes" },
    { from: "Chandpole Metro Station", to: "Old City Bazaars", frequency: "Every 20 minutes" },
    { from: "Badi Chaupar Metro Station", to: "Amber Fort / Nahargarh", frequency: "Every 30 minutes" },
  ],
};

// Parking at Metro Stations
export const parkingInfo = {
  availableAt: ["Mansarovar", "Vivek Vihar", "Civil Lines", "Railway Station", "Sindhi Camp"],
  charges: [
    { vehicle: "Two Wheeler", rate: "₹10 per day" },
    { vehicle: "Four Wheeler", rate: "₹20 per day" },
    { vehicle: "Bicycle", rate: "Free" },
  ],
  timings: "5:30 AM to 11:00 PM",
};
