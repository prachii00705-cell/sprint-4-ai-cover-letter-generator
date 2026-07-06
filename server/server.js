import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ============================
// Gemini Configuration
// ============================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================
// Home Route
// ============================

app.get("/", (req, res) => {
    res.send("Sprint 4 Cover Letter Generator API Running...");
});

// ============================
// Generate Cover Letter
// ============================

app.post("/generate", async (req, res) => {

    try {

        const {
            name,
            jobRole,
            company,
            skills,
            jobDescription
        } = req.body;

        if (
            !name ||
            !jobRole ||
            !company ||
            !skills ||
            !jobDescription
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        const prompt = `
            You are a senior HR recruiter, hiring manager, and professional career coach.

            Generate a personalized, ATS-friendly cover letter based on the candidate's information.

            Candidate Details

            Name:
            ${name}

            Target Job Role:
            ${jobRole}

            Target Company:
            ${company}

            Skills:
            ${skills}

            Job Description:
            ${jobDescription}

            Requirements:

            - Address the hiring manager professionally (for example: "Dear Hiring Manager," or "Dear ${company} Hiring Team,").
            - Write between 350 and 450 words.
            - Use formal business English.
            - Keep the tone confident, professional and enthusiastic.
            - Mention how the candidate's skills match the job description.
            - Explain why the candidate wants to join ${company}.
            - Do not invent fake work experience, degrees or certifications.
            - Do not use markdown.
            - Do not use **bold**, *italic*, bullet points or numbering.
            - Return only the cover letter.

            End exactly like this:

            Sincerely,

            ${name}
            `;
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const result = await model.generateContent(prompt);

        const response = result.response;

        const letter = response
            .text()
            .replace(/\*\*/g, "")
            .trim();

        res.json({
            success: true,
            letter
        });

    }

//     catch (error) {

//         console.error("Gemini Error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Unable to generate the cover letter. Please try again."
//         });

//     }
// });

        catch (error) {

            console.error("FULL ERROR:", error);

            res.status(500).json({
                success: false,
                message: error.message
            });

        }
    });    

// ============================
// Start Server
// ============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`✅ Server running on http://localhost:${PORT}`);

});