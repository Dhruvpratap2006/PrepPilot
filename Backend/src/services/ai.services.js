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

  title: z.string().describe("Job title for this interview report"),

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
  title: z.string().describe("The title of the job for which the interview report is generated"),
});

async function generateInterviewReport({resume, jobDescription, selfDescription}) {

     const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
    `


    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents : prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: z.toJSONSchema(generateInterviewReportSchema),
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

TASK: Rewrite and tailor the candidate's resume for a specific job description, output as clean HTML ready for PDF conversion.

INPUT DATA:
- Original Resume: ${resume}
- Candidate's Self Description: ${selfDescription}
- Target Job Description: ${jobDescription}

INSTRUCTIONS:

1. CONTENT STRATEGY
   - Analyze the job description and identify the top 5-7 keywords/skills the ATS will scan for
   - Naturally weave these keywords into the resume's existing bullet points and skills section — don't force them awkwardly
   - Rewrite bullet points using strong action verbs (Built, Led, Optimized, Reduced, Increased) followed by quantifiable impact (%, numbers, time saved) wherever the original resume or self-description gives you data to work with
   - Do NOT invent achievements, numbers, or experience that aren't grounded in the original resume or self-description
   - Reorder or re-emphasize sections/bullets so the most job-relevant experience appears first
   - STRICT CONSTRAINT: The resume must fit exactly 1 page when rendered as A4/Letter PDF. Prioritize the most relevant 3-4 bullet points per role/project over including everything — cut lower-impact or older experience/projects if needed to maintain 1-page length.

2. WRITING STYLE (avoid AI-sounding text)
   - No generic phrases like "results-driven professional," "team player," "dynamic individual," "passionate about"
   - No em-dashes used as a stylistic tic; use them only when grammatically natural
   - Vary sentence length and structure — real resumes aren't uniformly polished
   - Write the way the candidate would describe their own work, based on their self-description's tone

3. ATS COMPATIBILITY (non-negotiable)
   - Use standard section headers: "Experience," "Education," "Skills," "Projects" — no creative renaming
   - No tables, no multi-column layouts, no text inside images, no icons for critical info (icons purely decorative are OK)
   - Use semantic HTML (<h1>, <h2>, <ul><li>, etc.) — not divs styled to look like headers
   - Standard fonts only (Arial, Calibri, Georgia, Helvetica) — no decorative/script fonts
   - Contact info as plain text, not in a header/footer or image

4. VISUAL DESIGN
   - Clean, single-column layout (ATS-safe), generous white space, consistent margins
   - One accent color max (for name/section headers only) — professional tones only (navy, dark teal, charcoal), no bright/neon colors
   - Consistent font sizing hierarchy: name > section headers > job titles > body text
   - Print-friendly: assume this will be rendered via Puppeteer to A4/Letter PDF — no fixed pixel widths beyond page size, use @media print considerations

5. OUTPUT FORMAT
   Return ONLY a valid JSON object, no markdown code fences, no explanation text before or after:
   {
     "html": "<the complete HTML document as a string, including inline <style> tag>"
   }

   The HTML must be a complete, self-contained document (starting with <!DOCTYPE html>) with all CSS inlined in a <style> tag in the <head> — no external stylesheets, since Puppeteer will render this standalone.`;

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

  


module.exports = { generateInterviewReport, generateResumePDF, generatePdfFromHtml } 