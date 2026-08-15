// for our work we are going to use google genAI

const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// here we are not doing anything for DB here this all part is for AI 
const generateInterviewReportSchema = z.object({

  title: z.string().describe("The title of the job for which the interview report is generated"),

   matchScore: z.number().min(0).max(100).describe("How well the resume matches the job description, out of 100"),

  technicalQuestions: z.array(z.object({
    question: z.string().describe("A technical interview question"),
    intention: z.string().describe("What this question tests"),
    answer: z.string().describe("Sample answer written in a natural, human tone — not robotic"),
  })),

  behavioralQuestions: z.array(z.object({
    question: z.string().describe("A behavioral interview question"),
    intention: z.string().describe("What this question tests"),
    answer: z.string().describe("Sample answer using STAR method, in a natural human tone"),
  })),

  skillGaps: z.array(z.object({
    skill: z.string().describe("Missing or weak skill vs the job description"),
    severity: z.enum(["low", "medium", "high"]).describe("How critical this gap is for the role"),
  })),

  preparationPlan: z.array(z.object({
    day: z.number().describe("Day number, starting from 1"),
    focus: z.string().describe("Main topic for this day"),
    tasks: z.array(z.string()).describe("Actionable tasks for this day"),
  })),
});

async function generateInterviewReport({resume, jobDescription, selfDescription}) {

     const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
    `


    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents : prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: zodToJsonSchema(generateInterviewReportSchema),
      }
    })

  

    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" },
        scale: 0.92
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePDF({resume, selfDescription, jobDescription}) {

  // now here we are also going to use zod for schema
  const resumePdfSchema = z.object({
     html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
  })

  const prompt = `You are an expert resume writer and ATS optimization specialist with 10+ years of experience helping candidates land interviews at top companies.

TASK: Rewrite and tailor the candidate's resume for a specific job description, outputting a complete, self-contained HTML document ready for Puppeteer/PDF conversion.

INPUT DATA:
- Original Resume: ${resume}
- Candidate's Self Description: ${selfDescription}
- Target Job Description: ${jobDescription}

INSTRUCTIONS:

1. CONTENT STRATEGY & VARIABLE DYNAMIC MAPPING
   - EXTRACT & RENDER NAME: Extract the candidate's actual full name from the Original Resume or Self Description and render it inside the <h1> header. NEVER output the text "Candidate Name" or place HTML comments.
   - DO NOT INCLUDE ANY CONTACT INFORMATION (no email, phone, links, or location).
   - COMPACT VERTICAL SPACING: Maintain tight, balanced spacing throughout. Do NOT leave extra white space or large gaps below headers or between sections.
   - STRUCTURAL CONSISTENCY: Every bullet point across all sections (Projects, Experience, Achievements) MUST be wrapped in <ul><li> tags. NEVER use <p> tags for description text — this breaks the compact spacing and creates inconsistent gaps.
   - Analyze the target job description to identify 5-7 key ATS keywords and naturally integrate them into the bullet points.
   - Use strong action verbs (Built, Architected, Optimized, Shipped, Engineered) followed by quantifiable metrics/impact wherever data is available.
   - DO NOT FABRICATE METRICS: Only use quantifiable numbers (%, time saved, users, scale) if they are explicitly present in the Original Resume or Self Description. If no metric exists for a point, describe the technical impact qualitatively instead — never invent a number.
   - STRICT CONSTRAINT: The rendered output must fit EXACTLY on 1 single page (A4/Letter). Prioritize top 3-4 high-impact bullets per entry.

2. WRITING STYLE
   - Avoid generic AI buzzwords ("results-driven professional", "dynamic individual", "team player").
   - Write clear, technical, concise bullet points in standard developer resume tone.

3. REQUIRED HTML & CSS LAYOUT SPECIFICATIONS
   Generate a complete, self-contained HTML document matching this EXACT structure and CSS style. Replace every HTML comment placeholder below with the actual rendered section content — the final output must contain no HTML comments:

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page {
    size: letter;
    margin: 0;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 9.5pt;
    line-height: 1.3;
    color: #111111;
    margin: 0;
    padding: 0.35in 0.4in;
  }
  h1 {
    font-size: 18pt;
    text-align: center;
    margin: 0 0 6px 0;
    font-weight: bold;
    text-transform: capitalize;
    letter-spacing: 0.5px;
  }
  h2 {
    font-size: 10.5pt;
    text-transform: uppercase;
    border-bottom: 1px solid #111111;
    padding-bottom: 1px;
    margin-top: 8px;
    margin-bottom: 4px;
    letter-spacing: 0.5px;
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 9.5pt;
    margin-top: 4px;
  }
  .tech-stack {
    font-style: italic;
    font-size: 9pt;
    color: #333333;
    margin-top: 1px;
    margin-bottom: 2px;
  }
  p {
    margin: 0 0 2px 0;
    line-height: 1.3;
  }
  ul {
    margin-top: 2px;
    margin-bottom: 4px;
    padding-left: 18px;
  }
  li {
    margin-bottom: 2px;
    line-height: 1.3;
  }
  .skills-group {
    margin-bottom: 2px;
  }
  .skills-group strong {
    font-weight: bold;
  }
</style>
</head>
<body>
  <!-- Insert actual Candidate Name in <h1> -->
  <!-- Section: Education -->
  <!-- Section: Experience & Projects -->
  <!-- Section: Technical Skills (use .skills-group divs, e.g. <div class="skills-group"><strong>Languages:</strong> Java, Python</div>) -->
  <!-- Section: Achievements & Certifications -->
</body>
</html>

4. OUTPUT FORMAT
   Return ONLY a valid JSON object containing no markdown wrappers, conversational text, or code blocks:
   {
     "html": "<!DOCTYPE html><html>... fully rendered HTML string with actual candidate details ...</html>"
   }`;
   const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)
    return jsonContent 
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
    }
  })

  // console.log("RAW GEMINI RESPONSE:", response.text)

  const jsonContent = JSON.parse(response.text)
  return jsonContent
}

  


module.exports = { generateInterviewReport, generateResumePDF, generatePdfFromHtml, generateMockInterviewFeedback }