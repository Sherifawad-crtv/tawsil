import type { Client, Contractor, Driver, Vehicle, SavedLocation } from "./types";
import { TRUCK_TYPES } from "./constants";

export const CLIENTS: Client[] = [
  { id: "cli-01", name: "Juhayna Food Industries", email: "logistics@juhayna.com", phone: "+20 100 111 2201", taxNumber: "TX-118820", registrationNumber: "RC-40021", active: true, createdAt: "2024-02-11" },
  { id: "cli-02", name: "Carrefour Egypt", email: "supplychain@carrefouregypt.com", phone: "+20 100 111 2202", taxNumber: "TX-118821", registrationNumber: "RC-40022", active: true, createdAt: "2023-11-03" },
  { id: "cli-03", name: "Edita Food Industries", email: "distribution@edita.com.eg", phone: "+20 100 111 2203", taxNumber: "TX-118822", registrationNumber: "RC-40023", active: true, createdAt: "2024-04-22" },
  { id: "cli-04", name: "Al Ahram Beverages", email: "ops@ahrambev.com", phone: "+20 100 111 2204", taxNumber: "TX-118823", registrationNumber: "RC-40024", active: true, createdAt: "2023-08-15" },
  { id: "cli-05", name: "Nestlé Egypt", email: "logistics.eg@nestle.com", phone: "+20 100 111 2205", taxNumber: "TX-118824", registrationNumber: "RC-40025", active: true, createdAt: "2023-05-02" },
  { id: "cli-06", name: "Domty Dairy", email: "supply@domty.com", phone: "+20 100 111 2206", taxNumber: "TX-118825", registrationNumber: "RC-40026", active: true, createdAt: "2024-06-19" },
  { id: "cli-07", name: "Hero Egypt", email: "logistics@heroegypt.com", phone: "+20 100 111 2207", taxNumber: "TX-118826", registrationNumber: "RC-40027", active: true, createdAt: "2024-01-09" },
  { id: "cli-08", name: "Americana Group", email: "distribution@americana.com.eg", phone: "+20 100 111 2208", taxNumber: "TX-118827", registrationNumber: "RC-40028", active: true, createdAt: "2023-09-27" },
  { id: "cli-09", name: "Spinneys Egypt", email: "supplychain@spinneys.com.eg", phone: "+20 100 111 2209", taxNumber: "TX-118828", registrationNumber: "RC-40029", active: true, createdAt: "2024-03-14" },
  { id: "cli-10", name: "B.Tech Electronics", email: "logistics@btech.com", phone: "+20 100 111 2210", taxNumber: "TX-118829", registrationNumber: "RC-40030", active: true, createdAt: "2024-07-01" },
  { id: "cli-11", name: "Obour Land for Food Industries", email: "ops@obourland.com", phone: "+20 100 111 2211", taxNumber: "TX-118830", registrationNumber: "RC-40031", active: false, createdAt: "2023-02-18" },
  { id: "cli-12", name: "Cairo Poultry Company", email: "distribution@cairopoultry.com", phone: "+20 100 111 2212", taxNumber: "TX-118831", registrationNumber: "RC-40032", active: true, createdAt: "2024-08-05" },
];

export const CONTRACTORS: Contractor[] = [
  { id: "con-01", name: "Nile Fleet Logistics", nationalId: "29001011234567", email: "ops@nilefleet.com", phone: "+20 101 222 3301", firstName: "Mostafa", lastName: "Rageh", active: true },
  { id: "con-02", name: "Delta Cargo Carriers", nationalId: "28805122345678", email: "dispatch@deltacargo.com", phone: "+20 101 222 3302", firstName: "Ahmed", lastName: "Fathy", active: true },
  { id: "con-03", name: "Red Sea Transport Co.", nationalId: "29105063456789", email: "info@redseatransport.com", phone: "+20 101 222 3303", firstName: "Youssef", lastName: "Adly", active: true },
  { id: "con-04", name: "Pharaoh Heavy Haulage", nationalId: "28703094567890", email: "fleet@pharaohhaulage.com", phone: "+20 101 222 3304", firstName: "Karim", lastName: "Sobhy", active: true },
  { id: "con-05", name: "Suez Gateway Trucking", nationalId: "29208175678901", email: "ops@suezgateway.com", phone: "+20 101 222 3305", firstName: "Hassan", lastName: "Nabil", active: true },
  { id: "con-06", name: "Alex Cold Chain Fleet", nationalId: "28912286789012", email: "dispatch@alexcoldchain.com", phone: "+20 101 222 3306", firstName: "Tarek", lastName: "Gomaa", active: true },
];

const DRIVER_FIRST_NAMES = ["Mahmoud", "Ahmed", "Mohamed", "Ali", "Sayed", "Hany", "Wael", "Ibrahim", "Ashraf", "Tamer", "Ramy", "Sherif", "Khaled", "Fady", "Amr", "Osama", "Magdy", "Sami", "Nabil", "Ehab", "Gamal", "Adel", "Ayman", "Waleed", "Rafik", "Hossam", "Emad", "Bassem", "Fathy", "Mostafa", "Sameh", "Anwar", "Talaat"];
const DRIVER_LAST_INITIALS = ["A.", "B.", "M.", "S.", "H.", "R.", "K.", "T.", "F.", "N.", "G.", "O.", "Y.", "D.", "E.", "L.", "Z.", "W.", "Q.", "I.", "J.", "C.", "P.", "V.", "X.", "U.", "Aa.", "Ab.", "Ac.", "Ad.", "Ae.", "Af.", "Ag."];

export const DRIVERS: Driver[] = Array.from({ length: 33 }, (_, i) => {
  const contractorIndex = i % CONTRACTORS.length;
  const rating = Math.round((4.55 + ((i * 37) % 45) / 100) * 100) / 100;
  return {
    id: `drv-${String(i + 1).padStart(2, "0")}`,
    contractorId: CONTRACTORS[contractorIndex].id,
    name: `${DRIVER_FIRST_NAMES[i]} ${DRIVER_LAST_INITIALS[i]}`,
    email: `driver${i + 1}@${CONTRACTORS[contractorIndex].email.split("@")[1]}`,
    phone: `+20 10${(2 + (i % 8))} ${String(300 + i).padStart(3, "0")} ${String(4000 + i * 7).padStart(4, "0")}`,
    licenseNumber: `DL-${20200 + i * 13}`,
    licenseExpiry: `202${6 + (i % 3)}-${String(1 + (i % 12)).padStart(2, "0")}-15`,
    rating,
    totalTrips: 120 + i * 47 + (i % 5) * 30,
    active: i % 11 !== 0,
  };
});

export const VEHICLES: Vehicle[] = Array.from({ length: 42 }, (_, i) => {
  const contractorIndex = i % CONTRACTORS.length;
  const truckType = TRUCK_TYPES[i % TRUCK_TYPES.length];
  return {
    id: `veh-${String(i + 1).padStart(2, "0")}`,
    contractorId: CONTRACTORS[contractorIndex].id,
    truckTypeId: truckType.id,
    plateNumber: `${["ن ق", "ط ص", "س ل", "ع ه", "ب و", "د ج"][contractorIndex]} ${1000 + i * 23}`,
    licenseExpiry: `202${6 + (i % 3)}-${String(1 + (i % 12)).padStart(2, "0")}-01`,
    active: i % 13 !== 0,
    specs: {
      maxWeightT: truckType.capacityMaxT,
      year: 2018 + (i % 7),
      lengthM: truckType.baseClass === "Trailer" ? 13.6 : truckType.baseClass === "Jumbo" ? 7.2 : truckType.baseClass === "Dababa" ? 4.3 : 3.1,
      widthM: truckType.baseClass === "Trailer" ? 2.5 : 2.1,
    },
  };
});

export const SAVED_LOCATIONS: SavedLocation[] = [
  { id: "loc-01", clientId: "cli-01", name: "Juhayna Main Warehouse — 6th of October", address: "Industrial Zone 3, 6th of October City, Giza", lat: 29.9285, lng: 30.9188, tags: ["Warehouse", "Frequent Pickup"], contactName: "Mona Sabry", contactPhone: "+20 100 555 0101" },
  { id: "loc-02", clientId: "cli-01", name: "Juhayna Cairo Distribution Center", address: "Cairo-Ismailia Rd, Cairo", lat: 30.1298, lng: 31.4267, tags: ["Distribution Center"], contactName: "Hany Fawzy", contactPhone: "+20 100 555 0102" },
  { id: "loc-03", clientId: "cli-02", name: "Carrefour City Stars Hub", address: "Nasr City, Cairo", lat: 30.0728, lng: 31.3459, tags: ["Retail Hub"], contactName: "Rania Adel", contactPhone: "+20 100 555 0201" },
  { id: "loc-04", clientId: "cli-02", name: "Carrefour Maadi DC", address: "Maadi, Cairo", lat: 29.9602, lng: 31.2569, tags: ["Distribution Center", "Frequent Dropoff"] },
  { id: "loc-05", clientId: "cli-03", name: "Edita Factory — 10th of Ramadan", address: "10th of Ramadan City, Sharqia", lat: 30.2967, lng: 31.7492, tags: ["Factory", "Frequent Pickup"] },
  { id: "loc-06", clientId: "cli-04", name: "Al Ahram Beverages Plant — 6th October", address: "6th of October City, Giza", lat: 29.9524, lng: 30.9151, tags: ["Factory"] },
  { id: "loc-07", clientId: "cli-05", name: "Nestlé Distribution Center — Sadat City", address: "Sadat City, Menoufia", lat: 30.3626, lng: 30.5615, tags: ["Distribution Center", "Frequent Pickup"] },
  { id: "loc-08", clientId: "cli-05", name: "Nestlé Alexandria Hub", address: "Amreya, Alexandria", lat: 31.0293, lng: 29.7896, tags: ["Regional Hub"] },
  { id: "loc-09", clientId: "cli-06", name: "Domty Cold Storage — Obour", address: "Obour City, Qalyubia", lat: 30.2277, lng: 31.4693, tags: ["Cold Storage"] },
  { id: "loc-10", clientId: "cli-09", name: "Spinneys Zamalek Store", address: "Zamalek, Cairo", lat: 30.0626, lng: 31.2222, tags: ["Retail"] },
  { id: "loc-11", clientId: "cli-12", name: "Cairo Poultry Processing Plant", address: "Belbeis Rd, Sharqia", lat: 30.4189, lng: 31.5619, tags: ["Factory", "Cold Chain"] },
  { id: "loc-12", clientId: "cli-07", name: "Hero Egypt Warehouse — 10th of Ramadan", address: "10th of Ramadan City, Sharqia", lat: 30.3011, lng: 31.7381, tags: ["Warehouse"] },
  // Demo spread: the first twelve all sit in Greater Cairo, the Delta edge
  // and Alexandria, which paints the coverage map as a single smudge. These
  // put a drop-off in every region so the footprint reads across Egypt. A
  // client's first location stays its pickup (ordersMock reads locs[0]);
  // everything added here is a drop-off. Addresses are written
  // "<area>, <governorate>" so coverage.areaOf reads them cleanly.
  { id: "loc-13", clientId: "cli-01", name: "Juhayna New Cairo DC", address: "New Cairo, Cairo", lat: 30.0300, lng: 31.4700, tags: ["Distribution Center"] },
  { id: "loc-14", clientId: "cli-01", name: "Juhayna Delta Hub — Damanhour", address: "Damanhour, Beheira", lat: 31.0341, lng: 30.4682, tags: ["Regional Hub"] },
  { id: "loc-15", clientId: "cli-01", name: "Juhayna Upper Egypt — Sohag", address: "Sohag, Sohag", lat: 26.5569, lng: 31.6948, tags: ["Regional Hub"] },
  { id: "loc-16", clientId: "cli-02", name: "Carrefour Sheikh Zayed", address: "Sheikh Zayed, Giza", lat: 30.0400, lng: 30.9700, tags: ["Retail"] },
  { id: "loc-17", clientId: "cli-02", name: "Carrefour Heliopolis", address: "Heliopolis, Cairo", lat: 30.0880, lng: 31.3280, tags: ["Retail"] },
  { id: "loc-18", clientId: "cli-02", name: "Carrefour Borg El Arab", address: "Borg El Arab, Alexandria", lat: 30.9166, lng: 29.5833, tags: ["Retail"] },
  { id: "loc-19", clientId: "cli-02", name: "Carrefour Suez", address: "Suez, Suez", lat: 29.9668, lng: 32.5498, tags: ["Retail"] },
  { id: "loc-20", clientId: "cli-03", name: "Edita Benha Depot", address: "Benha, Qalyubia", lat: 30.4590, lng: 31.1786, tags: ["Depot"] },
  { id: "loc-21", clientId: "cli-03", name: "Edita Beni Suef Depot", address: "Beni Suef, Beni Suef", lat: 29.0661, lng: 31.0994, tags: ["Depot"] },
  { id: "loc-22", clientId: "cli-03", name: "Edita Fayoum Depot", address: "Fayoum, Fayoum", lat: 29.3084, lng: 30.8428, tags: ["Depot"] },
  { id: "loc-23", clientId: "cli-04", name: "Al Ahram Marsa Matruh Depot", address: "Marsa Matruh, Matrouh", lat: 31.3543, lng: 27.2373, tags: ["Depot", "Seasonal"] },
  { id: "loc-24", clientId: "cli-04", name: "Al Ahram Kafr El Sheikh Depot", address: "Kafr El Sheikh, Kafr El Sheikh", lat: 31.1107, lng: 30.9388, tags: ["Depot"] },
  { id: "loc-25", clientId: "cli-05", name: "Nestlé Qena Hub", address: "Qena, Qena", lat: 26.1551, lng: 32.7160, tags: ["Regional Hub"] },
  { id: "loc-26", clientId: "cli-06", name: "Domty Tanta DC", address: "Tanta, Gharbia", lat: 30.7865, lng: 31.0004, tags: ["Distribution Center", "Cold Chain"] },
  { id: "loc-27", clientId: "cli-07", name: "Hero Mansoura Depot", address: "Mansoura, Dakahlia", lat: 31.0409, lng: 31.3785, tags: ["Depot"] },
  { id: "loc-28", clientId: "cli-08", name: "Americana Plant — 6th of October", address: "6th of October City, Giza", lat: 29.9400, lng: 30.9300, tags: ["Factory", "Frequent Pickup"] },
  { id: "loc-29", clientId: "cli-08", name: "Americana Red Sea Hub — Hurghada", address: "Hurghada, Red Sea", lat: 27.2579, lng: 33.8116, tags: ["Regional Hub"] },
  { id: "loc-30", clientId: "cli-08", name: "Americana Luxor Depot", address: "Luxor, Luxor", lat: 25.6872, lng: 32.6396, tags: ["Depot"] },
  { id: "loc-31", clientId: "cli-08", name: "Americana Aswan Depot", address: "Aswan, Aswan", lat: 24.0889, lng: 32.8998, tags: ["Depot"] },
  { id: "loc-32", clientId: "cli-09", name: "Spinneys New Cairo Store", address: "New Cairo, Cairo", lat: 30.0200, lng: 31.4900, tags: ["Retail"] },
  { id: "loc-33", clientId: "cli-09", name: "Spinneys Heliopolis Store", address: "Heliopolis, Cairo", lat: 30.0950, lng: 31.3400, tags: ["Retail"] },
  { id: "loc-34", clientId: "cli-10", name: "B.Tech Central Warehouse — Obour", address: "Obour City, Qalyubia", lat: 30.2200, lng: 31.4800, tags: ["Warehouse", "Frequent Pickup"] },
  { id: "loc-35", clientId: "cli-10", name: "B.Tech Mansoura Showroom", address: "Mansoura, Dakahlia", lat: 31.0450, lng: 31.3700, tags: ["Retail"] },
  { id: "loc-36", clientId: "cli-10", name: "B.Tech Assiut Showroom", address: "Assiut, Assiut", lat: 27.1809, lng: 31.1837, tags: ["Retail"] },
  { id: "loc-37", clientId: "cli-10", name: "B.Tech Minya Showroom", address: "Minya, Minya", lat: 28.1099, lng: 30.7503, tags: ["Retail"] },
  { id: "loc-38", clientId: "cli-11", name: "Obour Land Factory — 10th of Ramadan", address: "10th of Ramadan City, Sharqia", lat: 30.2900, lng: 31.7600, tags: ["Factory", "Frequent Pickup"] },
  { id: "loc-39", clientId: "cli-11", name: "Obour Land Zagazig Depot", address: "Zagazig, Sharqia", lat: 30.5877, lng: 31.5020, tags: ["Depot"] },
  { id: "loc-40", clientId: "cli-11", name: "Obour Land Ismailia Depot", address: "Ismailia, Ismailia", lat: 30.6043, lng: 32.2723, tags: ["Depot"] },
  { id: "loc-41", clientId: "cli-11", name: "Obour Land Port Said Depot", address: "Port Said, Port Said", lat: 31.2653, lng: 32.3019, tags: ["Depot"] },
  { id: "loc-42", clientId: "cli-11", name: "Obour Land Damietta Depot", address: "Damietta, Damietta", lat: 31.4165, lng: 31.8133, tags: ["Depot"] },
  { id: "loc-43", clientId: "cli-12", name: "Cairo Poultry Zagazig Farm", address: "Zagazig, Sharqia", lat: 30.6000, lng: 31.4800, tags: ["Farm", "Cold Chain"] },
  { id: "loc-44", clientId: "cli-12", name: "Cairo Poultry Suez Cold Store", address: "Suez, Suez", lat: 29.9800, lng: 32.5300, tags: ["Cold Storage"] },
];
