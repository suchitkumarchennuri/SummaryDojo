# Deploying to Netlify

This document provides instructions for deploying this Next.js application to Netlify.

## Prerequisites

- A Netlify account
- Git repository set up

## Deployment Steps

1. **Push your code to GitHub, GitLab, or Bitbucket**
   Make sure your code is in a repository that Netlify can access.

2. **Log into Netlify**
   Visit [netlify.com](https://netlify.com) and log in or sign up.

3. **Create a new site**
   Click "Add new site" > "Import an existing project".

4. **Connect to Git provider**
   Select your Git provider (GitHub, GitLab, or Bitbucket) and authorize Netlify.

5. **Select your repository**
   Find and select your project repository.

6. **Configure build settings**
   The build settings should be pre-configured by the netlify.toml file, but verify:

   - Build command: `npm run build`
   - Publish directory: `.next`

7. **Set up environment variables**
   Go to Site settings > Environment variables and add the following variables from your .env.local file:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   NEXT_PUBLIC_CLERK_SIGN_IN_URL
   NEXT_PUBLIC_CLERK_SIGN_UP_URL
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
   MONGODB_URI
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_REGION
   AWS_BUCKET_NAME
   OPENROUTER_API_KEY
   OPENROUTER_API_URL
   ```

8. **Deploy the site**
   Click "Deploy site" and wait for the build to complete.

## Post-Deployment

- Set up a custom domain if needed (Site settings > Domain management)
- Configure SSL/TLS encryption (usually automatic)
- Check deployment status and logs if there are any issues

## Troubleshooting

If you encounter build errors:

1. Check the build logs in Netlify
2. Ensure all environment variables are set correctly
3. Make sure the Netlify Next.js plugin is installed
4. Verify your Next.js version is compatible with the plugin

For further assistance, refer to [Netlify's Next.js documentation](https://docs.netlify.com/integrations/frameworks/next-js/).
