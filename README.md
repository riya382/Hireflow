# Preply - AI-Powered Interview Coach 🚀

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Elevate your interview preparation to the next level with the power of Gemini AI. Get instant semantic analysis, real-time audio/text interactive mock sessions, data-driven feedback loops, and automated standard ATS metric reporting in seconds.

---

## 🌐 Live Demo

[Preply - Live Platform Link](#) *(Add deployment link here later)*

---

## 📋 Table of Contents

1. [About The Project](#-about-the-project)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [System Directory Tree Structure](#-system-directory-tree-structure)
5. [Getting Started](#-getting-started)
6. [Environment Variables](#-environment-variables)
7. [API Endpoints](#-api-endpoints)
8. [License](#-license)

---

## 📖 About The Project

Preply is an enterprise-grade technical and behavioral mock interview preparation application designed to help job seekers eliminate traditional workspace guessing games. By contextually blending real-world job criteria directly with candidate profile metrics, the platform builds responsive, target-specific simulation tracks. This guarantees objective diagnostic data, highlighting key technical gap matrices while optimizing individual confidence.

---

## ✨ Key Features

* **Secure User Authentication:** JWT-based login, registration tokens, and strict private session route guards.
* **Context-Aware Question Generation:** Integrates advanced LLM token workflows through the `gemini-2.5-flash` model to analyze candidate resume text buffers side-by-side with target job descriptions.
* **ATS Compatibility Analytics:** Real-time semantic checking loops returning dynamic Match Scores ($0-100\%$) indicating real corporate pipeline filter bypass probabilities.
* **100% Free Voice Automation:** Implements smooth text-to-speech feedback loops built natively on top of the client-side Web Speech API, eliminating premium external cloud service dependencies.
* **Granular Scorecard History:** Delivers dynamic real-time inline evaluation components after every submitted question, updating seamlessly into a complete post-interview report detailing comprehensive user answers, structural flaws, and baseline ideal answers.

---

## 🛠️ Tech Stack

This project is built with a modern MERN stack and leading AI architectures.

| Frontend | Backend | Database | AI / Auth |
| :--- | :--- | :--- | :--- |
| React (Vite) | Node.js | MongoDB Atlas | Google Gemini SDK |
| Tailwind CSS | Express.js | Mongoose ODM | JWT & bcryptjs |
| React Router | Axios | | Web Speech API |
| FontAwesome | `pdf-parse` | | |

---

## 📂 System Directory Tree Structure

```text
Preply/
├── Backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers (interview.controller.js)
│   │   ├── middlewares/    # Authentication & Multi-part upload rules
│   │   ├── models/         # MongoDB Mongoose collection models
│   │   ├── routes/         # Express endpoint definitions
│   │   └── services/       # Core Gemini AI integration (ai.service.js)
│   └── server.js
└── Frontend/
    ├── src/
    │   ├── features/       # Feature-driven layouts (Auth, Interview)
    │   │   └── interview/pages/MockInterview.jsx
    │   ├── App.jsx
    │   └── main.jsx
