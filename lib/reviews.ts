import { prisma } from "@/lib/prisma";
import {Session} from "next-auth";

export async function createReview(session: Session | null, data:{title?: string, description: string}){
    if (!session?.user?.id) {
        throw new Error("You must be logged in to leave a review")
    }
    if (session.user.role !== "User") {
        throw new Error("Only users can leave a review")
    }
    return prisma.reviews.create({
        data: {
            ...data,
            userId: session.user.id
        }
    })
}
export async function deleteReview(session: Session | null, id: string){
    if(!session?.user?.id){
        throw new Error("Must be logged in")
    }
    const isAdmin = session.user.role === "Admin"
    try{
        return await prisma.reviews.delete({
            where: {
                id,
                ...(isAdmin ? {} : { userId: session.user.id })
            }
        })
    } catch{
        throw new Error("Review not found or you don't have permission to delete it")
    }
}

export async function getAllReviews(){
    try{
        return await prisma.reviews.findMany({
            orderBy:{createdAt: "desc"}
        })
    } catch{
        throw new Error("No Reviews exist")
    }
}