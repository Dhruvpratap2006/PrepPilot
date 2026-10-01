// // for our work we are going to use google genAI

// const { GoogleGenAI } = require("@google/genai")
// const { z } = require("zod")
// const { zodToJsonSchema } = require("zod-to-json-schema")
// const puppeteer = require("puppeteer")

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_GENAI_API_KEY
// })

// // here we are not doing anything for DB here this all part is for AI 
// const generateInterviewReportSchema = z.object({

//   title: z.string().describe("The title of the job for which the interview report is generated"),

//    matchScore: z.number().min(0).max(100).describe("How well the resume matches the job description, out of 100"),

//   technicalQuestions: z.array(z.object({
//     question: z.string().describe("A technical interview question"),
//     intention: z.string().describe("What this question tests"),
//     answer: z.string().describe("Sample answer written in a natural, human tone — not robotic"),
//   })),

//   behavioralQuestions: z.array(z.object({
//     question: z.string().describe("A behavioral interview question"),
//     intention: z.string().describe("What this question tests"),
//     answer: z.string().describe("Sample answer using STAR method, in a natural human tone"),
//   })),

//   skillGaps: z.array(z.object({
//     skill: z.string().describe("Missing or weak skill vs the job description"),
//     severity: z.enum(["low", "medium", "high"]).describe("How critical this gap is for the role"),
//   })),

//   preparationPlan: z.array(z.object({
//     day: z.number().describe("Day number, starting from 1"),
//     focus: z.string().describe("Main topic for this day"),
//     tasks: z.array(z.string()).describe("Actionable tasks for this day"),
//   })),
// });

// async function generateInterviewReport({resume, jobDescription, selfDescription}) {

//     const generateInterviewReportManualSchema = {
//         type: "object",
//         properties: {
//             title: { type: "string" },
//             matchScore: { type: "number" },
//             technicalQuestions: {
//                 type: "array",
//                 items: {
//                     type: "object",
//                     properties: {
//                         question: { type: "string" },
//                         intention: { type: "string" },
//                         answer: { type: "string" },
//                     },
//                     required: ["question", "intention", "answer"],
//                 },
//             },
//             behavioralQuestions: {
//                 type: "array",
//                 items: {
//                     type: "object",
//                     properties: {
//                         question: { type: "string" },
//                         intention: { type: "string" },
//                         answer: { type: "string" },
//                     },
//                     required: ["question", "intention", "answer"],
//                 },
//             },
//             skillGaps: {
//                 type: "array",
//                 items: {
//                     type: "object",
//                     properties: {
//                         skill: { type: "string" },
//                         severity: { type: "string", enum: ["low", "medium", "high"] },
//                     },
//                     required: ["skill", "severity"],
//                 },
//             },
//             preparationPlan: {
//                 type: "array",
//                 items: {
//                     type: "object",
//                     properties: {
//                         day: { type: "number" },
//                         focus: { type: "string" },
//                         tasks: { type: "array", items: { type: "string" } },
//                     },
//                     required: ["day", "focus", "tasks"],
//                 },
//             },
//         },
//         required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
//     };

//      const prompt = `Generate an interview report for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}

// Return the title as the job title/role being interviewed for (extracted from the job description).
//     `

//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents : prompt,
//         config: {
//           responseMimeType: "application/json",
//           responseSchema: generateInterviewReportManualSchema,
//       }
//     })

//     return JSON.parse(response.text)
// }

// // here we are going to use puppeter to generate pdf from html content
// // here we are going to use puppeter to generate pdf from html content
// async function generatePdfFromHtml(htmlContent) {
//     let browser = null;
//     try {
//         browser = await puppeteer.launch({
//             headless: "new",
//             args: [
//                 "--no-sandbox",
//                 "--disable-setuid-sandbox",
//                 "--disable-dev-shm-usage",
//                 "--disable-gpu",
//                 "--no-zygote",
//                 "--single-process",
//             ],
//         });

//         const page = await browser.newPage();
        
//         // Wait until network is idle so all fonts and styles are fully loaded
//         await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//         const pdfBuffer = await page.pdf({
//             format: "A4",
//             margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" },
//             scale: 0.92,
//             printBackground: true,
//         });

//         return pdfBuffer;
//     } catch (error) {
//         console.error("Puppeteer PDF generation error:", error);
//         throw error;
//     } finally {
//         if (browser !== null) {
//             await browser.close();
//         }
//     }
// }

// async function generateResumePDF({resume, selfDescription, jobDescription}) {

//   // now here we are also going to use zod for schema
//   const resumePdfSchema = z.object({
//      html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
//   })

//   const prompt = `You are an expert resume writer and ATS optimization specialist with 10+ years of experience helping candidates land interviews at top companies.

// TASK: Rewrite and tailor the candidate's resume for a specific job description, outputting a complete, self-contained HTML document ready for Puppeteer/PDF conversion.

// INPUT DATA:
// - Original Resume: ${resume}
// - Candidate's Self Description: ${selfDescription}
// - Target Job Description: ${jobDescription}

// INSTRUCTIONS:

// 1. CONTENT STRATEGY & VARIABLE DYNAMIC MAPPING
//    - EXTRACT & RENDER NAME: Extract the candidate's actual full name from the Original Resume or Self Description and render it inside the <h1> header. NEVER output the text "Candidate Name" or place HTML comments.
//    - DO NOT INCLUDE ANY CONTACT INFORMATION (no email, phone, links, or location).
//    - COMPACT VERTICAL SPACING: Maintain tight, balanced spacing throughout. Do NOT leave extra white space or large gaps below headers or between sections.
//    - STRUCTURAL CONSISTENCY: Every bullet point across all sections (Projects, Experience, Achievements) MUST be wrapped in <ul><li> tags. NEVER use <p> tags for description text — this breaks the compact spacing and creates inconsistent gaps.
//    - Analyze the target job description to identify 5-7 key ATS keywords and naturally integrate them into the bullet points.
//    - Use strong action verbs (Built, Architected, Optimized, Shipped, Engineered) followed by quantifiable metrics/impact wherever data is available.
//    - DO NOT FABRICATE METRICS: Only use quantifiable numbers (%, time saved, users, scale) if they are explicitly present in the Original Resume or Self Description. If no metric exists for a point, describe the technical impact qualitatively instead — never invent a number.
//    - STRICT CONSTRAINT: The rendered output must fit EXACTLY on 1 single page (A4/Letter). Prioritize top 3-4 high-impact bullets per entry.

// 2. WRITING STYLE
//    - Avoid generic AI buzzwords ("results-driven professional", "dynamic individual", "team player").
//    - Write clear, technical, concise bullet points in standard developer resume tone.

// 3. REQUIRED HTML & CSS LAYOUT SPECIFICATIONS
//    Generate a complete, self-contained HTML document matching this EXACT structure and CSS style. Replace every HTML comment placeholder below with the actual rendered section content — the final output must contain no HTML comments:

// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <style>
//   @page {
//     size: letter;
//     margin: 0;
//   }
//   * {
//     box-sizing: border-box;
//   }
//   body {
//     font-family: Arial, Helvetica, sans-serif;
//     font-size: 9.5pt;
//     line-height: 1.3;
//     color: #111111;
//     margin: 0;
//     padding: 0.35in 0.4in;
//   }
//   h1 {
//     font-size: 18pt;
//     text-align: center;
//     margin: 0 0 6px 0;
//     font-weight: bold;
//     text-transform: capitalize;
//     letter-spacing: 0.5px;
//   }
//   h2 {
//     font-size: 10.5pt;
//     text-transform: uppercase;
//     border-bottom: 1px solid #111111;
//     padding-bottom: 1px;
//     margin-top: 8px;
//     margin-bottom: 4px;
//     letter-spacing: 0.5px;
//   }
//   .item-header {
//     display: flex;
//     justify-content: space-between;
//     font-weight: bold;
//     font-size: 9.5pt;
//     margin-top: 4px;
//   }
//   .tech-stack {
//     font-style: italic;
//     font-size: 9pt;
//     color: #333333;
//     margin-top: 1px;
//     margin-bottom: 2px;
//   }
//   p {
//     margin: 0 0 2px 0;
//     line-height: 1.3;
//   }
//   ul {
//     margin-top: 2px;
//     margin-bottom: 4px;
//     padding-left: 18px;
//   }
//   li {
//     margin-bottom: 2px;
//     line-height: 1.3;
//   }
//   .skills-group {
//     margin-bottom: 2px;
//   }
//   .skills-group strong {
//     font-weight: bold;
//   }
// </style>
// </head>
// <body>
//   <!-- Insert actual Candidate Name in <h1> -->
//   <!-- Section: Education -->
//   <!-- Section: Experience & Projects -->
//   <!-- Section: Technical Skills (use .skills-group divs, e.g. <div class="skills-group"><strong>Languages:</strong> Java, Python</div>) -->
//   <!-- Section: Achievements & Certifications -->
// </body>
// </html>

// 4. OUTPUT FORMAT
//    Return ONLY a valid JSON object containing no markdown wrappers, conversational text, or code blocks:
//    {
//      "html": "<!DOCTYPE html><html>... fully rendered HTML string with actual candidate details ...</html>"
//    }`;
//    const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(resumePdfSchema),
//         }
//     })


//     const jsonContent = JSON.parse(response.text)
//     return jsonContent 
// }


// // this function will send all the mock interview data to AI and ask for structured feedback

// async function generateMockInterviewFeedback(interviewData) {

//   const mockInterviewFeedbackSchema = {
//     type: "object",
//     properties: {
//       overallScore: { type: "integer" },
//       summary: { type: "string" },
//       questionWiseFeedback: {
//         type: "array",
//         items: {
//           type: "object",
//           properties: {
//             question: { type: "string" },
//             score: { type: "integer" },
//             feedback: { type: "string" },
//           },
//           required: ["question", "score", "feedback"],
//         },
//       },
//       finalActionPlan: {
//         type: "array",
//         items: { type: "string" },
//       },
//     },
//     required: ["overallScore", "summary", "questionWiseFeedback", "finalActionPlan"],
//   };

//   const prompt = `You are an elite technical interview coach and senior hiring evaluator. 
// Your task is to critically analyze the entire mock interview transcript provided below and deliver precise, concise feedback.
// ### Evaluation Criteria:
// 1. **Technical Accuracy & Depth**: Correctness, edge-case coverage, and core concept understanding.
// 2. **Communication & Structure**: Clarity, conciseness, structured thinking (apply STAR method evaluation only where the question is behavioral in nature, not for technical/DSA questions), and confidence.
// 3. **Problem-Solving & Reasoning**: Logical progression, trade-off evaluation, and adaptability.
// ### Output Constraints:
// - Scores must be integers from 1 to 10 (1 = poor/incorrect, 5 = average, 10 = exceptional).
// - Feedback points must be specific and concrete, citing direct details from the candidate's answers rather than generic advice.
// - Keep the summary to exactly 2 sentences.
// - For each question, combine the key strength, key gap, and one concrete suggestion into a single flowing 2-3 sentence statement — do NOT write it as a bulleted or list-style breakdown.
// - Limit the final action plan to the 3-4 most important, high-priority items only.
// ### Interview Data:
// ${JSON.stringify(interviewData)}`;

//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema: mockInterviewFeedbackSchema,
//     }
//   })

//   // console.log("RAW GEMINI RESPONSE:", response.text)

//   const jsonContent = JSON.parse(response.text)
//   return jsonContent
// }

  
// // this function helps in generate the questions for mock interview part 
// async function generateMockInterviewQuestions( { role, domain, experienceLevel, techStack, jobDescription, numQuestions, category } ) {

//   // role -> ex : Software Engineer, Data Scientist, Product Manager
//   // domain -> ex : Web Development, Machine Learning, Cloud Computing
//   // experienceLevel -> ex : Junior, Mid-level, Senior
//   // techStack -> ex : React, Node.js, Python, TensorFlow
//   // jobDescription -> ex : The job description for the role
//   // numQuestions -> ex : 5, 10, 15
//   // category -> ex : Technical, Behavioral, System Design

//       const mockInterviewQuestionsSchema = {
//         type: "object",
//         properties: {
//           questions: {
//             type: "array",
//             items: { type: "string" },
//           },
//         },
//         required: ["questions"],
//       };

//       const prompt = `You are an expert technical interviewer creating mock interview questions.

//           TASK: Generate exactly ${numQuestions} interview questions based on the details below.

//           CANDIDATE TARGET ROLE: ${role}
//           DOMAIN: ${domain}
//           EXPERIENCE LEVEL: ${experienceLevel} (calibrate question difficulty and depth accordingly — e.g., Fresher gets fundamentals-focused questions, Senior/Lead gets architecture, trade-off, and leadership-oriented questions)
//           TECH STACK: ${techStack || "Not specified — infer relevant technologies from the domain and role"}
//           ${jobDescription ? `JOB DESCRIPTION: ${jobDescription}\nUse this job description to extract the exact skills, tools, and responsibilities to base questions on.` : ""}
//           QUESTION CATEGORY: ${category} (Technical, Behavioral, or Mixed)

//           INSTRUCTIONS:
//           - If category is "Technical", generate only technical/conceptual or system-design questions relevant to the tech stack, domain, and experience level.
//           - If category is "Behavioral", generate only behavioral/situational questions (no tech stack references needed), calibrated to the experience level (e.g., Senior/Lead should get leadership and conflict-resolution scenarios, Fresher should get simpler situational questions).
//           - If category is "Mixed", generate a balanced split of technical and behavioral questions.
//           - Questions should be realistic, the kind an actual interviewer would ask for this specific role and experience level.
//           - Do not number the questions or add any prefix — return plain question text only.
//           - Return exactly ${numQuestions} questions, no more, no less.`;

//         const response = await ai.models.generateContent({
//           model: "gemini-3-flash-preview",
//           contents: prompt,
//           config: {
//             responseMimeType: "application/json",
//             responseSchema: mockInterviewQuestionsSchema,
//           }
//         })

//         const jsonContent = JSON.parse(response.text);
//         return jsonContent;
// }

// module.exports = { generateInterviewReport, generateResumePDF, generatePdfFromHtml, generateMockInterviewFeedback, generateMockInterviewQuestions }



// for our work we are going to use google genAI

const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");
const fs = require("fs");

function getChromeExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const possiblePaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    process.env.LOCALAPPDATA ? `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe` : null,
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ].filter(Boolean);

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// here we are not doing anything for DB here this all part is for AI
const generateInterviewReportSchema = z.object({
  title: z.string().describe("The title of the job for which the interview report is generated"),
  matchScore: z.number().min(0).max(100).describe("How well the resume matches the job description, out of 100"),
  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("A technical interview question"),
      intention: z.string().describe("What this question tests"),
      answer: z.string().describe("Sample answer written in a natural, human tone — not robotic"),
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("A behavioral interview question"),
      intention: z.string().describe("What this question tests"),
      answer: z.string().describe("Sample answer using STAR method, in a natural human tone"),
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string().describe("Missing or weak skill vs the job description"),
      severity: z.enum(["low", "medium", "high"]).describe("How critical this gap is for the role"),
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number().describe("Day number, starting from 1"),
      focus: z.string().describe("Main topic for this day"),
      tasks: z.array(z.string()).describe("Actionable tasks for this day"),
    })
  ),
});

async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
  const generateInterviewReportManualSchema = {
    type: "object",
    properties: {
      title: { type: "string" },
      matchScore: { type: "number" },
      technicalQuestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            intention: { type: "string" },
            answer: { type: "string" },
          },
          required: ["question", "intention", "answer"],
        },
      },
      behavioralQuestions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            intention: { type: "string" },
            answer: { type: "string" },
          },
          required: ["question", "intention", "answer"],
        },
      },
      skillGaps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            skill: { type: "string" },
            severity: { type: "string", enum: ["low", "medium", "high"] },
          },
          required: ["skill", "severity"],
        },
      },
      preparationPlan: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "number" },
            focus: { type: "string" },
            tasks: { type: "array", items: { type: "string" } },
          },
          required: ["day", "focus", "tasks"],
        },
      },
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
  };

  const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return the title as the job title/role being interviewed for (extracted from the job description).
    `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: generateInterviewReportManualSchema,
    },
  });

  return JSON.parse(response.text);
}

// here we are going to use puppeter to generate pdf from html content
async function generatePdfFromHtml(htmlContent) {
  let browser = null;
  try {
    const executablePath = getChromeExecutablePath();
    const launchOptions = {
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--single-process",
      ],
    };
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }
    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
      scale: 1,
      printBackground: true,
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Puppeteer PDF generation error:", error);
    throw error;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

async function generateResumePDF({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z.string().describe("The fully rendered HTML content of the resume ready for Puppeteer PDF conversion"),
  });

  const prompt = `You are an elite technical resume writer and ATS optimization specialist.

TASK:
Rewrite and tailor the candidate's resume for the provided target job description. Output a complete, self-contained HTML document matching the EXACT HTML structure, CSS styles, and class names specified below.

INPUT DATA:
- Original Resume: ${resume}
- Candidate's Self Description: ${selfDescription}
- Target Job Description: ${jobDescription}

DATA MAPPING & STRUCTURAL RULES:
1. HEADER & CONTACT:
   - Extract the candidate's full name and put it inside the <h1> tag.
   - Extract contact details (email, LinkedIn link, GitHub link, location, phone) and format them inside <div class="contact"> separated by " | ". Keep anchor tags intact.

2. EDUCATION:
   - Use <div class="entry"> with <div class="entry-header"> containing <span class="place"> for institution and <span class="date"> for location.
   - Use <div class="entry-subheader"> containing degree/CGPA in a <span> and dates in <span class="date">.

3. PROJECTS:
   - Tailor project bullets to emphasize technologies and requirements mentioned in the Target Job Description.
   - For each project:
     * <div class="entry-header">: <span class="place">Project Name | <span class="links">Live Demo / Repo</span></span> and <span class="date">Duration</span>.
     * <div class="tech-line">: List technologies used.
     * <ul><li>: Provide 3-4 impactful, metric-driven bullet points per project.

4. TECHNICAL SKILLS:
   - Render each category on its own line using <div class="skills-row"><b>Category:</b> items...</div>.
   - Preserve all standard categories: Languages, Frontend, Backend, Databases, Tools & Platforms, and Concepts.

5. ACHIEVEMENTS & EXTRACURRICULAR:
   - For each achievement:
     * <div class="entry-header">: <span class="achieve-title">Title & Organization</span> and <span class="date">Year</span>.
     * <ul><li>: Concrete description of the accomplishment.

6. CERTIFICATIONS:
   - List each certification as its own individual <div class="skills-row">Title – Issuer (Year)</div>.

7. STRICT SINGLE-PAGE CONSTRAINT:
   - The entire generated resume must fit completely on exactly 1 single page without spilling onto a second page. Maintain tight, clean bullet points.

EXACT HTML & CSS TEMPLATE TO POPULATE:
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page {
    size: A4;
    margin: 0;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Times New Roman', Times, serif;
    max-width: 850px;
    margin: 0 auto;
    padding: 32px 42px;
    color: #000;
    font-size: 10.5pt;
    line-height: 1.32;
  }
  .header {
    text-align: center;
    margin-bottom: 10px;
  }
  .header h1 {
    font-size: 21pt;
    margin: 0 0 3px 0;
    letter-spacing: 0.5px;
  }
  .header .contact {
    font-size: 9.5pt;
  }
  .header .contact a {
    color: #000;
    text-decoration: none;
  }
  h2.section {
    font-size: 12pt;
    text-transform: none;
    border-bottom: 1.2px solid #000;
    padding-bottom: 1px;
    margin: 12px 0 6px 0;
    letter-spacing: 0.3px;
  }
  .entry {
    margin-bottom: 6px;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: bold;
    font-size: 10.5pt;
  }
  .entry-header .place {
    font-weight: bold;
  }
  .entry-header .date {
    font-weight: normal;
    font-style: italic;
    white-space: nowrap;
  }
  .entry-subheader {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-style: italic;
    font-size: 10pt;
    margin-bottom: 2px;
  }
  .entry-subheader .date {
    font-style: normal;
    font-weight: normal;
  }
  .tech-line {
    font-style: italic;
    font-size: 9.5pt;
    margin: 1px 0 3px 0;
  }
  ul {
    margin: 2px 0 4px 0;
    padding-left: 19px;
  }
  ul li {
    margin-bottom: 2.5px;
    text-align: justify;
    font-size: 9.5pt;
    line-height: 1.28;
  }
  .links {
    font-weight: normal;
    font-style: normal;
  }
  .skills-row {
    margin-bottom: 2.5px;
    font-size: 9.5pt;
    line-height: 1.3;
  }
  .skills-row b {
    font-weight: bold;
  }
  .achieve-title {
    font-weight: bold;
  }
</style>
</head>
<body>
  <!-- Candidate header, education, projects, skills, achievements, certifications -->
</body>
</html>

OUTPUT FORMAT:
Return ONLY a valid JSON object matching the schema with no markdown formatting:
{
  "html": "<!DOCTYPE html>... fully rendered HTML string ..."
}`;

  const modelsToTry = [
    process.env.GEMINI_MODEL,
    "gemini-3.8-flash",
    "gemini-3-flash-preview",
  ].filter(Boolean);

  let lastError = null;
  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
          },
        });

        if (response.text) {
          return JSON.parse(response.text);
        }
      } catch (err) {
        lastError = err;
        console.warn(`[generateResumePDF] Model ${model} attempt ${attempt + 1} failed: ${err.message || err.status}`);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  throw lastError;
}

// this function will send all the mock interview data to AI and ask for structured feedback
async function generateMockInterviewFeedback(interviewData) {
  const mockInterviewFeedbackSchema = {
    type: "object",
    properties: {
      overallScore: { type: "integer" },
      summary: { type: "string" },
      questionWiseFeedback: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            score: { type: "integer" },
            feedback: { type: "string" },
          },
          required: ["question", "score", "feedback"],
        },
      },
      finalActionPlan: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: ["overallScore", "summary", "questionWiseFeedback", "finalActionPlan"],
  };

  const prompt = `You are an elite technical interview coach and senior hiring evaluator. 
Your task is to critically analyze the entire mock interview transcript provided below and deliver precise, concise feedback.
### Evaluation Criteria:
1. **Technical Accuracy & Depth**: Correctness, edge-case coverage, and core concept understanding.
2. **Communication & Structure**: Clarity, conciseness, structured thinking (apply STAR method evaluation only where the question is behavioral in nature, not for technical/DSA questions), and confidence.
3. **Problem-Solving & Reasoning**: Logical progression, trade-off evaluation, and adaptability.
### Output Constraints:
- Scores must be integers from 1 to 10 (1 = poor/incorrect, 5 = average, 10 = exceptional).
- Feedback points must be specific and concrete, citing direct details from the candidate's answers rather than generic advice.
- Keep the summary to exactly 2 sentences.
- For each question, combine the key strength, key gap, and one concrete suggestion into a single flowing 2-3 sentence statement — do NOT write it as a bulleted or list-style breakdown.
- Limit the final action plan to the 3-4 most important, high-priority items only.
### Interview Data:
${JSON.stringify(interviewData)}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: mockInterviewFeedbackSchema,
    },
  });

  return JSON.parse(response.text);
}

// this function helps in generate the questions for mock interview part
async function generateMockInterviewQuestions({
  role,
  domain,
  experienceLevel,
  techStack,
  jobDescription,
  numQuestions,
  category,
}) {
  const mockInterviewQuestionsSchema = {
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: { type: "string" },
      },
    },
    required: ["questions"],
  };

  const prompt = `You are an expert technical interviewer creating mock interview questions.

TASK: Generate exactly ${numQuestions} interview questions based on the details below.

CANDIDATE TARGET ROLE: ${role}
DOMAIN: ${domain}
EXPERIENCE LEVEL: ${experienceLevel} (calibrate question difficulty and depth accordingly — e.g., Fresher gets fundamentals-focused questions, Senior/Lead gets architecture, trade-off, and leadership-oriented questions)
TECH STACK: ${techStack || "Not specified — infer relevant technologies from the domain and role"}
${jobDescription ? `JOB DESCRIPTION: ${jobDescription}\nUse this job description to extract the exact skills, tools, and responsibilities to base questions on.` : ""}
QUESTION CATEGORY: ${category} (Technical, Behavioral, or Mixed)

INSTRUCTIONS:
- If category is "Technical", generate only technical/conceptual or system-design questions relevant to the tech stack, domain, and experience level.
- If category is "Behavioral", generate only behavioral/situational questions (no tech stack references needed), calibrated to the experience level (e.g., Senior/Lead should get leadership and conflict-resolution scenarios, Fresher should get simpler situational questions).
- If category is "Mixed", generate a balanced split of technical and behavioral questions.
- Questions should be realistic, the kind an actual interviewer would ask for this specific role and experience level.
- Do not number the questions or add any prefix — return plain question text only.
- Return exactly ${numQuestions} questions, no more, no less.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: mockInterviewQuestionsSchema,
    },
  });

  return JSON.parse(response.text);
}

module.exports = {
  generateInterviewReport,
  generateResumePDF,
  generatePdfFromHtml,
  generateMockInterviewFeedback,
  generateMockInterviewQuestions,
};