# SummaryDojo - AI Document Search Engine

SummaryDojo is an AI-powered document search engine that allows users to upload PDFs, extract text, generate summaries, and perform semantic search across their documents.

## Features

- **Document Upload**: Upload PDF documents securely to AWS S3
- **AI Analysis**: Extract text, generate summaries, and identify key insights
- **Semantic Search**: Search documents based on meaning, not just keywords
- **User Authentication**: Secure user authentication with Clerk
- **Responsive UI**: Modern and responsive user interface

## Tech Stack

- **Frontend**: Next.js (React)
- **Backend**: Next.js API Routes
- **AI/ML**: OpenRouter API for AI models + FAISS for vector search
- **Database**: MongoDB with Mongoose
- **Storage**: AWS S3
- **Authentication**: Clerk

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- AWS S3 bucket
- Clerk account
- OpenRouter API key

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/summarydojo.git
   cd summarydojo
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # MongoDB
   MONGODB_URI=your_mongodb_uri

   # AWS S3
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_aws_bucket_name

   # OpenRouter API
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_API_URL=https://openrouter.ai/api/v1
   ```

4. Run the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js app router pages and API routes
- `src/components`: Reusable React components
- `src/lib/models`: MongoDB models
- `src/lib/services`: Service functions for S3, AI, and vector search
- `src/lib/utils`: Utility functions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Clerk](https://clerk.dev/)
- [OpenRouter](https://openrouter.ai/)
- [FAISS](https://github.com/facebookresearch/faiss)
