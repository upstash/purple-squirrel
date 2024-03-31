import { Redis } from '@upstash/redis';
import OpenAI from "openai";
import type { Applicant } from '@/types/types';

export const runtime = "edge";

const SYSTEM_MESSAGE = `You are a resume parser.
You will be presented information in the following format:
CURRENT_DATE
<current-date>

MAIL_SUBJECT
<mail-subject>

MAIL_FROM
<mail-from>

MAIL_BODY
<mail-body>

RESUME_TEXT
<resume-text>

You will give nothing but the JSON like below:
{
    "basicInfo": {
        "fullName": "<full-name>",
        "role": "<role>",
        "location": "<location>",
        "age": <age>,
        "university": "<university>",
        "email": "<email>",
        "phone": "<phone>",
        "websiteUrl": "<website-url>",
        "linkedinUrl": "<linkedin-url>",
        "githubUrl": "<github-url>"
    },
    "manualFilters": {
        "yoe": <yoe>,
        "highestDegree": "<highest-degree>",
        "degreeSubject": "<degree-subject>",
        "graduationYear": <graduation-year>,
        "graduationMonth": <graduation-month>,
        "ongoing": <ongoing>,
        "team": "<team>",
        "countryCode": "<country-code>"
    },
    "textData": {
        "fullResumeText": "<full-resume-text>",
        "educationText": "<education-text>",
        "experienceText": "<experience-text>",
        "projectsText": "<projects-text>"
    }
}
Some information can be taken from the email information along with the resume.
All the values are strings except age and yoe.
If the information is not available in the text, put null.
Below are information about the key value pairs.

"basicInfo" is an object consisting of basic information about the applicant. You can format the information when you put them here with correct capitalization.
"fullName", "age", "email", "phone", "websiteUrl", "linkedinUrl", "githubUrl" are self explanatory.
"role" is the role of the applicant, such as Senior Software Engineer, you can put the latest or the best describing role.
"location" is where the applicant lives, you can guess it based on the resume.
"university" is the latest university that the applicant got their degree in.

"manualFilters" are critical information that the applicant will be filtered on.
"yoe" is the years of experience of the applicant in an industrial sense. For example: work experience and research experience should be counted but personal hobby projects or education should not be counted. If the information is already presented it in the resume take it, otherwise calculate yourself.
"highestDegree" is highest degree applicant achieved or pursuing. It can be "Associate's", "Bachelor's", "Master's" or "Doctoral".
"degreeSubject" is the subject of the highest degree such as Computer Science.
"graduationYear" is the year the applicant graduated or will graduate.
"graduationMonth" is the month the applicant graduated or will graduate. It can be "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November" or "December".
"ongoing" is a boolean value indicating if the applicant's latest education is still ongoing. It can be derived from the graduation year, graduation month and the CURRENT_DATE provided.
"team" can either be "Development", "Design", "Management", "HR", "Sales and Marketing", "Customer Support", "Quality Assurance", "Operations" or "Finance and Accounting".
"countryCode" is the alpha-2 country code of the applicant such as "TR" for "Turkey".

"textData" is  an object containing text sections from the resume. Given resume text may not be parsed correctly, you should format so it has meaningful spacing and capitalization. Do not change the meaning, lose information, or add comments in formatting.
"fullResumeText" is the full text of the resume formatted according to the rules defined above.
"educationText" is the text of the education section of the resume formatted according to the rules defined above. Another name for this section may be used in resume, just make sure to include the information from the corresponding formal education section not certificates etc.
"experienceText" is the text of the experience section of the resume formatted according to the rules defined above. Another name for this section may be used in resume, just make sure to include the information from the corresponding work experience section not competitions etc.
"projectsText" is the text of the projects section of the resume formatted according to the rules defined above.`;

function mailDataToApplicant(processedMailData: any, parsedMailData: any) {
    if (!parsedMailData.hasOwnProperty("basicInfo") || !parsedMailData.hasOwnProperty("textData")) {
        console.log('PIPELINE: OpenAI Parsing fields missing');
        return { applicant: null, texts: null, mapStatus: false };
    }
    let yoe;
    let highestDegree;
    let degreeSubject;
    let graduationYear;
    let graduationMonth;
    let ongoing;
    let team;
    let countryCode;
    if (parsedMailData.hasOwnProperty("manualFilters")) {
        yoe = parsedMailData.manualFilters.hasOwnProperty("yoe") ? parsedMailData.manualFilters.yoe : null;
        highestDegree = parsedMailData.manualFilters.hasOwnProperty("highestDegree") ? parsedMailData.manualFilters.highestDegree : null;
        degreeSubject = parsedMailData.manualFilters.hasOwnProperty("degreeSubject") ? parsedMailData.manualFilters.degreeSubject : null;
        graduationYear = parsedMailData.manualFilters.hasOwnProperty("graduationYear") ? parsedMailData.manualFilters.graduationYear : null;
        graduationMonth = parsedMailData.manualFilters.hasOwnProperty("graduationMonth") ? parsedMailData.manualFilters.graduationMonth : null;
        ongoing = parsedMailData.manualFilters.hasOwnProperty("ongoing") ? parsedMailData.manualFilters.ongoing : null;
        team = parsedMailData.manualFilters.hasOwnProperty("team") ? parsedMailData.manualFilters.team : null;
        countryCode = parsedMailData.manualFilters.hasOwnProperty("countryCode") ? parsedMailData.manualFilters.countryCode : null;
    } else {
        yoe = null;
        highestDegree = null;
        degreeSubject = null;
        graduationYear = null;
        graduationMonth = null;
        ongoing = null;
        team = null;
        countryCode = null;
    }
    let fullName = parsedMailData.basicInfo.hasOwnProperty("fullName") ? parsedMailData.basicInfo.fullName : null;
    let role = parsedMailData.basicInfo.hasOwnProperty("role") ? parsedMailData.basicInfo.role : null;
    let location = parsedMailData.basicInfo.hasOwnProperty("location") ? parsedMailData.basicInfo.location : null;
    let age = parsedMailData.basicInfo.hasOwnProperty("age") ? parsedMailData.basicInfo.age : null;
    let university = parsedMailData.basicInfo.hasOwnProperty("university") ? parsedMailData.basicInfo.university : null;
    let email = parsedMailData.basicInfo.hasOwnProperty("email") ? parsedMailData.basicInfo.email : null;
    let phone = parsedMailData.basicInfo.hasOwnProperty("phone") ? parsedMailData.basicInfo.phone : null;
    let websiteUrl = parsedMailData.basicInfo.hasOwnProperty("websiteUrl") ? parsedMailData.basicInfo.websiteUrl : null;
    let linkedinUrl = parsedMailData.basicInfo.hasOwnProperty("linkedinUrl") ? parsedMailData.basicInfo.linkedinUrl : null;
    let githubUrl = parsedMailData.basicInfo.hasOwnProperty("githubUrl") ? parsedMailData.basicInfo.githubUrl : null;
    let fullResumeText = parsedMailData.textData.hasOwnProperty("fullResumeText") ? parsedMailData.textData.fullResumeText : null;
    let educationText = parsedMailData.textData.hasOwnProperty("educationText") ? parsedMailData.textData.educationText : null;
    let experienceText = parsedMailData.textData.hasOwnProperty("experienceText") ? parsedMailData.textData.experienceText : null;
    let projectsText = parsedMailData.textData.hasOwnProperty("projectsText") ? parsedMailData.textData.projectsText : null;
    
    if (!fullName || !fullResumeText) {
        console.log('PIPELINE: OpenAI Parsing fields missing');
        return { applicant: null, texts: null, mapStatus: false };
    }
    let applicant: Applicant = {
        "id": null,
        "applicantInfo": {
            "name": fullName,
            "age": age,
            "yoe": yoe,
            "contact": {
                "email": email,
                "phone": phone,
            },
            "location": location,
            "countryCode": countryCode,
            "latestEducation": {
                "ongoing": ongoing,
                "degree": highestDegree,
                "subject": degreeSubject,
                "university": university,
                "graduation": {
                    "month": graduationMonth,
                    "year": graduationYear
                }
            },
            "urls": {
                "website": websiteUrl,
                "linkedin": linkedinUrl,
                "github": githubUrl
            }
        },
        "recruitmentInfo": {
            "stars": null,
            "notes": null,
            "status": "newApply"
        },
        "applicationInfo": {
            "date": new Date(),
            "method": "mail",
            "team": team,
            "role": role,
            "mailInfo": {
                "date": new Date(),
                "from": processedMailData.mailFrom,
                "subject": processedMailData.mailSubject,
                "body": processedMailData.mailBody
            }
        },
        "resumeInfo": {
            "uploadthing": {
                "url": processedMailData.resumeUrl,
                "key": processedMailData.resumeKey
            },
            "partExists": {
                "education": educationText ? true : false,
                "experience": experienceText ? true : false,
                "projects": projectsText ? true : false
            },
            "fullText": fullResumeText,
        }
    };
    let texts = {
        fullResumeText: fullResumeText,
        educationText: educationText,
        experienceText: experienceText,
        projectsText: projectsText
    }
    return { applicant: applicant, texts: texts, mapStatus: true };
}

function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
  }

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST() {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const CURRENT_DATE = new Date().toDateString();
    
    try {
        const encoder = new TextEncoder()
        const decoder = new TextDecoder()

        let completion = ''

        const stream = new ReadableStream({
            async start(controller) {
                let streamEnded = false;

                async function keepAlive() {
                    while (!streamEnded) {
                        const space = '\u200B'; // Zero Width Space
                        const queue = encoder.encode(space);
                        controller.enqueue(queue);
                        await new Promise(resolve => setTimeout(resolve, 10_000));
                    }
                }
                async function pipeline() {
                    try {
                        console.log('PIPELINE: Mail Pipeline started');
                        console.log('PIPELINE: Starting /api/listen-inbox');
                        await fetch("http://localhost:3000/api/listen-inbox", { method: "POST" });
                        const rawMailDataNum = await redis.llen("raw:mail:data:list");
                        const rawMailDataIndexList = Array.from(Array(rawMailDataNum).keys());
                        if (rawMailDataNum > 0) {
                            Promise.all(rawMailDataIndexList.map( async (index) => {
                                console.log('PIPELINE: Starting /api/process-raw-mail-data');
                                let processResponse = await fetch(`http://localhost:3000/api/process-raw-mail-data?index=${index}`, { method: "POST" });
                                let processResponseJson = await processResponse.json();
                                if (processResponseJson.status !== 200) {
                                    console.log('PIPELINE: Error in /api/process-raw-mail-data');
                                    return;
                                }
                                let processedMailData = processResponseJson.processedMailData;

                                console.log('PIPELINE: Fetching OpenAI Parsing Response');
                                
                                let userMessage = `CURRENT_DATE\n${CURRENT_DATE}\n\nMAIL_SUBJECT\n${processedMailData.mailSubject}\n\nMAIL_FROM\n${processedMailData.mailFrom}\n\nMAIL_BODY\n${processedMailData.mailBody}\n\nRESUME_TEXT\n${processedMailData.resumeText}`;
                                let completion = await openai.chat.completions.create({
                                    messages: [
                                    {
                                        role: "system",
                                        content: SYSTEM_MESSAGE,
                                    },
                                    { role: "user", content: userMessage },
                                    ],
                                    model: "gpt-3.5-turbo-0125",
                                    response_format: { type: "json_object" },
                                });
                                if (completion.choices[0].finish_reason === "length") {
                                    console.log('PIPELINE: OpenAI Parsing Length Error');
                                    return;
                                }
                                if (!completion.choices[0].message.content) {
                                    console.log('PIPELINE: OpenAI Parsing No Content Error');
                                    return;
                                }

                                let parsedMailData = JSON.parse(completion.choices[0].message.content);
                                
                                let mapResult = mailDataToApplicant(processedMailData, parsedMailData);
                                let mapStatus = mapResult.mapStatus;
                                if (!mapStatus) {
                                    console.log('PIPELINE: OpenAI Parsed Data Does Not Fit Applicant Schema');
                                    return;
                                }
                                let applicant = mapResult.applicant;
                                if (!applicant) {
                                    console.log('PIPELINE: OpenAI Parsed Data Error');
                                    return;
                                }
                                let texts = mapResult.texts;
                                if (!texts) {
                                    console.log('PIPELINE: OpenAI Parsed Data Error');
                                    return;
                                }
                                
                                console.log('PIPELINE: Fetching OpenAI Embedding Response');
                                let mainEmbedding = await openai.embeddings.create({
                                    model: "text-embedding-3-small",
                                    input: texts.fullResumeText,
                                    encoding_format: "float",
                                });

                                let embeddings: {
                                    mainEmbedding: any,
                                    educationEmbedding?: any,
                                    experienceEmbedding?: any,
                                    projectsEmbedding?: any,
                                } = { mainEmbedding: mainEmbedding.data[0].embedding };

                                if (applicant.resumeInfo.partExists.education) {
                                    let educationEmbedding = await openai.embeddings.create({
                                        model: "text-embedding-3-small",
                                        input: texts.educationText,
                                        encoding_format: "float",
                                    });
                                    embeddings.educationEmbedding = educationEmbedding.data[0].embedding;
                                }
                                if (applicant.resumeInfo.partExists.experience) {
                                    let experienceEmbedding = await openai.embeddings.create({
                                        model: "text-embedding-3-small",
                                        input: texts.experienceText,
                                        encoding_format: "float",
                                    });
                                    embeddings.experienceEmbedding = experienceEmbedding.data[0].embedding;
                                }
                                if (applicant.resumeInfo.partExists.projects) {
                                    let projectsEmbedding = await openai.embeddings.create({
                                        model: "text-embedding-3-small",
                                        input: texts.projectsText,
                                        encoding_format: "float",
                                    });
                                    embeddings.projectsEmbedding = projectsEmbedding.data[0].embedding;
                                }

                                console.log('PIPELINE: Starting /api/create-applicant');
                                await fetch("http://localhost:3000/api/create-applicant", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ applicant: applicant, embeddings: embeddings })
                                });
                            })).then( async () => {
                                console.log('PIPELINE: Purging raw:mail:data:list');
                                await redis.del("raw:mail:data:list");
                                
                                console.log('PIPELINE: Mail Pipeline completed');

                                streamEnded = true;
                                controller.close();
                            }).catch((error) => {
                                console.log(error);
                                streamEnded = true;
                                controller.close();
                            });
                        } else {
                            console.log('PIPELINE: No new emails');
                            console.log('PIPELINE: Mail Pipeline completed');

                            streamEnded = true;
                            controller.close();
                        }
                    } catch (error) {
                        console.log(error);
                        streamEnded = true;
                        controller.close();
                    }
                }

                keepAlive();
                pipeline();
            },
        });

        return new Response(stream)
    } catch (error) {
        console.log(error)
        return Response.json({ status: 500, message: 'Stream API Error' })
    }
}