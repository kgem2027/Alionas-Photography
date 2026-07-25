import { prisma } from "@/lib/prisma";

export async function getActiveServices() {
    return prisma.service.findMany({
        where: { active: true },
        orderBy: { name: "asc" }
    });
}

export async function createService(data: { name: string; price: number; description?: string }) {
    return prisma.service.create({
        data: {
            name: data.name,
            price: data.price,
            description: data.description,
            active: true
        }
    });
}
