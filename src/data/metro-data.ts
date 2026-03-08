export interface Station {
  id: string;
  name: string;
  line: "pink" | "orange";
  order: number;
  facilities: string[];
  parking: boolean;
  accessible: boolean;
  nearbyPlaces: string[];
  lat?: number;
  lng?: number;
}

export interface MetroLine {
  id: string;
  name: string;
  color: string;
  stations: Station[];
}

export const pinkLineStations: Station[] = [
  { id: "mansarovar", name: "Mansarovar", line: "pink", order: 1, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp"], parking: true, accessible: true, nearbyPlaces: ["Mansarovar Housing Board", "Sector 7 Market"] },
  { id: "new-aatish-market", name: "New Aatish Market", line: "pink", order: 2, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Aatish Market", "Residential Area"] },
  { id: "vivek-vihar", name: "Vivek Vihar", line: "pink", order: 3, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Vivek Vihar Colony", "Schools"] },
  { id: "shyam-nagar", name: "Shyam Nagar", line: "pink", order: 4, facilities: ["Lift", "Escalator", "Wheelchair Ramp"], parking: false, accessible: true, nearbyPlaces: ["Shyam Nagar Market", "Hospital"] },
  { id: "ram-nagar", name: "Ram Nagar", line: "pink", order: 5, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Ram Nagar Colony"] },
  { id: "civil-lines", name: "Civil Lines", line: "pink", order: 6, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp"], parking: true, accessible: true, nearbyPlaces: ["Rajasthan University", "SMS Hospital"] },
  { id: "railway-station", name: "Railway Station", line: "pink", order: 7, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp", "Interchange"], parking: true, accessible: true, nearbyPlaces: ["Jaipur Railway Station", "Bus Stand"] },
  { id: "sindhi-camp", name: "Sindhi Camp", line: "pink", order: 8, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp"], parking: true, accessible: true, nearbyPlaces: ["Sindhi Camp Bus Stand", "Hotels"] },
  { id: "chandpole", name: "Chandpole", line: "pink", order: 9, facilities: ["Lift", "Escalator", "Wheelchair Ramp"], parking: false, accessible: true, nearbyPlaces: ["Chandpole Bazaar", "Old City Gate"] },
  { id: "chhoti-chaupar", name: "Chhoti Chaupar", line: "pink", order: 10, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Hawa Mahal", "Johari Bazaar"] },
  { id: "badi-chaupar", name: "Badi Chaupar", line: "pink", order: 11, facilities: ["Lift", "Escalator", "Wheelchair Ramp"], parking: false, accessible: true, nearbyPlaces: ["City Palace", "Jantar Mantar", "Hawa Mahal"] },
];

export const orangeLineStations: Station[] = [
  { id: "ambabari", name: "Ambabari", line: "orange", order: 1, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Ambabari Circle", "Commercial Area"] },
  { id: "raja-park", name: "Raja Park", line: "orange", order: 2, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Raja Park Market", "Cafes"] },
  { id: "malviya-nagar", name: "Malviya Nagar", line: "orange", order: 3, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Malviya Nagar Market", "WTP"] },
  { id: "tonk-road", name: "Tonk Road", line: "orange", order: 4, facilities: ["Lift", "Escalator"], parking: false, accessible: true, nearbyPlaces: ["Tonk Road Commercial Hub"] },
  { id: "railway-station-orange", name: "Railway Station", line: "orange", order: 5, facilities: ["Lift", "Escalator", "Parking", "Wheelchair Ramp", "Interchange"], parking: true, accessible: true, nearbyPlaces: ["Jaipur Railway Station", "Interchange to Pink Line"] },
  { id: "jagatpura", name: "Jagatpura", line: "orange", order: 6, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Jagatpura Flyover", "IT Park"] },
  { id: "sitapura", name: "Sitapura", line: "orange", order: 7, facilities: ["Lift", "Escalator", "Parking"], parking: true, accessible: true, nearbyPlaces: ["Sitapura Industrial Area", "SEZ"] },
];

export const allStations: Station[] = [...pinkLineStations, ...orangeLineStations];

export const metroLines: MetroLine[] = [
  { id: "pink", name: "Pink Line", color: "hsl(350, 60%, 45%)", stations: pinkLineStations },
  { id: "orange", name: "Orange Line", color: "hsl(35, 90%, 52%)", stations: orangeLineStations },
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
  const time = totalStations * 2.5 + 5 + 5; // extra 5 min for transfer

  // Build route
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

// Metro timings
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
  {
    line: "Orange Line",
    firstTrain: "6:30 AM",
    lastTrain: "9:30 PM",
    frequency: "Every 12 minutes (Peak), Every 18 minutes (Off-Peak)",
    holidayFirstTrain: "7:30 AM",
    holidayLastTrain: "9:00 PM",
    holidayFrequency: "Every 18 minutes",
  },
];

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

// localStorage-based complaint store
const COMPLAINTS_KEY = "jmrc_complaints";

export function getComplaints(): Complaint[] {
  const data = localStorage.getItem(COMPLAINTS_KEY);
  if (!data) {
    // Seed with sample data
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
  const samples: Complaint[] = [
    { id: "1", referenceId: "JMRC-SAMPLE1", name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@example.com", station: "Chandpole", category: "Cleanliness", description: "Platform area needs cleaning near gate 2", priority: "Medium", status: "In Progress", assignedOfficer: "Mr. Sharma", createdAt: "2026-03-06T10:00:00Z", updatedAt: "2026-03-07T14:00:00Z", slaDeadline: "2026-03-08T10:00:00Z" },
    { id: "2", referenceId: "JMRC-SAMPLE2", name: "Priya Singh", phone: "9876543211", email: "priya@example.com", station: "Sindhi Camp", category: "Safety", description: "Broken handrail on escalator B", priority: "High", status: "Under Review", createdAt: "2026-03-07T09:00:00Z", updatedAt: "2026-03-07T09:00:00Z", slaDeadline: "2026-03-08T09:00:00Z" },
    { id: "3", referenceId: "JMRC-SAMPLE3", name: "Amit Jain", phone: "9876543212", email: "amit@example.com", station: "Mansarovar", category: "Delay", description: "Train delayed by 15 minutes during morning peak", priority: "High", status: "Resolved", assignedOfficer: "Ms. Gupta", createdAt: "2026-03-05T08:00:00Z", updatedAt: "2026-03-06T16:00:00Z", slaDeadline: "2026-03-06T08:00:00Z" },
    { id: "4", referenceId: "JMRC-SAMPLE4", name: "Sunita Devi", phone: "9876543213", email: "sunita@example.com", station: "Civil Lines", category: "Staff Behavior", description: "Staff was unhelpful at ticket counter", priority: "Low", status: "Submitted", createdAt: "2026-03-08T06:00:00Z", updatedAt: "2026-03-08T06:00:00Z", slaDeadline: "2026-03-11T06:00:00Z" },
    { id: "5", referenceId: "JMRC-SAMPLE5", name: "Mohammed Ali", phone: "9876543214", email: "ali@example.com", station: "Badi Chaupar", category: "Technical Issue", description: "Token vending machine not accepting coins", priority: "Critical", status: "In Progress", assignedOfficer: "Mr. Verma", createdAt: "2026-03-08T04:00:00Z", updatedAt: "2026-03-08T05:00:00Z", slaDeadline: "2026-03-08T08:00:00Z" },
  ];
  return samples;
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
  { id: "1", type: "maintenance", title: "Scheduled Maintenance - Pink Line", description: "Track maintenance between Chandpole and Badi Chaupar. Shuttle bus service available.", affectedLine: "Pink Line", affectedStations: ["Chandpole", "Chhoti Chaupar", "Badi Chaupar"], startTime: "2026-03-10T00:00:00Z", endTime: "2026-03-10T05:00:00Z", active: true },
  { id: "2", type: "delay", title: "Minor Delays - Orange Line", description: "Expect 5-10 minute delays due to signal testing on Orange Line.", affectedLine: "Orange Line", affectedStations: ["Malviya Nagar", "Tonk Road"], startTime: "2026-03-08T14:00:00Z", endTime: "2026-03-08T18:00:00Z", active: true },
  { id: "3", type: "emergency", title: "Service Suspended", description: "Service temporarily suspended between Railway Station and Sitapura due to technical fault. Expected resumption by 4 PM.", affectedLine: "Orange Line", affectedStations: ["Railway Station", "Jagatpura", "Sitapura"], startTime: "2026-03-08T12:00:00Z", active: true },
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
  { id: "1", title: "Orange Line Phase 2 Construction Begins", content: "Construction work for the Orange Line extension from Sitapura to Sanganer Airport has commenced. Expected completion by December 2027.", date: "2026-03-05", category: "news" },
  { id: "2", title: "New Smart Card with 15% Discount", content: "JMRC introduces new rechargeable smart cards offering 15% discount on all journeys. Available at all station counters starting March 15.", date: "2026-03-03", category: "update" },
  { id: "3", title: "Women's Day Special - Free Travel", content: "On March 8th, all women passengers can travel free on Jaipur Metro. Valid on both Pink and Orange lines.", date: "2026-03-01", category: "event" },
  { id: "4", title: "Extended Hours During Holi Festival", content: "Metro services will run extended hours during Holi celebrations. Last train at 11:30 PM on March 14.", date: "2026-02-28", category: "update" },
];
