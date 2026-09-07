<div align="center">

# 🧠 KnowledgeHub AI

### Chat with your documents intelligently — a full-stack RAG application built from scratch

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20DB-red)](https://qdrant.tech)
[![Hugging Face](https://img.shields.io/badge/HuggingFace-Inference%20API-yellow?logo=huggingface&logoColor=black)](https://huggingface.co)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://knowledgehub-ai-khaki.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](./LICENSE)

**[🌐 Live Demo](https://knowledgehub-ai-khaki.vercel.app)** &nbsp;·&nbsp; **[🎬 Demo Video](https://youtu.be/bAxCFyHznNw)**

</div>

---

## 📖 About

**KnowledgeHub AI** is a personal full-stack project I built to explore the full depth of Retrieval-Augmented Generation (RAG) — from raw document ingestion all the way to streaming LLM responses in a production-ready web app.

The idea is simple: upload your documents, ask questions, and get accurate AI-generated answers grounded in your own content — not hallucinations. Everything from the vector pipeline to the conversational UI was designed and implemented from scratch.

This project covers authentication, file storage, vector databases, embeddings, LLM inference, streaming, and a fully responsive UI — all wired together in a single Next.js application.

---

## 🎬 Demo

[![Watch the Demo](https://img.youtube.com/vi/bAxCFyHznNw/maxresdefault.jpg)](https://youtu.be/bAxCFyHznNw)



## ✨ Features

- 🔐 **Authentication** — Google OAuth and email/password sign-in via Auth.js v5
- 📁 **Document Library** — Upload and manage PDF, DOCX, TXT, and Markdown files (up to 20 MB)
- 🧠 **RAG Pipeline** — Full pipeline: parse → chunk → embed → vector search → LLM answer
- 💬 **Multi-turn Chat** — Conversational memory using the last N messages as context
- 📚 **Chat History** — All conversations are saved and accessible from the sidebar
- 🔍 **Semantic Search** — Query across all your documents from a dedicated search page
- ⚙️ **Admin Settings** — Configure chunk size, overlap, topK, similarity threshold, and AI models from the UI
- ☁️ **Flexible Storage** — Store files locally or on Vercel Blob, switchable via environment variable
- 🌙 **Dark / Light Theme** — Full theme support with system preference detection

---

## 🧠 RAG Pipeline

```
User uploads file
       │
       ▼
  Text Extraction
  (PDF / DOCX / TXT / MD)
       │
       ▼
  Text Chunking
  (configurable size + overlap)
       │
       ▼
  Embedding Generation
  (Hugging Face: BAAI/bge-small-en-v1.5)
       │
       ▼
  Vector Storage
  (Qdrant)
       │
       ▼
  User sends question
       │
       ▼
  Query Embedding
       │
       ▼
  Semantic Search
  (Qdrant — topK similar chunks)
       │
       ▼
  Prompt Construction
  (context + conversation history)
       │
       ▼
  LLM Streaming Response
  (Hugging Face: Qwen/Qwen3-8B)
       │
       ▼
  Answer displayed in chat
```

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, TypeScript) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com), [Lucide React](https://lucide.dev) |
| **Animations** | [Framer Motion](https://www.framer.com/motion) |
| **Authentication** | [Auth.js v5](https://authjs.dev) (Google OAuth + Credentials) |
| **Database** | [MongoDB](https://www.mongodb.com) via [Mongoose](https://mongoosejs.com) |
| **Vector Database** | [Qdrant](https://qdrant.tech) |
| **Embeddings** | [Hugging Face Inference API](https://huggingface.co/inference-api) — `BAAI/bge-small-en-v1.5` |
| **LLM** | [Hugging Face Inference API](https://huggingface.co/inference-api) — `Qwen/Qwen3-8B` |
| **File Parsing** | [pdf-parse](https://www.npmjs.com/package/pdf-parse), [Mammoth](https://github.com/mwilliamson/mammoth.js) (DOCX) |
| **Text Splitting** | [@langchain/textsplitters](https://js.langchain.com/docs/modules/data_connection/document_transformers) |
| **File Storage** | Local filesystem / [Vercel Blob](https://vercel.com/storage/blob) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/             # Login & Register pages
│   ├── (workspace)/        # Protected app pages
│   │   ├── chat/           # AI Chat interface
│   │   ├── chats/          # Chat history
│   │   ├── documents/      # Document library & upload
│   │   ├── search/         # Semantic search
│   │   ├── settings/       # Admin settings
│   │   └── profile/        # User profile
│   ├── api/                # API routes (REST)
│   └── page.tsx            # Landing page
├── components/
│   ├── auth/               # Auth forms
│   ├── chat/               # Chat UI components
│   ├── workspace/          # Sidebar, navbar, layout
│   └── ui/                 # shadcn/ui base components
├── lib/
│   ├── embeddings/         # Hugging Face embedding client
│   ├── llm/                # Hugging Face LLM client (streaming)
│   ├── parser/             # File parsers (PDF, DOCX, TXT, MD)
│   ├── rag/                # Chunker, prompt builder
│   ├── storage/            # Local & Vercel Blob adapters
│   └── auth.ts             # Auth.js configuration
├── models/                 # Mongoose schemas (User, Document, Chat, Message, AppSettings)
├── services/               # Business logic (search, document processing)
└── types/                  # Shared TypeScript types
```

---

## ✅ Prerequisites

Before running the project, you will need accounts and API keys for:

- [Node.js](https://nodejs.org) **v18+**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (or local MongoDB)
- [Qdrant Cloud](https://cloud.qdrant.io) (free tier available)
- [Hugging Face](https://huggingface.co/settings/tokens) API token
- [Google Cloud Console](https://console.cloud.google.com) OAuth credentials (for Google sign-in)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Vasanth-2k01/KnowledgeHub-AI.git
cd KnowledgeHub-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
# Linux / macOS
cp .env.example .env

# Windows
copy .env.example .env
```

Open `.env` and fill in all required values (see [Environment Variables](#-environment-variables) below).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `AUTH_SECRET` | Secret key for Auth.js session signing | ✅ |
| `AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000`) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `QDRANT_URL` | Qdrant cluster URL | ✅ |
| `QDRANT_API_KEY` | Qdrant API key | ✅ |
| `HF_TOKEN` | Hugging Face Inference API token | ✅ |
| `STORAGE_PROVIDER` | `local` or `vercel-blob` | ✅ |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (only if using `vercel-blob`) | ⚠️ |

> Copy `.env.example` to `.env` as your starting point. Never commit your `.env` file.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">

Designed and built by **[Vasanth](https://github.com/Vasanth-2k01)** &nbsp;·&nbsp; [🌐 Live App](https://knowledgehub-ai-khaki.vercel.app)

</div>
