# AI Knowledge Workspace - Project Plan

## Project Goal

Build a production-ready AI Knowledge Workspace using Next.js 15 and RAG (Retrieval-Augmented Generation).

The primary objective is to learn and demonstrate:

- Next.js Full Stack Development
- Authentication
- AI Integration
- RAG Pipeline
- Vector Database
- Production Deployment

This project will be published on GitHub and showcased on LinkedIn.

---

# Tech Stack

## Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React

## Backend

- Next.js Route Handlers
- Server Actions

## Authentication

- Auth.js
- Google OAuth
- Credentials Login

## Database

- MongoDB
- Mongoose

## Vector Database

- Qdrant

## AI

Embedding Model:
- BAAI/bge-small-en-v1.5

LLM:
- Gemma (or another Hugging Face model)

## Validation

- Zod
- React Hook Form

---

# Development Rules

- Use TypeScript Strict Mode.
- Prefer Server Components.
- Use Client Components only when necessary.
- Use Server Actions for mutations where appropriate.
- Use Route Handlers for external APIs and streaming.
- Keep components reusable.
- Keep business logic separate from UI.
- Follow feature-based folder structure.
- Avoid duplicate code.
- Do not implement future phases unless requested.

---

# Folder Structure

src/

- app/
- components/
- actions/
- lib/
- models/
- hooks/
- services/
- validators/
- types/
- constants/
- config/

---

# Project Phases

## Phase 1

Project Setup

- Create Next.js project
- Configure Tailwind
- Configure shadcn/ui
- Configure ESLint
- Configure folder structure

---

## Phase 2

Authentication

- Register
- Login
- Google Login
- Protected Routes
- Logout

---

## Phase 3

Dashboard

- Sidebar
- Header
- Profile
- Settings
- Dashboard Layout

---

## Phase 4

RAG Foundation

- Upload PDF
- Extract Text
- Chunking
- Generate Embeddings
- Store vectors in Qdrant
- Store document metadata in MongoDB

---

## Phase 5

AI Chat

- Ask Questions
- Similarity Search
- Prompt Building
- LLM Integration
- Streaming Response
- Chat History

Goal:
Users can upload PDFs and chat with them.

At this point, the core RAG application is complete.

---

# Future Phases (After RAG)

## Phase 6

Document Management

- Rename Documents
- Delete Documents
- Processing Status

---

## Phase 7

Chat Improvements

- Markdown
- Code Highlighting
- Copy Response
- Regenerate Response
- Source Citations

---

## Phase 8

Sharing

- Public Share Link
- Disable Share Link

---

## Phase 9

Collaboration

- Invite Users
- Workspace
- Roles
- Shared Chats

---

## Phase 10

Production

- Responsive UI
- Dark Mode
- Deployment
- Performance Optimization
- Documentation

---

# RAG Flow

Upload PDF

↓

Extract Text

↓

Chunking

↓

Embedding Model

↓

Qdrant

↓

User Question

↓

Embedding Model

↓

Similarity Search

↓

Top K Chunks

↓

Prompt

↓

LLM

↓

Streaming Response

---

# Agent Instructions

- Implement only the requested phase.
- Do not implement future phases.
- Follow the folder structure.
- Follow Next.js best practices.
- Keep code clean and modular.
- Use reusable components.
- Use meaningful naming conventions.
- Add comments only where necessary.
- Ask for clarification instead of making assumptions.