# Space Tourism Website - React Router 7 Implementation

![Space Tourism Website Preview](https://github.com/JohnPugh688/space-tourism-frontend-mentor-challenge/blob/main/public/preview.jpg?raw=true)

## Overview

This is my solution to the [Space tourism website challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/space-tourism-multipage-website-gRWj1URZ3). The project is a multi-page website for a fictional space tourism company, featuring information about space destinations, crew members, and technology.

**Recently migrated from Remix to React Router 7** - the official successor framework with React 19 support.

### [Live Demo](https://practise-remix-project-3d7gu7bey-johnh4pugh-gmailcoms-projects.vercel.app/)

## Features

- **Responsive Design**: Optimized layouts for mobile, tablet, and desktop viewports
- **Interactive Elements**: Tab-based navigation, dot sliders, numbered navigation
- **Modern UI**: Implementing the Figma design with pixel-perfect accuracy
- **Accessibility**: Semantic HTML structure and ARIA attributes for screen readers
- **Performance Optimized**: Image optimization and responsive loading strategies
- **Supabase Integration**: Full database integration for learning modern backend patterns
- **React 19**: Latest React features including React Compiler and enhanced SSR
- **Real-time Data**: Dynamic content loading from Supabase PostgreSQL database

## Built with

- [React Router 7](https://reactrouter.com/) - Latest full-stack React framework (successor to Remix)
- [React 19.1](https://react.dev/) - Latest React with new features
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS v4.1](https://tailwindcss.com/) - Utility-first CSS framework with simplified configuration
- [Vite 6](https://vitejs.dev/) - Fast build tool and dev server
- [Supabase](https://supabase.com/) - Open source Firebase alternative (optional)
- Semantic HTML5 markup
- CSS Flexbox and Grid
- Mobile-first workflow

## Project Structure

The project follows a well-organized React Router 7 structure:

```
project-root/
├── app/
│   ├── components/         # Shared components
│   ├── routes/             # React Router 7 file-based routing
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Helper functions
│   ├── data/               # Static data (simplified approach)
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
├── .env                    # Environment variables (not tracked in Git)
└── react-router.config.ts  # React Router 7 configuration
```

For a detailed explanation of the project structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md).

## Screenshots

### Home Page

![Home Page](screenshots/home.webp)

### Destination Page

![Destination Page](screenshots/destination.webp)

### Crew Page

![Crew Page](screenshots/crew.webp)

### Technology Page

![Technology Page](screenshots/technology.webp)

## Getting Started

### Prerequisites

- Node.js v18+ and npm
- Supabase account for database access (optional)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/JohnPugh688/space-tourism-frontend-mentor-challenge.git
   cd space-tourism-frontend-mentor-challenge
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables (optional for Supabase)

   Create a `.env` file in the root directory with the following variables:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view it in the browser

### Building for production

```bash
npm run build
```

## Key Implementation Details

### React Router 7 Architecture

- **File-based routing** with nested layouts
- **Server-side rendering** with React 19 features
- **Simplified configuration** compared to Remix
- **Type-safe routing** with automatic type generation

### Responsive Design System

- Mobile-first approach with breakpoints at 768px (tablet) and 1024px (desktop)
- Consistent spacing system throughout the application
- Flexible layouts that adapt to different screen sizes

### Component Architecture

- Simplified shared components for better maintainability
- Reusable navigation patterns with custom hooks
- Error boundary components for graceful error handling

### Data Management

- **Primary: Supabase PostgreSQL** for learning modern database patterns
- **Server-side data fetching** with comprehensive error handling
- **Type-safe database queries** with TypeScript interfaces
- **Real-time capabilities** ready for future enhancements
- **Static data fallback** for development and testing

### Navigation Patterns

- Tab-based navigation for destinations
- Dot slider for crew members
- Numbered navigation for technology items
- Unified navigation hook for consistency

### Accessibility Features

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Proper heading hierarchy

## What I Learned

This project provided valuable experience in:

- **Supabase Integration**: Learning PostgreSQL database management, real-time subscriptions, and server-side data fetching
- **Modern Database Patterns**: Type-safe queries, error handling, and data transformation
- **Migrating from Remix to React Router 7** and understanding the evolution
- **React 19 features** including the React Compiler and enhanced SSR
- **Tailwind CSS v4.1** with simplified configuration
- Building responsive layouts that work across multiple device sizes
- Creating accessible navigation patterns
- Handling image optimization for different screen sizes
- Structuring a modern React project for scalability and maintainability
- **Database-driven applications** with proper error boundaries and loading states

## Recent Improvements

### React Router 7 Migration

- ✅ Updated from Remix 2.x to React Router 7
- ✅ Simplified configuration with `react-router.config.ts`
- ✅ Updated to React 19.1 with latest features
- ✅ Streamlined build process with Vite 6

### Code Simplification

- ✅ Simplified OptimizedImage component
- ✅ Consolidated data management approach
- ✅ Created reusable navigation hook
- ✅ Reduced component complexity
- ✅ Standardized development workflow

## Future Enhancements

- Add animations for smoother page transitions
- Implement a dark/light mode toggle
- Add unit and integration tests
- Improve performance with advanced image optimization techniques
- Enhance database schema with additional content types
- Add React 19 concurrent features

## Author

- GitHub - [JohnPugh688](https://github.com/JohnPugh688)
- Frontend Mentor - [@JohnPugh688](https://www.frontendmentor.io/profile/JohnPugh688)

## Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io) for providing the challenge
- [React Router](https://reactrouter.com/) team for the amazing framework
- [Supabase](https://supabase.com/) for the powerful database platform

---

This project was implemented as a portfolio piece to demonstrate skills in modern web development with the latest React ecosystem.
