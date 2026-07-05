---
title: "Linguagent — Adaptive AI Tutor for Language & Any Subject"
description: "A personalized, adaptive learning tutor built as a team of specialist AI agents on Google ADK and Gemini, assessing learners against the CEFR standard (or a mastery scale for any subject) and tutoring them with feedback grounded in real rubrics."
tags: ["AI Agents", "Google ADK", "Gemini", "Vertex AI", "EdTech", "Adaptive Learning", "Multi-Agent Systems", "RAG", "A2A", "MCP"]
year: "2026"
role: "Founder & Creator"
links:
  demo: "https://linguagent.com/"
  video: "https://youtu.be/kny7JoG8efA?si=wAgz1XUiOhQ2oyW5"
---

Linguagent is a personalized, adaptive learning tutor built as a team of specialist AI agents on Google ADK and Gemini. Its flagship is language, assessing learners against the CEFR standard, planning their day, and tutoring their writing, with every judgement grounded in a real rubric. The same adaptive engine teaches any subject or skill, and learners can ground any journey — language included — on their own resources: files, links, web research, text, or AI-generated content, making each journey as specific or as generic as they like. Behind every journey is a living learner model that updates after each practice turn and shows progress over time, in the learner's own language. Every agent is decoupled and exposed over A2A, so it's a B2C tutor today and a service institutions can call tomorrow, all running on Cloud Run and Vertex AI.

## Problem

Learning anything well at scale is either generic (one-size-fits-all courses that ignore your level, goals, and the material you actually care about) or expensive (1:1 tutoring). AI could close this gap, but most AI tutors generate ungrounded feedback — confident, but not anchored to any standard or to your own resources — and assume you already speak English to use them at all.

## Solution

Linguagent is a team of specialist AI agents behind one API that run the same adaptive loop for any learner:

**Assess → Score (grounded) → Plan → Tutor → Update the learner model → Show progress → Re-plan**

- **Assess** with a tailored, interest-themed diagnostic (a quick quiz, or self-rate).
- **Score** answers grounded in a real rubric, producing a structured learner profile (per-skill level + confidence + cited evidence).
- **Plan** a daily plan weighted to the learner's weakest, most goal-relevant skills, inside their time budget.
- **Tutor** the learner's work with prioritised, rubric-anchored feedback, feeding a measurable update back into the learner model after every attempt.

## Two Modes, One Engine

- **Language**, graded against the CEFR standard (reading, writing, grammar, vocabulary), grounded on CEFR descriptors and, optionally, the learner's own resources.
- **Subject / skill mastery**, for learning any subject or skill (a certification, a course, a topic), graded on a mastery scale (novice → expert) per area.

Every journey is shaped by the learner's own settings — what and why (target language or subject, goal, and interests that theme every question and activity), how it's graded (quick quiz or self-rate; CEFR or mastery), where the content comes from (the journey's Knowledge Bank: own files, web links, pasted text, or an autonomous web-research briefing — with a choice of how much to lean on it, from own-material-only to fully AI-generated), and feedback in the learner's own language with a plan sized to the minutes they have.

## Technologies

Google ADK, Gemini 2.5 Flash, Vertex AI, Cloud Run, Firestore, Firebase Authentication, Cloud Build, Artifact Registry, Google Search grounding, A2A (ADK `to_a2a`), MCP (Model Context Protocol) with the Tavily MCP server, FastAPI, Pydantic, Python 3.11, React + Vite + TypeScript, Zustand, Tailwind CSS, Firebase JS SDK, openapi-typescript.

## Data Sources

A curated CEFR rubric corpus (A1–C2; original descriptors, swappable for licensed sets or Vertex AI Search) that agents retrieve to ground scoring. Learners' own files, links, and text ground a journey via RAG. Live web comes from Tavily (MCP) and Google Search; Gemini 2.5 Flash (Vertex AI) handles generation. Cloud Firestore holds the learner model (skill state, history, snapshots, Knowledge Banks, usage), with Firebase Auth scoping each user's data.

## Findings

Grounding judgments in a real rubric, with cited evidence, is what makes the adaptive learner model trustworthy. In ADK, a structured-output agent is terminal (no tools), so each grounded step is a tool-using grader feeding a structured formatter. Real learning has a human mid-flow, so agents are orchestrated from the API layer rather than a single graph. Generic-vs-specific and language-vs-any-subject are just settings on one adaptive loop — scope grows, the architecture doesn't.

## Live Product

**Try it**: [linguagent.com](https://linguagent.com/) | **Demo video**: [YouTube](https://youtu.be/kny7JoG8efA?si=wAgz1XUiOhQ2oyW5)
