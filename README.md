<p align="center" size="20" style="font-size:2.5em; font-weight: bold;">Open-Source Job Application Search Engine</p>
<div align="center"><a style="font-size:1.5em;" href="https://purple-squirrel-demo.vercel.app/">Live Demo</a></div>
<div align="center"><img width="1440" alt="purple-squirrel" src="https://github.com/user-attachments/assets/e910d240-9bfc-4034-b63f-d0b338754130"></div>

## Overview
- [🥞 Tech Stack](#tech-stack)
- [🐿️ Deploy your own](#deploy-your-own)
- [💻 Local development](#local-development)
- [➕ Contributing](#contributing)

## Tech Stack
- VectorDB & Embedding Models: [Upstash Vector](https://upstash.com)
- Scheduling & Serverless Function Orchestration: [Upstash QStash](https://upstash.com)
- App logic: [Next.js](https://nextjs.org)
- Deployment: [Vercel](https://vercel.com)
- File Storage: [uploadthing](https://uploadthing.com)
- LLM: [OpenAI](https://openai.com)
- UI Components: [shadcn](https://ui.shadcn.com/)

## Deploy your own
<details>
  <summary>Step 1: Clone the repository</summary>

  1. Clone the repository:
      ```bash
      git clone https://github.com/upstash/purple-squirrel.git
      cd purple-squirrel
      ```
  2. Create a `.env` file in the root directory, and copy the contents of `.env.local.example` into it.
  3. Fill the environment variables as described in the next steps.
</details>
Alternatively you can use the Vercel Deploy Button:<br/>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fupstash%2Fpurple-squirrel&env=UPSTASH_VECTOR_REST_URL,UPSTASH_VECTOR_REST_TOKEN,QSTASH_URL,QSTASH_TOKEN,IMAP_USERNAME,IMAP_PASSWORD,IMAP_HOST,IMAP_PORT,UPLOADTHING_TOKEN,OPENAI_API_KEY,NEXT_PUBLIC_URL,BASIC_AUTH_ENABLED,BASIC_AUTH_USERNAME,BASIC_AUTH_PASSWORD)

<details>
  <summary>Step 2: Connect your mailbox</summary>

  **Note:** This tutorial will be based on Gmail, but you can set up an IMAP connection with any other provider. We recommend creating a separate email like ps@company.com and forwarding job mails there. You can also create a folder like JOBS and configure the application to read from that folder in the setup step.
  1. Complete the following steps described in [this tutorial](https://support.google.com/a/answer/9003945#less_secure&zippy=%2Cstep-turn-on-less-secure-apps%2Cstep-create-and-use-app-passwords%2Cstep-turn-on-imap-in-gmail).
     * [Step 1: Turn on Less secure apps](https://support.google.com/a/answer/9003945#less_secure&zippy=%2Cstep-turn-on-less-secure-apps)
     * [Step 2: Create and use App Passwords](https://support.google.com/a/answer/9003945#app_passwords&zippy=%2Cstep-create-and-use-app-passwords)
     * [Step 3: Turn on IMAP in Gmail](https://support.google.com/a/answer/9003945#imap_gmail&zippy=%2Cstep-turn-on-imap-in-gmail)
  2. Fill the following environment variables in your `.env` file:
     * IMAP_USERNAME: Your mail address
     * IMAP_PASSWORD: App Password you generated
     * IMAP_HOST: imap.gmail.com
     * IMAP_PORT: 993
</details>

<details>
  <summary>Step 3: Set up Upstash Vector</summary>

  1. Open an Upstash account.
  2. Switch to [Vector tab in Console](https://console.upstash.com/vector).
  3. Click Create Index.
  4. Think of a name and select a region close to your users, Embedding Model, Dimensions and Metric should be set like below.<br/>
  ![create-index](https://github.com/user-attachments/assets/9029637a-5dd5-4b4a-b800-9c9332332d42)
  5. Click Next -> Click Create.
  6. Fill the following environment variables in your `.env` file, which can be found and copied in your index page:
      * UPSTASH_VECTOR_REST_URL: Your endpoint
      * UPSTASH_VECTOR_REST_TOKEN<br/>
      ![env-index](https://github.com/user-attachments/assets/71a1f771-a3f5-4fcb-8e9d-4fcf871119a9)


</details>

<details>
  <summary>Step 4: Set up Upstash QStash</summary>

  1. Switch to [QStash tab in Upstash Console](https://console.upstash.com/qstash)
  2. Fill the following environment variables in your `.env` file, which can be found and copied in your QStash page:
      * QSTASH_URL
      * QSTASH_TOKEN<br/>
      ![env-qstash](https://github.com/user-attachments/assets/64a30afa-3f69-46d0-85e8-98bb9b7c6c7b)
  > QStash free plan has a limit of 500 messages per day. This will limit your mail pipeline to approximately 200 applicants per day. We recommend upgrading to the pay as you go plan. See [QStash Pricing](https://upstash.com/pricing/qstash) for more information.


</details>

<details>
  <summary>Step 5: Set up uploadthing</summary>

  1. Sign in to [uploadthing](https://uploadthing.com/).
  2. Click Create a new app.
  3. Think of a name and select an app default region close to your users.<br/>
  ![create-uploadthing](https://github.com/user-attachments/assets/c77bdc2c-8925-4559-8686-dbbfe821a679)
  4. Fill the following environment variables in your `.env` file, which can be found and copied in the API Keys tab:
     * UPLOADTHING_TOKEN<br/>
     ![env-uploadthing](https://github.com/user-attachments/assets/4b23ca2d-4d33-444f-ad48-5eeca0cd3209)


</details>

<details>
  <summary>Step 6: Set OpenAI API key</summary>

  1. Go to [OpenAI Platform -> API keys](https://platform.openai.com/api-keys) and login to your account.
  2. Click Create new secret key.
  3. Enter a name and click Create secret key.<br/>
  ![openai-key](https://github.com/user-attachments/assets/eb8860cc-b729-4404-88be-5af514505fcd)
  4. Don't forget to copy and save your key. Fill the following environment variable in your `.env` file:
     * OPENAI_API_KEY
</details>

<details>
  <summary>Step 7: Set up Basic Auth</summary>

  1. Decide if you want Basic Auth in your application, and set the following environment variable in your `.env` file:<br/>
    BASIC_AUTH_ENABLED=true<br/>
    or<br/>
    BASIC_AUTH_ENABLED=false<br/>
  2. If you want Basic Auth, fill the following environment variables in your `.env` file:
      * BASIC_AUTH_USERNAME
      * BASIC_AUTH_PASSWORD
  
</details>

<details>
  <summary>Step 8: Deploy & Setup</summary>

  1. Deploy your application to Vercel with the following command:
      ```bash
      vercel
      ```
  2. Go to your project at [Vercel Dashboard](https://vercel.com/) for the next steps.
  3. Learn the Production Domain of your application from the Project tab.<br/>
  ![domain](https://github.com/user-attachments/assets/457b4e87-5622-4472-97eb-ec0cfead6043)
  4. Go to Settings -> Environment Variables, copy and paste your `.env` file.
  5. Fill the following environment variable with the Production Domain (Not the Deployment URL) of your application:
      * NEXT_PUBLIC_URL: Production Domain of your application (e.g. https://your-app.vercel.app)
  6. Go to the Deployments tab and redeploy your application.<br/>
  ![redeploy](https://github.com/user-attachments/assets/53710764-26c0-4963-8b01-12e60b215da3)
  7. Visit `https://your-app.vercel.app/setup` to set up your application.<br/>
  <img width="1440" alt="setup" src="https://github.com/user-attachments/assets/9164f6b6-ee83-4971-ac56-777ac4b34bf5">

</details>

→ Your application is ready to use!

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

<details>
  <summary>Step 4: Setup</summary>

  1. Visit `http://localhost:3000/setup` to set up your application.<br/>
  <img width="1440" alt="setup" src="https://github.com/user-attachments/assets/9164f6b6-ee83-4971-ac56-777ac4b34bf5">
</details>

→ Your application is ready to use!


> In local development, mail pipeline is triggered only once instead of creating a schedule since local server is not expected to be always available.

## Contributing

We welcome contributions to improve this project. Please feel free to submit issues or pull requests.
