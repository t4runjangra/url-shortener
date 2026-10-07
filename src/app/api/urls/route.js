import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function generateShortCode() {
    return crypto.randomBytes(4).toString("base64url");
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { originalUrl } = body;

        if (!originalUrl) {
            return Response.json(
                { error: "originalUrl is required" },
                { status: 400 }
            );
        }
        let parsedUrl;

        try {
            parsedUrl = new URL(originalUrl);
        } catch {
            return Response.json(
                { error: "Invalid URL" },
                { status: 400 }
            );
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return Response.json(
                { error: "Only HTTP and HTTPS URLs are allowed" },
                { status: 400 }
            );
        }
        let url;

        for (let attempt = 0; attempt < 5; attempt++) {
            const shortCode = generateShortCode();

            try {
                url = await prisma.url.create({
                    data: {
                        originalUrl,
                        shortCode,
                    },
                });

                break;
            } catch (error) {
                if (error.code !== "P2002") {
                    throw error;
                }
            }
        }

        if (!url) {
            return Response.json(
                { error: "Could not generate a unique short code" },
                { status: 500 }
            );
        }
        return Response.json(
            {
                id: url.id,
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl: `http://localhost:3000/${url.shortCode}`,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}