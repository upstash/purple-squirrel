<p align="center" size="20" style="font-size:1.5em;">AI Powered Open-Source Applicant Tracking System and Search Engine</p>
<div align="center"><a style="font-size:1.5em;" href="https://purple-squirrel.vercel.app">Live Demo</a> &bull; <a style="font-size:1.5em;" href="https://upstash.com/blog/greatest-complement-to-serverless">Blog Post</a></div>

## Overview
- [🔍 Key Features](#key-features)
- [🥞 Tech Stack](#tech-stack)
- [🐿️ Deploy your own](#deploy-your-own)
- [💻 Local development](#local-development)
- [➕ Contributing](#contributing)

## Key Features
<details>
  <summary>Live Demo</summary>

  Check out the live demo [here](https://purple-squirrel.vercel.app).

</details>
<details>
  <summary>Natural Language Queries</summary>

  
</details>
<details>
  <summary>Complex Filtering</summary>

  Filter applicants based on location, application status, years of experience or given stars.
</details>
<details>
  <summary>Alternative Scoring Systems</summary>

  Choose among different scoring systems to rank applicants:
  - Flash Mode: Fast, cheap semantic search with filtering.
  - Deep Mode: LLM assisted scoring of top applicants.
</details>
<details>
  <summary>Applicant Tracking System</summary>


  **Status** <br/>
  Track the application status of candidates.

  **Notes** <br/>
  Take notes on candidates to keep track of your thoughts.

  **Star Ratings** <br/>
  Rate candidates with stars to easily filter them later.

  **Resumes** <br/>
  Easily view resumes of candidates via [uploadthing](https://uploadthing.com).

  **Socials** <br/>
  Reach out to candidates via their email or social media profiles.
</details>
<details>
  <summary>Role Based Authentication</summary>

  Protect your app with role based authentication via [Clerk](https://clerk.com).
  - Recruiter: Manage applicants.
  - Admin: Manage positions, application methods and users.
</details>
<details>
  <summary>Admin Dashboard</summary>
  
  **Manage Positions** <br/>
  Open, close or delete positions. Share application links with candidates.

  **Manage Application Methods** <br/>
  Enable or disable applications via email or through the app.
  

  **Manage Users** <br/>
  Change roles of users or delete them.

</details>

## Tech Stack
- DB: [Upstash Redis](https://upstash.com)
- VectorDB: [Upstash Vector](https://upstash.com)
- Scheduling & Serverless Function Orchestration: [Upstash QStash](https://upstash.com)
- App logic: [Next.js](https://nextjs.org)
- Deployment: [Vercel](https://vercel.com)
- Auth: [Clerk](https://clerk.com)
- File Storage: [uploadthing](https://uploadthing.com)
- LLM & Embedding Models: [OpenAI](https://openai.com)
- UI Components: [NextUI](https://nextui.org)

## Deploy your own
<details>
  <summary>Step 1: Deploying with Vercel</summary>

  1. Click the button below.
  2. Connect your GitHub account & create a Git repository as described.
  3. Fill the environment variables as described in the next steps.
</details>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fupstash%2Fpurple-squirrel&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN,UPSTASH_VECTOR_REST_URL,UPSTASH_VECTOR_REST_TOKEN,QSTASH_URL,QSTASH_TOKEN,QSTASH_CURRENT_SIGNING_KEY,QSTASH_NEXT_SIGNING_KEY,IMAP_USERNAME,IMAP_PASSWORD,IMAP_HOST,IMAP_PORT,UPLOADTHING_SECRET,UPLOADTHING_APP_ID,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY,NEXT_PUBLIC_CLERK_SIGN_IN_URL,NEXT_PUBLIC_CLERK_SIGN_UP_URL,OPENAI_API_KEY,NEXT_PUBLIC_URL)

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
     <img width="511" alt="create-redis-database" src="https://github.com/upstash/purple-squirrel/assets/47982397/9a8fe2f5-045f-4037-828f-c2ac8e5f6afd">


  5. Click Next -> Click Create.
  6. Fill the following environment variables in Vercel, which can be found and copied in your database page:
     * UPSTASH_REDIS_REST_URL
     * UPSTASH_REDIS_REST_TOKEN<br/><br/>
     <img width="431" alt="redis-tokens" src="https://github.com/upstash/purple-squirrel/assets/47982397/e71410a7-20ae-4fd7-b5ec-66cf52af0820">

  7. Switch to [Vector tab in Console](https://console.upstash.com/vector).
  8. Click Create Index.
  9. Think of a name and select a region close to your users, Embedding Model, Dimensions and Metric should be set like below.<br/>
      <img width="548" alt="create-index" src="https://github.com/upstash/purple-squirrel/assets/47982397/68bb794b-9f35-4fdf-b9f9-73bbdd97e9b8">

  10. Click Next -> Click Create.
  11. Fill the following environment variables in Vercel, which can be found and copied in your index page:
      * UPSTASH_VECTOR_REST_URL: Your endpoint
      * UPSTASH_VECTOR_REST_TOKEN<br/><br/>
      <img width="971" alt="vector-token" src="https://github.com/upstash/purple-squirrel/assets/47982397/f657dfe7-60ea-4611-91ed-0eafab83aaad">

  12. Switch to [QStash tab in Console](https://console.upstash.com/qstash)
  13. Fill the following environment variables in Vercel, which can be found and copied in your QStash page:
      * QSTASH_URL
      * QSTASH_TOKEN
      * QSTASH_CURRENT_SIGNING_KEY
      * QSTASH_NEXT_SIGNING_KEY<br/><br/>
        <img width="367" alt="qstash-tokens" src="https://github.com/upstash/purple-squirrel/assets/47982397/a532fc41-1391-47a0-a427-95494d73ef95">
  > QStash free plan has a limit of 500 messages per day. This will limit your mail pipeline to approximately 200 applicants per day. We recommend upgrading to the pay as you go plan. See [QStash Pricing](https://upstash.com/pricing/qstash) for more information.


</details>

<details>
  <summary>Step 4: Set up uploadthing</summary>

  1. Sign in to uploadthing.
  2. Click Create a new app.
  3. Think of a name and select an app default region close to your users.<br/>
     <img width="376" alt="uploadthing-create" src="https://github.com/upstash/purple-squirrel/assets/47982397/5e459d12-05e9-4c02-9ab4-8c53b646f34c">


  4. Fill the following environment variables in Vercel, which can be found and copied in the API Keys tab:
     * UPLOADTHING_SECRET
     * UPLOADTHING_APP_ID<br/><br/>
     <img width="1246" alt="uploadthing-keys" src="https://github.com/upstash/purple-squirrel/assets/47982397/c729d55e-df70-47d8-a9da-12efadcbfc1c">


</details>

<details>
  <summary>Step 5: Set OpenAI API key</summary>

  1. Go to [OpenAI Platform -> API keys](https://platform.openai.com/api-keys) and login to your account.
  2. Click Create new secret key.
  3. Enter a name and click Create secret key.<br/>
     <img width="506" alt="openai-key" src="https://github.com/upstash/purple-squirrel/assets/47982397/59e53965-2edf-4bad-9c3f-143ad148c437">

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
       <img width="1078" alt="clerk-keys" src="https://github.com/upstash/purple-squirrel/assets/47982397/f0debba9-813c-4ca5-b181-67e9d4f53943">

**Now we will create ourselves user and make it admin. We will only need to do this once as Recruiter and Admin roles can easily be given in Admin Dashboard inside our application.**
  1. Switch to Users tab.
  2. Click Create user.
  3. Set up an email and a password, click Create.<br/>
  <img width="427" alt="clerk-user-create" src="https://github.com/upstash/purple-squirrel/assets/47982397/a1993c97-d210-4662-9081-d1b435753bd0">


  4. Click on the created user to go its page.
  5. Scroll down to see Metadata section, Edit **public** metadata.<br/>
  <img width="777" alt="clerk-before" src="https://github.com/upstash/purple-squirrel/assets/47982397/3733160f-9e9a-4da6-a7e5-96df159dd3de">


  6. Give admin role as shown below, click Save.<br/>
  ```json
{
	"role": "admin"
}
  ```
  <img width="653" alt="clerk-json" src="https://github.com/upstash/purple-squirrel/assets/47982397/b10e8d36-6e5d-4a00-a144-b60f8c8a312c">


  7. You should see something like this:<br/>
  <img width="878" alt="clerk-after" src="https://github.com/upstash/purple-squirrel/assets/47982397/c5629fbc-fdbd-4279-81df-c1dce4a18e6c">

  
  8. Finally, switch to Sessions tab and edit session token.<br/>
  <img width="1051" alt="clerk-session-before" src="https://github.com/upstash/purple-squirrel/assets/47982397/67ed8930-a9db-49a9-bf65-715848378c92">


  9. Set it as shown below:<br/>
  ```json
{
	"metadata": "{{user.public_metadata}}"
}
  ```
  <img width="944" alt="clerk-session-after" src="https://github.com/upstash/purple-squirrel/assets/47982397/6790d612-ac4b-4708-914a-8d722678251f">




     
</details>

<details>
  <summary>Step 7: Set your application URL</summary>

  1. Fill the following environment variables in Vercel:
     * NEXT_PUBLIC_URL: URL of your application (e.g. purple-squirrel.vercel.app)
</details>

→ Step 8: Click deploy & visit your site, it will guide you through the rest of your setup!

## Local development
A local tunnel is required in local development since QStash requires a publicly available API to send messages to. This tutorial is based on [localtunnel.me](https://github.com/localtunnel/localtunnel) but you can use any service of your choice.
<details>
  <summary>Step 1: Create a local tunnel</summary>

  ```bash
  npx localtunnel --port 3000
  ```
</details>

<details>
  <summary>Step 2: Fill environment variables</summary>

  Copy the output URL and fill the following environment variable in `.env.local`

  ```bash
  LOCAL_TUNNEL_URL=<YOUR_URL>
  ```

  Fill the rest of the environment variables in `.env.local` as described in the [Deploy your own](#deploy-your-own) section.

</details>

<details>
  <summary>Step 3: Install dependencies & run the project</summary>

  ```bash
  npm install
  npm run dev
  ```
</details>

→ Step 4: Visit your site at `http://localhost:3000`



> In local development, mail pipeline is triggered only once instead of creating a schedule since local server is not expected to be always available.

## Contributing

We welcome contributions to improve this project. Please feel free to submit issues or pull requests.
