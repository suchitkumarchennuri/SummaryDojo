import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucketName = process.env.AWS_BUCKET_NAME as string;

interface S3Error {
  name?: string;
  Code?: string;
  Message?: string;
  message?: string;
  $metadata?: {
    httpStatusCode?: number;
    requestId?: string;
    extendedRequestId?: string;
    cfId?: string;
    attempts?: number;
    totalRetryDelay?: number;
  };
}

export const uploadToS3 = async (
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<{ key: string; url: string }> => {
  const key = `uploads/${Date.now()}-${fileName}`;

  try {
    // Create a multipart upload
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
        // ACL parameter removed as it's not supported by the bucket
      },
    });

    // Execute the upload
    await upload.done();

    // Construct the URL
    const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      key: key,
      url: url,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  try {
    console.log(`S3 delete operation - Bucket: ${bucketName}, Key: ${key}`);
    console.log(
      `Using AWS credentials with AccessKey ID: ${process.env.AWS_ACCESS_KEY_ID?.substring(
        0,
        5
      )}...`
    );

    // Check if the key exists in S3 first
    const headCommand = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      await s3Client.send(headCommand);
      console.log(`Object exists in S3, proceeding with deletion: ${key}`);
    } catch (err) {
      // Type assertion for S3 errors which have name, Code properties
      const s3Error = err as S3Error;
      if (
        s3Error.name === "NotFound" ||
        s3Error.Code === "NotFound" ||
        s3Error.Code === "404"
      ) {
        console.warn(`Object does not exist in S3: ${key}`);
        // If object doesn't exist, no need to delete it
        return;
      } else if (
        s3Error.name === "AccessDenied" ||
        s3Error.Code === "AccessDenied" ||
        s3Error.Code === "403"
      ) {
        console.warn(`Access denied checking if object exists in S3: ${key}`);
        // Continue with deletion attempt, but it will likely fail again
      } else {
        console.warn(
          `Error checking if object exists in S3: ${
            typeof err === "object" && err !== null && "message" in err
              ? (err as { message: string }).message
              : String(err)
          }`
        );
        // Continue with deletion attempt
      }
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`Successfully deleted object from S3: ${key}`);
  } catch (error) {
    const s3Error = error as S3Error;
    console.error("Error deleting from S3:", s3Error);

    // Log more detailed error information
    if (s3Error.$metadata) {
      console.error("Error metadata:", JSON.stringify(s3Error.$metadata));
    }

    if (s3Error.Code) {
      console.error(
        `AWS Error Code: ${s3Error.Code}, Message: ${s3Error.Message}`
      );
    }

    throw new Error(
      `Failed to delete file from S3: ${s3Error.message || "Unknown error"}`
    );
  }
};

export const getSignedDownloadUrl = async (
  key: string,
  expiresIn = 3600
): Promise<string> => {
  try {
    console.log(
      `Generating signed URL for - Bucket: ${bucketName}, Key: ${key}`
    );

    // Extract filename from key
    const fileName = key.split("/").pop() || "download";

    // Create a command to get the object with content-disposition header
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    });

    // Generate the presigned URL
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn, // URL expires in 1 hour by default
    });

    console.log(`Successfully generated signed URL for: ${key}`);
    return signedUrl;
  } catch (error) {
    const s3Error = error as S3Error;
    console.error("Error generating signed URL:", s3Error);
    throw new Error("Could not generate download URL");
  }
};
