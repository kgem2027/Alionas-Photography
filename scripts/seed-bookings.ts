import "dotenv/config";
import { prisma } from "../lib/prisma";

const STREET_NAMES = [
  "Maple", "Oak", "Cedar", "Elm", "Pine", "Birch", "Willow", "Sunset",
  "Lakeview", "Highland", "Meadow", "River", "Chestnut", "Spruce", "Hillcrest",
];
const STREET_TYPES = ["St", "Ave", "Rd", "Blvd", "Ln", "Dr", "Ct"];

const CITIES = [
  { city: "Springfield", state: "IL" },
  { city: "Franklin", state: "TN" },
  { city: "Georgetown", state: "TX" },
  { city: "Riverside", state: "CA" },
  { city: "Fairview", state: "OH" },
  { city: "Salem", state: "OR" },
  { city: "Madison", state: "WI" },
  { city: "Arlington", state: "VA" },
];

const ACCOMMODATIONS = [
  "none",
  "wheelchair access needed",
  "prefers early morning",
  "has a dog on site",
  "parking is limited, street only",
  "please use side entrance",
  "allergic to flowers",
  "requests quiet environment",
];

const STATUSES = ["PENDING", "CONFIRMED", "CANCLED", "COMPLETED"] as const;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]) {
  return arr[randomInt(0, arr.length - 1)];
}

function randomStreetAddress() {
  return `${randomInt(100, 9999)} ${randomItem(STREET_NAMES)} ${randomItem(STREET_TYPES)}`;
}

function randomZip() {
  return String(randomInt(10000, 99999));
}

function randomShootDate() {
  // spread bookings across ~60 days in the past to ~90 days in the future
  const offsetDays = randomInt(-60, 90);
  return new Date(Date.now() + offsetDays * 86400000);
}

async function main() {
  const users = await prisma.user.findMany({ where: { role: "User" } });
  const services = await prisma.service.findMany({ where: { active: true } });

  if (users.length === 0) {
    throw new Error("No users with role 'User' found. Create a user before seeding bookings.");
  }
  if (services.length === 0) {
    throw new Error("No active services found. Create a service before seeding bookings.");
  }

  const BOOKING_COUNT = 30;

  for (let i = 0; i < BOOKING_COUNT; i++) {
    const user = randomItem(users);
    const service = randomItem(services);
    const location = randomItem(CITIES);
    const shootDate = randomShootDate();

    await prisma.bookings.create({
      data: {
        userId: user.id,
        serviceId: service.id,
        streetAddress: randomStreetAddress(),
        zipCode: randomZip(),
        city: location.city,
        state: location.state,
        accomodations: randomItem(ACCOMMODATIONS),
        shootDate,
        endTime: new Date(shootDate.getTime() + 2 * 60 * 60 * 1000),
        status: randomItem([...STATUSES]),
      },
    });
  }

  console.log(`Seeded ${BOOKING_COUNT} bookings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
