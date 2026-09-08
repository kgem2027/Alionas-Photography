import {auth} from "@/lib/auth";
import { createReview, deleteReview, getAllReviews } from "@/lib/reviews";
import { NextResponse } from "next/server";


export async function POST(req: Request){
    const session = await auth()
    const body = await req.json()
    const {title, description, rating} = body
    if(!description){
        return NextResponse.json({error: "Cannot leave description empty"}, {status: 400})
    }
    try{
        const review = await createReview(session, {title, description, rating})
        return NextResponse.json({review}, {status:201})
    } catch(error){
        if (error instanceof Error) {
            if (error.message === "You must be logged in to leave a review") {
                return NextResponse.json({error: error.message}, {status: 401})
            }
            if (error.message === "Only users can leave a review") {
                return NextResponse.json({error: error.message}, {status: 403})
            }
        }
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}

export async function DELETE(req:Request) {
    const session = await auth()
    const body= await req.json()
    const {id} = body
    if (!id){
        return NextResponse.json({error:"Must use reviewId"}, {status: 400})
    }
    try{
        const deleted = await deleteReview(session, id)
        return NextResponse.json({deleted}, {status:200})
    }catch(error){
        if (error instanceof Error){
            if (error.message === "Must be logged in"){
                return NextResponse.json({error: error.message}, {status:401})
            }
            if (error.message === "Review not found or you don't have permission to delete it"){
                return NextResponse.json({error: error.message}, {status: 403})
            }
        }
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}

export async function GET(){
    try{
        const reviews = await getAllReviews()
        return NextResponse.json({reviews}, {status: 200})
    } catch(error){
        if(error instanceof Error){
            if(error.message === "No Reviews exist"){
                return NextResponse.json({error: error.message}, {status:404})
            }
        }
        return NextResponse.json({error: "Internal Error"}, {status: 500})
    }
}