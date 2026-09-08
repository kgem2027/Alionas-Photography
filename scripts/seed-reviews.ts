import "dotenv/config";
import { prisma } from "../lib/prisma";

const WORDS = [
  "amazing", "photos", "captured", "moment", "perfectly", "professional",
  "friendly", "session", "beautiful", "memories", "recommend", "highly",
  "patient", "creative", "stunning", "quality", "experience", "wedding",
  "family", "portrait", "lighting", "editing", "quick", "responsive",
  "affordable", "talented", "wonderful", "photographer", "shoot", "loved",
  "results", "worth", "every", "penny", "again", "book", "definitely",
  "team", "kids", "smiling", "natural", "posed", "candid", "flawless",
];

const TITLES = [
  "Great experience",
  "Highly recommend",
  "Loved the photos",
  "Amazing session",
  "Worth every penny",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDescription() {
  const wordCount = randomInt(5, 80);
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(WORDS[randomInt(0, WORDS.length - 1)]);
  }
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

async function main() {
  const users = await prisma.user.findMany({ where: { role: "User" } });

  if (users.length === 0) {
    throw new Error("No users with role 'User' found. Create a user before seeding reviews.");
  }

  const REVIEW_COUNT = 25;

  for (let i = 0; i < REVIEW_COUNT; i++) {
    const user = users[randomInt(0, users.length - 1)];
    const hasTitle = Math.random() > 0.3;

    await prisma.reviews.create({
      data: {
        userId: user.id,
        title: hasTitle ? TITLES[randomInt(0, TITLES.length - 1)] : null,
        description: randomDescription(),
        rating: randomInt(1, 5),
      },
    });
  }

  console.log(`Seeded ${REVIEW_COUNT} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
