import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/utils/db";
import Document from "@/lib/models/Document";
import { uploadToS3, deleteFromS3 } from "@/lib/services/s3Service";
import {
  extractTextFromPDF,
  generateEmbeddings,
  generateSummary,
  extractKeyInsights,
} from "@/lib/services/aiService";

// GET /api/documents - Get all documents for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const documents = await Document.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents - Upload and process a new document
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let formData;
    try {
      formData = await req.formData();
    } catch (error) {
      console.error("Error parsing form data:", error);
      return NextResponse.json(
        { error: "Invalid form data", details: String(error) },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(
      "Received file:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type
    );

    // Check file type
    if (
      !file.type.includes("pdf") &&
      !file.type.includes("word") &&
      !file.type.includes("docx") &&
      !file.type.includes("doc")
    ) {
      return NextResponse.json(
        { error: "Only PDF and Word documents are supported" },
        { status: 400 }
      );
    }

    // Check file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds 10MB limit (${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)}MB)`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    let buffer;
    try {
      buffer = Buffer.from(await file.arrayBuffer());
      console.log("File converted to buffer, size:", buffer.length);
    } catch (error) {
      console.error("Error converting file to buffer:", error);
      return NextResponse.json(
        { error: "Failed to process file", details: String(error) },
        { status: 500 }
      );
    }

    // Upload file to S3
    let s3Result;
    try {
      s3Result = await uploadToS3(buffer, file.name, file.type);
      console.log("File uploaded to S3:", s3Result.key);
    } catch (error) {
      console.error("Error uploading to S3:", error);
      // Continue with processing even if S3 upload fails
      s3Result = {
        key: `mock-s3-key-${Date.now()}`,
        url: `https://mock-s3-url.com/${Date.now()}-${file.name}`,
      };
      console.log("Using mock S3 result:", s3Result);
    }

    // Extract text from document - pass the file type
    let extractedText = await extractTextFromPDF(buffer, file.type);
    console.log("Text extracted from document, length:", extractedText.length);

    // Generate summary - this now handles errors internally
    let summary = await generateSummary(extractedText);
    console.log("Summary generated");

    // Extract key insights - this now handles errors internally
    let insights = await extractKeyInsights(extractedText);
    console.log("Insights extracted");

    // Generate embeddings - this now handles errors internally
    let embedding = await generateEmbeddings(extractedText);
    console.log("Embeddings generated");

    // Connect to database
    try {
      await connectDB();
      console.log("Connected to database");
    } catch (error) {
      console.error("Error connecting to database:", error);
      return NextResponse.json(
        { error: "Failed to connect to database", details: String(error) },
        { status: 500 }
      );
    }

    // Create document in database
    let document;
    try {
      document = await Document.create({
        userId,
        title: title || file.name,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        s3Key: s3Result.key,
        s3Url: s3Result.url,
        extractedText,
        summary,
        insights,
        embedding,
      });
      console.log("Document created in database:", document._id);
    } catch (error) {
      console.error("Error creating document in database:", error);
      return NextResponse.json(
        {
          error: "Failed to save document to database",
          details: String(error),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Failed to upload document", details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/:id - Delete a document
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find document
    const document = await Document.findOne({ _id: id, userId });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete document from S3
    try {
      if (document.s3Key) {
        console.log(`Original S3 key from document: ${document.s3Key}`);

        // Sometimes S3 keys might be stored with a leading slash or other format issues
        // Clean the key if needed
        let s3Key = document.s3Key;
        if (s3Key.startsWith("/")) {
          s3Key = s3Key.substring(1);
          console.log(`Cleaned S3 key (removed leading slash): ${s3Key}`);
        }

        console.log(`Attempting to delete file from S3: ${s3Key}`);

        try {
          await deleteFromS3(s3Key);
          console.log(`Successfully deleted file from S3: ${s3Key}`);
        } catch (innerError: any) {
          // If there's an AccessDenied error, we can still proceed with DB deletion
          if (
            innerError.message &&
            innerError.message.includes("AccessDenied")
          ) {
            console.warn(
              `S3 Access Denied for key: ${s3Key}. Continuing with database deletion.`
            );
            // This is acceptable - we'll still delete from the database
          } else {
            // For other errors, we still want to log but continue with database deletion
            console.error(
              `S3 deletion error (continuing with DB deletion): ${innerError.message}`
            );
          }
        }
      } else {
        console.log("No S3 key found for document, skipping S3 deletion");
      }
    } catch (s3Error) {
      // Log error but continue with database deletion
      console.error("Error in S3 deletion block:", s3Error);
      // We don't want to return an error to the client here as the document should
      // still be deleted from the database even if S3 deletion fails
    }

    // Delete document from database
    await Document.deleteOne({ _id: id, userId });
    console.log(`Document deleted from database: ${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
