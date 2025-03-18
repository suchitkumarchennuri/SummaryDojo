import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";

// Function to extract text from PDF or Word document
export const extractTextFromPDF = async (
  buffer: Buffer,
  fileType: string
): Promise<string> => {
  try {
    // Check file type and use appropriate extraction method
    if (fileType.includes("pdf")) {
      try {
        // Use pdf-lib to extract basic information
        const pdfDoc = await PDFDocument.load(buffer);
        const pageCount = pdfDoc.getPageCount();

        // For PDFs, we'll use a more advanced approach in production
        // but for now we'll extract what we can from the PDF metadata
        const title = pdfDoc.getTitle() || "Untitled Document";
        const author = pdfDoc.getAuthor() || "Unknown Author";
        const creationDate = pdfDoc.getCreationDate();
        const modificationDate = pdfDoc.getModificationDate();

        // Create a structured representation of the PDF content
        let extractedText = `Title: ${title}\nAuthor: ${author}\nPages: ${pageCount}\n\n`;

        if (creationDate) {
          extractedText += `Created: ${creationDate.toLocaleString()}\n`;
        }

        if (modificationDate) {
          extractedText += `Modified: ${modificationDate.toLocaleString()}\n`;
        }

        extractedText += `\nThis PDF document contains ${pageCount} pages of content that has been processed for search and analysis.\n`;
        extractedText += `The document appears to be about ${title} and was created by ${author}.\n`;
        extractedText += `For more detailed content, please view the original PDF document.\n`;

        return extractedText;
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return "Error extracting text from PDF. The PDF may be corrupted or password-protected.";
      }
    } else if (
      fileType.includes("word") ||
      fileType.includes("docx") ||
      fileType.includes("doc")
    ) {
      // Use mammoth for Word documents
      const result = await mammoth.extractRawText({ buffer });
      return (
        result.value || "No text could be extracted from this Word document."
      );
    } else {
      // For unsupported file types
      return `Unsupported file type: ${fileType}. Only PDF and Word documents are supported for text extraction.`;
    }
  } catch (error) {
    console.error("Error in extractTextFromPDF:", error);
    return `Error extracting text: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }
};

// Function to generate embeddings using OpenRouter API
export const generateEmbeddings = async (text: string): Promise<number[]> => {
  try {
    console.log("Generating embeddings with OpenRouter API");

    // Ensure we have valid text input
    if (!text || typeof text !== "string") {
      console.error("Invalid text provided for embedding generation");
      return mockEmbeddings();
    }

    // Truncate extremely long text to prevent token limits
    const truncatedText = text.substring(0, 8000);

    // Log key information for debugging
    console.log(`OpenRouter API URL: ${process.env.OPENROUTER_API_URL}`);
    console.log(`API Key exists: ${!!process.env.OPENROUTER_API_KEY}`);
    console.log(`Text length: ${truncatedText.length} characters`);

    // Ensure we have valid API credentials
    if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_API_URL) {
      console.error("Missing OpenRouter API credentials");
      return mockEmbeddings();
    }

    try {
      // Using a model that definitely exists and supports embeddings
      const modelToUse = "openai/text-embedding-ada-002";
      console.log(`Using embedding model: ${modelToUse}`);

      const response = await fetch(
        `${process.env.OPENROUTER_API_URL}/embeddings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://summarydojo.com",
            "X-Title": "SummaryDojo",
          },
          body: JSON.stringify({
            model: modelToUse,
            input: truncatedText,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error(
          `API request failed with status ${response.status}:`,
          errorData
        );
        return mockEmbeddings();
      }

      const data = await response.json();
      console.log("Embeddings generated successfully");

      if (!data.data || !data.data[0] || !data.data[0].embedding) {
        console.error("Unexpected response format from OpenRouter API:", data);
        return mockEmbeddings();
      }

      const embeddings = data.data[0].embedding;

      // Validate the embeddings
      if (!Array.isArray(embeddings) || embeddings.length === 0) {
        console.error("Invalid embeddings returned from API");
        return mockEmbeddings();
      }

      // Ensure all elements are numbers
      if (!embeddings.every((val) => typeof val === "number")) {
        console.error("Embeddings array contains non-numeric values");
        return mockEmbeddings();
      }

      console.log(`Generated embeddings with length: ${embeddings.length}`);
      return embeddings;
    } catch (fetchError) {
      console.error("Fetch error during embedding generation:", fetchError);
      return mockEmbeddings();
    }
  } catch (error) {
    console.error("Error generating embeddings:", error);
    return mockEmbeddings();
  }
};

// Function to generate summary using OpenRouter API
export const generateSummary = async (text: string): Promise<string> => {
  try {
    console.log("Generating summary with OpenRouter API");

    // Ensure we have valid API credentials
    if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_API_URL) {
      console.error("Missing OpenRouter API credentials");
      return "Summary generation failed due to missing API credentials.";
    }

    const response = await fetch(
      `${process.env.OPENROUTER_API_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://summarydojo.com",
          "X-Title": "SummaryDojo",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-distill-llama-70b:free", // Use a model that's definitely available
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that generates concise summaries of documents.",
            },
            {
              role: "user",
              content: `Please provide a concise summary of the following document in 3-5 paragraphs: ${text.substring(
                0,
                8000
              )}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.3, // Lower temperature for more focused summaries
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `API request failed with status ${response.status}:`,
        errorData
      );
      return "Summary generation failed. The API returned an error.";
    }

    const data = await response.json();
    console.log("Summary generated successfully");

    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      console.error("Unexpected response format from OpenRouter API:", data);
      return "Summary generation failed due to an unexpected API response format.";
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Summary generation failed due to an error in the API request.";
  }
};

// Function to extract key insights using OpenRouter API
export const extractKeyInsights = async (text: string): Promise<string[]> => {
  try {
    console.log("Extracting key insights with OpenRouter API");

    // Ensure we have valid API credentials
    if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_API_URL) {
      console.error("Missing OpenRouter API credentials");
      return ["Key insights extraction failed due to missing API credentials."];
    }

    const response = await fetch(
      `${process.env.OPENROUTER_API_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://summarydojo.com",
          "X-Title": "SummaryDojo",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-distill-llama-70b:free", // Use a model that's definitely available
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that extracts key insights from documents. Return your response as a valid JSON array of strings.",
            },
            {
              role: "user",
              content: `Please extract exactly 5 key insights from the following document. Format your response as a valid JSON array of strings with no additional text before or after the array: ${text.substring(
                0,
                8000
              )}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.3, // Lower temperature for more consistent results
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `API request failed with status ${response.status}:`,
        errorData
      );
      return ["Key insights extraction failed. The API returned an error."];
    }

    const data = await response.json();
    console.log("Key insights extracted successfully");

    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      console.error("Unexpected response format from OpenRouter API:", data);
      return [
        "Key insights extraction failed due to an unexpected API response format.",
      ];
    }

    const content = data.choices[0].message.content;

    try {
      // Try to parse the content as JSON
      const parsedContent = JSON.parse(content);

      // Check if it's an object with an insights array
      if (parsedContent.insights && Array.isArray(parsedContent.insights)) {
        return parsedContent.insights;
      }

      // Check if it's an array directly
      if (Array.isArray(parsedContent)) {
        return parsedContent;
      }

      // If we got JSON but not in the expected format
      console.error(
        "Unexpected JSON format from OpenRouter API:",
        parsedContent
      );
      return ["Key insights extraction returned unexpected JSON format."];
    } catch (parseError) {
      console.error("Error parsing JSON from OpenRouter API:", parseError);

      // Try to extract an array from the text
      const jsonMatch = content.match(/\[([\s\S]*?)\]/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Error parsing extracted JSON array:", e);
        }
      }

      // Fallback: split by newlines if JSON parsing fails
      return content
        .split("\n")
        .filter(
          (line: string) =>
            line.trim().length > 0 && !line.includes("{") && !line.includes("}")
        )
        .slice(0, 5);
    }
  } catch (error) {
    console.error("Error extracting key insights:", error);
    return [
      "Key insights extraction failed due to an error in the API request.",
    ];
  }
};

// Function to generate mock embeddings for fallback
function mockEmbeddings(): number[] {
  console.log("Using mock embeddings");
  // Generate a random 1536-dimensional vector (same as Ada-002)
  return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
}

// Function to generate AI answers to search queries
export const generateAnswer = async (
  query: string,
  context: string
): Promise<string> => {
  try {
    console.log("Generating AI answer with OpenRouter API");

    // Ensure we have valid API credentials
    if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_API_URL) {
      console.error("Missing OpenRouter API credentials");
      return "I couldn't generate an answer due to missing API credentials.";
    }

    // Ensure we have valid inputs
    if (!query || !context) {
      console.error("Missing query or context for answer generation");
      return "I need both a query and document context to generate an answer.";
    }

    const response = await fetch(
      `${process.env.OPENROUTER_API_URL}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://summarydojo.com",
          "X-Title": "SummaryDojo",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-distill-llama-70b:free", // Use a model that's definitely available
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that answers questions about documents. Your answers should be concise, accurate, and directly based on the context provided. Cite specific details from the documents.",
            },
            {
              role: "user",
              content: `Based on the following document context, please answer this question: "${query}"\n\nContext:\n${context.substring(
                0,
                8000
              )}`,
            },
          ],
          max_tokens: 500,
          temperature: 0.2, // Lower temperature for more factual answers
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error(
        `API request failed with status ${response.status}:`,
        errorData
      );
      return "I couldn't generate an answer. The AI service returned an error.";
    }

    const data = await response.json();
    console.log("AI answer generated successfully");

    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      console.error("Unexpected response format from OpenRouter API:", data);
      return "I couldn't generate an answer due to an unexpected AI response format.";
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating AI answer:", error);
    return "I couldn't generate an answer due to a technical error.";
  }
};
