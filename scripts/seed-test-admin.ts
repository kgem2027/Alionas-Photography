import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const password = await bcrypt.hash("Test1234!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "test-admin@example.com" },
    update: { password, role: "Admin" },
    create: { email: "test-admin@example.com", name: "Test Admin", password, role: "Admin" },
  });

  const client = await prisma.user.upsert({
    where: { email: "test-client@example.com" },
    update: { password, role: "User" },
    create: { email: "test-client@example.com", name: "Test Client", password, role: "User" },
  });

  let service = await prisma.service.findFirst({ where: { active: true } });
  if (!service) {
    service = await prisma.service.create({ data: { name: "Test Shoot", price: 100, active: true } });
  }

  const booking = await prisma.bookings.create({
    data: {
      serviceId: service.id,
      userId: client.id,
      streetAddress: "123 Test St",
      zipCode: "12345",
      city: "Testville",
      state: "TS",
      accomodations: "none",
      shootDate: new Date(Date.now() + 86400000 * 7),
      endTime: new Date(Date.now() + 86400000 * 7 + 2 * 60 * 60 * 1000),
      status: "PENDING",
    },
  });

  console.log(JSON.stringify({ adminEmail: admin.email, bookingId: booking.id, serviceId: service.id }, null, 2));
}

main().finally(() => prisma.$disconnect());
