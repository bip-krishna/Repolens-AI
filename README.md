
# RepoLens AI 🚀
### Understand Any GitHub Repository in Minutes

RepoLens AI is an AI-powered developer platform that analyzes GitHub repositories and generates architecture insights, contributor onboarding guides, code explanations, and interactive visualizations — all automatically.

Built for developers, open-source contributors, students, and teams who want to quickly understand unfamiliar codebases.

---

## ✨ Features

### 🔍 Repository Analysis
- Parse any public GitHub repository
- Detect frameworks, languages, and architecture
- Generate intelligent project summaries

### 🧠 AI Code Understanding
- Explain folders, files, and components
- Describe code flow and dependencies
- Simplify complex logic into human-readable explanations

### 🗺️ Architecture Visualization
- Interactive dependency graphs
- Frontend/backend relationship mapping
- API and module flow diagrams
- Component hierarchy visualization

### 🤝 Contributor Onboarding
- Auto-generated setup instructions
- Beginner-friendly file recommendations
- Suggested “good first issues”
- Contribution workflow guidance

### 💬 Chat With Your Repository
Ask questions like:
- “Where is authentication handled?”
- “Explain the API flow”
- “Which file manages state?”
- “How do I run this project?”

### 📊 Code Intelligence
- Complexity analysis
- Dependency heatmaps
- Dead code detection
- Repository health insights

---

# 🛠️ Tech Stack

## Frontend
- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Flow

## Backend
- Node.js / FastAPI
- Express.js

## AI & Parsing
- Gemini API / OpenAI API
- LangChain
- Tree-sitter
- ts-morph
- Babel Parser

## Database
- PostgreSQL / MongoDB

## DevOps
- Docker
- Vercel
- GitHub Actions

---

# 🧩 System Architecture

```txt
                ┌────────────────────┐
                │    GitHub Repo     │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │   Repo Cloner      │
                └─────────┬──────────┘
                          │
                          ▼
                ┌────────────────────┐
                │   Code Parser      │
                └─────────┬──────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌────────────────┐
│ AI Summaries │ │ Architecture │ │ Dependency Map │
└──────┬───────┘ └──────┬───────┘ └────────┬───────┘
       │                │                  │
       └────────────────┼──────────────────┘
                        ▼
             ┌──────────────────┐
             │  Frontend UI     │
             └──────────────────┘
