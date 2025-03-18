import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/utils/db";
import Document from "@/lib/models/Document";
import { getSignedDownloadUrl } from "@/lib/services/s3Service";

// GET /api/documents/download - Get a signed download URL for a document
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get document ID from the URL query params
    const url = new URL(req.url);
    const documentId = url.searchParams.get("id");

    // Check if we should redirect directly instead of returning JSON
    const direct = url.searchParams.get("direct") === "true";

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the document and verify ownership
    const document = await Document.findOne({ _id: documentId, userId });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Extract the key from the s3Url
    const s3Url = document.s3Url;
    const urlParts = s3Url.split("/");
    const key = urlParts.slice(3).join("/");

    // Generate a signed URL for download
    const signedUrl = await getSignedDownloadUrl(key);

    // If direct=true, redirect to the signed URL
    if (direct) {
      return NextResponse.redirect(signedUrl);
    }

    // Otherwise return the URL in JSON response
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL" },
      { status: 500 }
    );
  }
}
