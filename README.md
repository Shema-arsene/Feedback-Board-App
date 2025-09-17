# Public Feedback Board

A lightweight public feedback board where people can submit ideas, upvote, and comment — built with Next.js, Tailwind (shadcn), and MongoDB.

Designed to be simple, user friendly, and responsive, and easy to deploy.

[![Vercel](https://img.shields.io/badge/deploy-vercel-black.svg)](https://vercel.com)

## Demo

> Live demo: **`https://feedback-board-app-c4kw.vercel.app/`**

## Table of contents

- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)

---

## About

This project is a Public Feedback Board that allows visitors to:

- Submit feedback (title, description, category, tags)
- View a list of feedback items (cards)
- Upvote feedback (limited to one upvote per session via `localStorage`)
- Comment on feedback (comments stored in the DB)
- Filter and sort feedback

Authentication is **not required** — everything is public and simple by design.

---

## Features

**Required**

- Submit feedback via a form
- Persist feedback in MongoDB
- Display feedback list with upvote counts
- Upvote system using `localStorage` to prevent duplicate votes
- Category filter

**Bonus / Nice-to-have**

- Sorting (most upvoted, newest)
- Responsive layout (works on mobile)
- Commenting system (separate collection)
- Toasters via `sonner` for UX feedback
- Click spark effect (global click animation)

## Tech stack

- Frontend: **Next.js (App Router)**, React, TailwindCSS, and [shadcn/ui]
- Backend/API: **Next.js API routes** (App Router, route handlers)
- DB: **MongoDB Atlas** with **Mongoose**
- UI extras: `sonner` (toasts), `lucide-icons`
- Dev tooling: Node.js, npm/yarn, Vercel for deployment
