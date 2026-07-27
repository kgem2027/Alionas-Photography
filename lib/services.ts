import { prisma } from "@/lib/prisma";
import {Session} from "next-auth"

export async function getServices(session: Session | null) {
    const isAdmin = session?.user?.role === "Admin"
    if (isAdmin){
        return prisma.service.findMany({
            orderBy: {name: "asc"}
        })
    }
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
