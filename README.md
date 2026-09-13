<div align="center">

# 🤖 PrepPilot

**Your AI co-pilot for interview day — resume analysis, skill-gap detection, ATS resume generation, and AI mock interviews, built on the MERN stack.**

[![Live Demo](https://img.shields.io/badge/Demo-Live_Site-4ADE80?style=for-the-badge&logo=render&logoColor=white)](https://prep-pilot-frtk.onrender.com)
[![GitHub](https://img.shields.io/badge/Repo-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Dhruvpratap2006/PrepPilot)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/dhruv-pratap-1a3aaa344/)

</div>

---

## What it does

PrepPilot takes a candidate's resume and a target job description and generates a full interview-prep report — match score, top skill gaps, and tailored technical questions. It can also generate an ATS-optimized resume as a downloadable PDF, and run an AI-powered mock interview that gives structured feedback on your answers.

## Features

- 🔐 Auth with email/password + Google OAuth (Passport.js), JWT in httpOnly cookies
- 📄 Resume + job description analysis — match score & top skill gaps
- 🤖 AI-generated interview report (Google Gemini)
- 📝 ATS-optimized resume generation, exported as a PDF (Puppeteer)
- 🎤 AI mock interview mode — generated questions + structured feedback on answers
- 📚 Report history — revisit any past interview report

## Tech Stack

`React 19` `Vite` `Node.js` `Express 5` `MongoDB + Mongoose` `Passport.js` `Google Gemini API` `Puppeteer` `SCSS` `Render`

## Screenshots

| Home | Interview Report |
|---|---|
| ![Home](public/images/home.png) | ![Report](public/images/interview-report.png) |

| Mock Interview | Login |
|---|---|
| ![Mock Interview](public/images/mock-interview.png) | ![Login](public/images/login-page.png) |

## Run it locally

**Backend:**
```bash
git clone https://github.com/Dhruvpratap2006/PrepPilot.git
cd PrepPilot/Backend
npm install
```

Add a `.env` file inside `Backend/`:
```
PORT=3000
NODE_ENV=development
MONGO_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

> First time running resume PDF generation locally? Puppeteer needs Chrome installed:
> ```bash
> npx puppeteer browsers install chrome
> ```

**Frontend:**
```bash
cd PrepPilot/Frontend
npm install
```

Add a `.env` file inside `Frontend/`:
```
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

Runs at `http://localhost:5173`

## Roadmap

- [ ] Score trend slider on the report history page
- [ ] Multi-round mock interview sessions
- [ ] Shareable public interview report links
- [ ] Dark/light theme toggle

## Author

**Dhruv Pratap Singh** — B.Tech CSE (Data Science), NIET
[GitHub](https://github.com/Dhruvpratap2006) • [LinkedIn](https://www.linkedin.com/in/dhruv-pratap-1a3aaa344/)

---

⭐ If you found this useful, drop a star!
