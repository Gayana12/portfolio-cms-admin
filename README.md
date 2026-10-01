# Portfolio CMS Admin Panel

A React admin dashboard for managing content in the Portfolio CMS backend.

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- React Router
- Axios (with JWT auto-attach and auto-refresh interceptors)

## Features
- JWT login with automatic access-token refresh using the stored refresh token
- Sidebar navigation across all content sections
- Full CRUD screens for: About, Skills, Projects, Blogs, Experience, Testimonials, Services
- Image upload control with two modes: upload a file, or paste an external image URL
- Draft/published toggle for Projects and Blogs, with admin-only draft visibility

## Running locally

1. Make sure the backend (portfolio-cms) is running at http://localhost:8080.
2. Install dependencies:
   npm install
3. Start the dev server:
   npm run dev
4. Open http://localhost:5173 and log in with the backend's admin credentials
   (default: admin@portfolio.com / Admin@123, unless changed via env vars on the backend).

## Project Structure
- src/api/client.js - Axios instance with JWT interceptors
- src/context/AuthContext.jsx - login/logout state
- src/components/ - shared UI (Layout, ImageUpload, StatusMessage)
- src/pages/ - one screen per content type

## Related repos
- Backend (Spring Boot): portfolio-cms
- Public portfolio (Next.js): portfolio-site
