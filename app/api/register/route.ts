import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const {name, email, password} = body;

    if (!name || !email || !password) {
        return NextResponse.json({error: "Name, email, and password are required"}, {status: 400});
    }

    try {
        const existingUser = await prisma.user.findUnique({where: {email}});

        if (existingUser) {
            return NextResponse.json({error: "User already exists"}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {email, password: hashedPassword, name},
            select: {id: true, email: true, name: true, role: true}
        });

        return NextResponse.json({user}, {status: 201});
    } catch {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}