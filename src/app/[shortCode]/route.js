import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const { shortCode } = await params;

        const url = await prisma.url.findUnique({
            where: {
                shortCode,
            },
        });

        if (!url) {
            return Response.json(
                { error: "Short URL not found" },
                { status: 404 }
            );
        }

        await prisma.url.update({
            where: {
                id: url.id,
            },
            data: {
                clicks: {
                    increment: 1,
                },
            },
        });

        return Response.redirect(url.originalUrl, 302);
    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}