// for our work we are going to use google genAI

const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

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


module.exports = { generateInterviewReport }