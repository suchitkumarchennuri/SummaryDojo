import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/utils/db";
import Document from "@/lib/models/Document";
// Import the generateEmbeddings function directly, bypassing the vector search service
import { generateEmbeddings, generateAnswer } from "@/lib/services/aiService";

// POST /api/search - Search documents
export async function POST(req: NextRequest) {
  try {
    console.log("Search API request received");

    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      console.log("Unauthorized search request - no userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let queryText;
    try {
      const body = await req.json();
      queryText = body.query;
      console.log(`Search query: "${queryText}"`);
    } catch (jsonError) {
      console.error("Error parsing request body:", jsonError);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (!queryText) {
      console.log("Empty search query");
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    await connectDB();
    console.log("Database connected");

    // Get all documents for the user
    const documents = await Document.find({ userId });
    console.log(`Found ${documents.length} documents for user`);

    if (documents.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Implement hybrid search (keyword + AI-powered semantic)
    console.log("Using hybrid search (keyword + semantic)");

    try {
      // STEP 1: Keyword matching
      console.log("Performing keyword matching...");

      // Convert query to lowercase for case-insensitive matching
      const queryLower = queryText.toLowerCase();
      const queryWords: string[] = queryLower
        .split(/\s+/)
        .filter((word: string) => word.length > 2);

      // Score documents based on keyword matches in title, content, and summary
      const keywordScoredDocuments = documents.map((doc) => {
        // Initialize score
        let score = 0;

        // Check title
        const title = (doc.title || "").toLowerCase();
        if (title.includes(queryLower)) score += 0.5;

        // Check content
        const content = (doc.extractedText || "").toLowerCase();
        if (content.includes(queryLower)) score += 0.3;

        // Check summary
        const summary = (doc.summary || "").toLowerCase();
        if (summary.includes(queryLower)) score += 0.2;

        // Individual word matching
        for (const word of queryWords) {
          if (title.includes(word)) score += 0.1;
          if (content.includes(word)) score += 0.05;
          if (summary.includes(word)) score += 0.05;
        }

        return { document: doc, score };
      });

      // STEP 2: Try semantic search if embeddings are available (with error handling)
      console.log("Attempting semantic search...");

      let semanticScores: Record<string, number> = {};

      try {
        // Generate embedding for the query
        const queryEmbedding = await generateEmbeddings(queryText);

        // Only perform semantic search if we got a valid embedding
        if (
          queryEmbedding &&
          Array.isArray(queryEmbedding) &&
          queryEmbedding.length > 0
        ) {
          console.log("Query embedding generated successfully");

          // Find docs that have embeddings and calculate cosine similarity
          for (const doc of documents) {
            if (
              doc.embedding &&
              Array.isArray(doc.embedding) &&
              doc.embedding.length > 0
            ) {
              // Simple cosine similarity calculation
              const similarity = calculateCosineSimilarity(
                queryEmbedding,
                doc.embedding
              );

              // Store the similarity score
              semanticScores[doc._id.toString()] = similarity;
            }
          }

          console.log(
            `Semantic scores calculated for ${
              Object.keys(semanticScores).length
            } documents`
          );
        } else {
          console.log(
            "Could not generate valid query embedding for semantic search"
          );
        }
      } catch (embeddingError) {
        console.error("Error during semantic search:", embeddingError);
        console.log("Continuing with keyword search only");
      }

      // STEP 3: Combine keyword and semantic scores for hybrid ranking
      console.log("Combining keyword and semantic scores...");

      const hybridScoredDocuments = keywordScoredDocuments.map((item) => {
        const docId = item.document._id.toString();
        const semanticScore = semanticScores[docId] || 0;

        // Weighted combination of scores (adjust weights as needed)
        const keywordWeight = 0.6;
        const semanticWeight = 0.4;

        const hybridScore =
          item.score * keywordWeight + semanticScore * semanticWeight;

        return {
          document: item.document,
          score: hybridScore,
          highlights: findHighlights(item.document, queryText, queryWords),
        };
      });

      // Sort by combined score (descending) and take top results
      const results = hybridScoredDocuments
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      console.log(`Found ${results.length} documents with hybrid search`);

      // If no good matches found, return top documents
      if (results.every((r) => r.score === 0)) {
        console.log("No good matches, returning recent documents");
        // Sort by most recent
        const topDocs = documents
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5)
          .map((doc) => ({
            document: doc,
            score: 0,
            highlights: [],
          }));

        return formatAndReturnResults(
          topDocs,
          "No matches found. Showing recent documents."
        );
      }

      // STEP 4: Generate AI-powered answer to the query using content from top results
      console.log("Generating AI-powered answer to the query...");

      // Extract content from top results to use as context for the AI
      let context = "";

      // Use top 3 documents as context
      const topDocuments = results.slice(0, 3);

      for (const result of topDocuments) {
        const doc = result.document;
        context += `Title: ${doc.title || "Untitled"}\n`;
        context += `Summary: ${doc.summary || ""}\n`;
        context += `Content: ${(doc.extractedText || "").substring(
          0,
          1000
        )}\n\n`;
      }

      // Generate AI-powered answer if we have context and it's a question
      let aiAnswer = null;
      const isQuestion =
        queryText.trim().endsWith("?") ||
        queryLower.startsWith("what") ||
        queryLower.startsWith("how") ||
        queryLower.startsWith("why") ||
        queryLower.startsWith("when") ||
        queryLower.startsWith("where") ||
        queryLower.startsWith("which") ||
        queryLower.startsWith("who") ||
        queryLower.startsWith("can") ||
        queryLower.startsWith("does") ||
        queryLower.startsWith("is") ||
        queryLower.startsWith("are") ||
        queryLower.startsWith("find") ||
        queryLower.startsWith("explain") ||
        queryLower.startsWith("describe");

      if (context && isQuestion) {
        try {
          aiAnswer = await generateAnswer(queryText, context);
          console.log("AI answer generated successfully");
        } catch (error) {
          console.error("Failed to generate AI answer:", error);
          aiAnswer = null;
        }
      }

      return formatAndReturnResults(results, undefined, aiAnswer);
    } catch (searchError) {
      console.error("Error in search:", searchError);

      // Return the most recent documents as a fallback
      console.log("Falling back to returning recent documents");
      const recentDocs = documents
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((doc) => ({
          document: doc,
          score: 0,
          highlights: [],
        }));

      return formatAndReturnResults(
        recentDocs,
        "Search error. Showing recent documents."
      );
    }
  } catch (error) {
    console.error("Error searching documents:", error);
    return NextResponse.json(
      {
        error: "Failed to search documents",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Calculate cosine similarity between two vectors
function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  try {
    if (vec1.length !== vec2.length) {
      console.error(
        `Vector dimensions don't match: ${vec1.length} vs ${vec2.length}`
      );
      return 0;
    }

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }

    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);

    if (mag1 === 0 || mag2 === 0) return 0;

    return dotProduct / (mag1 * mag2);
  } catch (error) {
    console.error("Error calculating cosine similarity:", error);
    return 0;
  }
}

// Find and extract text highlights containing the query or query words
function findHighlights(
  doc: any,
  query: string,
  queryWords: string[]
): string[] {
  try {
    const text = doc.extractedText || "";
    if (!text) return [];

    const highlights: string[] = [];
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();

    // Find matches of the full query
    let startIndex = textLower.indexOf(queryLower);
    while (startIndex !== -1 && highlights.length < 3) {
      // Extract a window of text around the match
      const start = Math.max(0, startIndex - 50);
      const end = Math.min(text.length, startIndex + query.length + 50);
      const highlight = text.substring(start, end);

      // Add ellipses if needed
      const formattedHighlight =
        (start > 0 ? "..." : "") + highlight + (end < text.length ? "..." : "");

      highlights.push(formattedHighlight);

      // Find next occurrence
      startIndex = textLower.indexOf(queryLower, startIndex + 1);
    }

    // If we didn't find enough full query matches, look for individual words
    if (highlights.length < 3) {
      // Create a set to avoid duplicate highlight regions
      const highlightedRegions = new Set(highlights);

      for (const word of queryWords) {
        if (word.length < 4) continue; // Skip short words

        let wordIndex = textLower.indexOf(word);
        while (wordIndex !== -1 && highlightedRegions.size < 3) {
          const start = Math.max(0, wordIndex - 40);
          const end = Math.min(text.length, wordIndex + word.length + 40);
          const highlight = text.substring(start, end);

          const formattedHighlight =
            (start > 0 ? "..." : "") +
            highlight +
            (end < text.length ? "..." : "");

          if (!highlightedRegions.has(formattedHighlight)) {
            highlightedRegions.add(formattedHighlight);
            highlights.push(formattedHighlight);
          }

          wordIndex = textLower.indexOf(word, wordIndex + 1);
        }

        if (highlights.length >= 3) break;
      }
    }

    return highlights;
  } catch (error) {
    console.error("Error finding highlights:", error);
    return [];
  }
}

// Helper function to format results consistently
function formatAndReturnResults(
  results: Array<{ document: any; score: number; highlights: string[] }>,
  warning?: string,
  aiAnswer?: string | null
) {
  // Format results
  const formattedResults = results.map(({ document, score, highlights }) => {
    // Extract a snippet from the document text
    const snippetLength = 200;
    let snippet = document.extractedText
      ? document.extractedText.substring(0, snippetLength)
      : "";
    if (
      document.extractedText &&
      document.extractedText.length > snippetLength
    ) {
      snippet += "...";
    }

    return {
      id: document._id,
      title: document.title || "Untitled",
      fileName: document.fileName || "Unknown file",
      snippet: snippet || "No content preview available",
      summary: document.summary || "No summary available",
      score: score, // Use the actual score
      url: document.s3Url,
      highlights: highlights || [],
    };
  });

  // Return with optional warning and AI answer
  const response: any = { results: formattedResults };

  if (warning) {
    response.warning = warning;
  }

  if (aiAnswer) {
    response.aiAnswer = aiAnswer;
  }

  return NextResponse.json(response);
}
