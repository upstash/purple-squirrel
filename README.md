# purple squirrel
purple squirrel is an AI powered open-source Applicant Tracking System (ATS)

## Overview
- [🐿️ Deploy your own](#deploy-your-own)
- [🥞 Stack](#stack)
- [🔍 Features](#features)
- [🖥️ Contribution Guide](#contribution-guide)

## Deploy your own
<details>
  <summary>Step 1: Deploying with Vercel</summary>

  1. Click the button below.
  2. Connect your GitHub account & create a Git repository as described.
  3. Fill the environment variables as described in the next steps.
</details>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fupstash%2Fpurple-squirrel&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,UPSTASH_VECTOR_REST_URL,UPSTASH_VECTOR_REST_TOKEN,QSTASH_URL,QSTASH_TOKEN,IMAP_USERNAME,IMAP_PASSWORD,IMAP_HOST,IMAP_PORT,UPLOADTHING_SECRET,UPLOADTHING_APP_ID,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_CLERK_SIGN_IN_URL,NEXT_PUBLIC_CLERK_SIGN_UP_URL,OPENAI_API_KEY,BASIC_AUTH_PASSWORD,NEXT_PUBLIC_URL)

<details>
  <summary>Step 2: Connect your mailbox</summary>

  **Note:** This tutorial will be based on Gmail, but you can set up an IMAP connection with any other provider.
  1. Complete the following steps described in [this tutorial](https://support.google.com/a/answer/9003945#imap_gmail&zippy=%2Cstep-turn-on-imap-in-gmail%2Cstep-create-and-use-app-passwords%2Cstep-turn-on-less-secure-apps).
     * Turn on Less secure apps.
     * Create and use App Passwords.
     * Turn on IMAP in Gmail.
  2. Fill the following environment variables in Vercel:
     * IMAP_USERNAME: Your mail address
     * IMAP_PASSWORD: App Password you generated
     * IMAP_HOST: imap.gmail.com
     * IMAP_PORT: 993
</details>

<details>
  <summary>Step 3: Set up Upstash</summary>

  1. Open an Upstash account.
  2. Switch to [Redis tab in Console](https://console.upstash.com/redis).
  3. Click Create database.
  4. Think of a name and select a primary region close to your users.<br/>
     <img width="511" alt="create-redis-database" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/3dea59e2-a910-4bbb-84c0-19007cb2bbf9">

  5. Click Next -> Click Create.
  6. Fill the following environment variables in Vercel, which can be found and copied in your database page:
     * UPSTASH_REDIS_REST_URL
     * UPSTASH_REDIS_REST_TOKEN<br/><br/>
     <img width="431" alt="redis-tokens" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/b78d08e4-c812-4c7c-873d-93cdcc274ce2">
  7. Switch to [Vector tab in Console](https://console.upstash.com/vector).
  8. Click Create Index.
  9. Think of a name and select a region close to your users, Embedding Model, Dimensions and Metric should be set like below.<br/>
      <img width="548" alt="Screenshot 2024-06-11 at 16 38 03" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/56cfedf3-969a-4c03-a7fd-49e96d026922">
  10. Click Next -> Click Create.
  11. Fill the following environment variables in Vercel, which can be found and copied in your index page:
      * UPSTASH_VECTOR_REST_URL: Your endpoint
      * UPSTASH_VECTOR_REST_TOKEN<br/><br/>
      <img width="971" alt="Screenshot 2024-06-11 at 16 40 48" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/780e6354-421f-467e-a2e3-e107133ab0d3">
  12. Switch to [QStash tab in Console](https://console.upstash.com/qstash)
  13. Fill the following environment variables in Vercel, which can be found and copied in your QStash page:
      * QSTASH_URL
      * QSTASH_TOKEN<br/><br/>
        <img width="367" alt="qstash-tokens" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/8811172b-113f-4505-bacc-cba8365e6763">

</details>

<details>
  <summary>Step 4: Set up uploadthing</summary>

  1. Sign in to uploadthing.
  2. Click Create a new app.
  3. Think of a name and select an app default region close to your users.<br/>
     <img width="376" alt="uploadthing-create" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/5d297e6d-0db5-4a4d-8588-4d383831e9ed">

  4. Fill the following environment variables in Vercel, which can be found and copied in the API Keys tab:
     * UPLOADTHING_SECRET
     * UPLOADTHING_APP_ID<br/><br/>
     <img width="1246" alt="uploadthing-keys" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/24c585e9-367b-43cf-910b-973e3c2495fd">

</details>

<details>
  <summary>Step 5: Set OpenAI API key</summary>

  1. Go to [OpenAI Platform -> API keys](https://platform.openai.com/api-keys) and login to your account.
  2. Click Create new secret key.
  3. Enter a name and click Create secret key.<br/>
     <img width="506" alt="openai-key" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/e41693b9-e95e-4fd6-8971-f94acc78fbd6">
  4. Don't forget to copy and save your key. Fill the following environment variable in Vercel:
     * OPENAI_API_KEY
</details>

<details>
  <summary>Step 6: Set up Clerk</summary>

  1. Sign in to Clerk and create an application.
  2. Select a project name and your preferred sign in options.
  3. Fill the following environment variables in Vercel, which can be found and copied in the API keys tab:
     * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
     * CLERK_SECRET_KEY
     * NEXT_PUBLIC_CLERK_SIGN_IN_URL: /sign-in
     * NEXT_PUBLIC_CLERK_SIGN_UP_URL: /sign-up
       <img width="1078" alt="clerk-keys" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/df42e8b9-cb10-4ba9-ad16-559505a95048"><br/>
**Now we will create ourselves user and make it admin. We will only need to do this once as Recruiter and Admin roles can easily be given in Admin Dashboard inside our application.**
  1. Switch to Users tab.
  2. Click Create user.
  3. Set up an email and a password, click Create.<br/>
  <img width="427" alt="clerk-user-create" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/a736a04e-db30-4826-88e7-c3a8ed350798">

  4. Click on the created user to go its page.
  5. Scroll down to see Metadata section, Edit **public** metadata.<br/>
  <img width="777" alt="clerk-before" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/ea8576f2-67a4-4c8d-90be-d2f42a1fdc70">

  6. Give admin role as shown below, click Save.<br/>
  ```json
{
	"role": "admin"
}
  ```
  <img width="653" alt="clerk-json" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/27dedf74-fb4a-4643-94cd-613f583b7cc3">

  7. You should see something like this:<br/>
  <img width="878" alt="clerk-after" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/72d66115-0998-4829-973a-6d4fecce4f0c">
  
  8. Finally, switch to Sessions tab and edit session token.<br/>
  <img width="1051" alt="clerk-session-before" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/13b6d611-26d3-4872-9321-27f7bc911bbb">

  9. Set it as shown below:<br/>
  ```json
{
	"metadata": "{{user.public_metadata}}"
}
  ```
  <img width="944" alt="clerk-session-after" src="https://github.com/yunusemreozdemir/purple-squirrel/assets/47982397/1410bb54-14fd-4716-900c-5eed663594aa">



     
</details>

<details>
  <summary>Step 7: Set URL and Basic Auth Password</summary>

  1. Fill the following environment variables in Vercel:
     * NEXT_PUBLIC_URL: URL of your application (e.g. purple-squirrel.vercel.app)
     * BASIC_AUTH_PASSWORD: Any password of your choice, to protect scheduled routes
</details>

→ Step 8: Click deploy & visit your site, it will guide you through the rest of your setup!

## Stack
- DB: [Upstash Redis](https://upstash.com)
- VectorDB: [Upstash Vector](https://upstash.com)
- Scheduling & Serverless Function Orchestration: [Upstash QStash](https://upstash.com)
- App logic: [Next.js](https://nextjs.org)
- Deployment: [Vercel](https://vercel.com)
- Auth: [Clerk](https://clerk.com)
- File Storage: [uploadthing](https://uploadthing.com)
- LLM & Embedding Models: [OpenAI](https://openai.com)
- UI Components: [NextUI](https://nextui.org)

## Features

## Contribution Guide

