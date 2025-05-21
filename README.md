# Space Tourism Website - Remix Implementation

![Space Tourism Website Preview](https://github.com/JohnPugh688/space-tourism-frontend-mentor-challenge/blob/main/public/preview.jpg?raw=true)

## Overview

This is my solution to the [Space tourism website challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/space-tourism-multipage-website-gRWj1URZ3). The project is a multi-page website for a fictional space tourism company, featuring information about space destinations, crew members, and technology.

### [Live Demo](https://practise-remix-project-3d7gu7bey-johnh4pugh-gmailcoms-projects.vercel.app/)

## Features

- **Responsive Design**: Optimized layouts for mobile, tablet, and desktop viewports
- **Interactive Elements**: Tab-based navigation, dot sliders, numbered navigation
- **Modern UI**: Implementing the Figma design with pixel-perfect accuracy
- **Accessibility**: Semantic HTML structure and ARIA attributes for screen readers
- **Performance Optimized**: Image optimization and responsive loading strategies
- **Database Integration**: Data stored and retrieved from Supabase

## Built with

- [Remix](https://remix.run/) - Full stack React framework
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://reactjs.org/) - JavaScript library for user interfaces
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- Semantic HTML5 markup
- CSS Flexbox and Grid
- Mobile-first workflow

## Project Structure

The project follows a well-organized structure:

```
project-root/
├── app/
│   ├── components/         # Shared components
│   ├── routes/             # Remix routes for each page
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Helper functions
│   │   └── supabase.ts     # Supabase client configuration
├── public/                 # Static assets
├── .env                    # Environment variables (not tracked in Git)
└── ...
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

- Node.js v14+ and npm
- Supabase account for database access

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

3. Set up environment variables

   Create a `.env` file in the root directory with the following variables:

   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Building for production

```bash
npm run build
```

## Key Implementation Details

### Responsive Design System

- Mobile-first approach with breakpoints at 768px (tablet) and 1024px (desktop)
- Consistent spacing system throughout the application
- Flexible layouts that adapt to different screen sizes

### Component Architecture

- Reusable components for common UI elements
- Shared background image component with responsive options
- Error boundary components for graceful error handling

### Data Management

- Supabase integration for database storage and retrieval
- Environment variables for secure credential management
- Asynchronous data fetching patterns

### Navigation Patterns

- Tab-based navigation for destinations
- Dot slider for crew members
- Numbered navigation for technology items

### Accessibility Features

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Proper heading hierarchy

## What I Learned

This project provided valuable experience in:

- Implementing complex UI designs with Remix and Tailwind
- Building responsive layouts that work across multiple device sizes
- Creating accessible navigation patterns
- Handling image optimization for different screen sizes
- Structuring a Remix project for scalability and maintainability
- Integrating Supabase for database functionality

## Future Enhancements

- Add animations for smoother page transitions
- Implement a dark/light mode toggle
- Add unit and integration tests
- Improve performance with advanced image optimization techniques
- Enhance database schema with additional content types

## Author

- GitHub - [JohnPugh688](https://github.com/JohnPugh688)
- Frontend Mentor - [@JohnPugh688](https://www.frontendmentor.io/profile/JohnPugh688)

## Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io) for providing the challenge
- [Remix](https://remix.run/) team for the amazing framework
- [Supabase](https://supabase.com/) for the powerful database platform

---

This project was implemented as a portfolio piece to demonstrate skills in modern web development.
