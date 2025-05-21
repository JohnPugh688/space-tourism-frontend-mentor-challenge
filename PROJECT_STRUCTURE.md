# Space Tourism Website - Remix Project Structure

## Overview

This is a Remix-based space tourism website that implements a multi-page experience following the Frontend Mentor challenge specifications. The project uses TypeScript, Tailwind CSS, Supabase for data storage, and modern web optimization techniques with a focus on responsive design, accessibility, and semantic HTML.

## Directory Structure

```
project-root/
├── app/
│   ├── components/         # Shared components
│   │   ├── header/         # Header-related components including navigation
│   │   │   ├── header.tsx  # Main header component
│   │   │   └── header-components/ # Sub-components used in the header
│   │   │       ├── logo.tsx            # Site logo with home link
│   │   │       └── mobile-menu.tsx     # Mobile navigation menu
│   │   └── shared/        # Global shared components
│   │       ├── OptimizedImage.tsx      # Image optimization component
│   │       ├── OptimizedBackground.tsx # Background image component
│   │       └── ErrorBoundary.tsx       # Shared error boundary component
│   ├── data/              # Data files and interfaces
│   ├── routes/            # Application routes using Remix file-based routing
│   │   ├── _layout/               # Base layout wrapper for all pages
│   │   │   └── route.tsx          # Layout component with header and transitions
│   │   ├── _layout._index/        # Homepage route
│   │   │   └── index.tsx          # Home page component
│   │   ├── _layout.destination/   # Destination page for planets
│   │   │   └── route.tsx          # Destination component with tabs
│   │   ├── _layout.crew/          # Crew page for team members
│   │   │   └── route.tsx          # Crew component with dot pagination
│   │   └── _layout.technology/    # Technology page with number navigation
│   │       └── route.tsx          # Technology component with horizontal/vertical layouts
│   ├── styles/            # Global styles
│   ├── tailwind.css       # Tailwind config and custom styles
│   ├── types/             # TypeScript type definitions
│   │   ├── crew.ts        # Crew member type definitions
│   │   ├── destination.ts # Destination type definitions
│   │   └── technology.ts  # Technology type definitions
│   ├── utils/             # Utility functions
│   │   ├── data.server.ts # Server-side data handling
│   │   └── supabase.ts    # Supabase client configuration
│   ├── entry.client.tsx   # Client entry point for hydration
│   ├── entry.server.tsx   # Server entry point for SSR
│   └── root.tsx           # Root component with global providers
├── public/                # Static assets
│   ├── shared/            # Shared assets like logo
│   ├── home/              # Home page specific assets
│   ├── destination/       # Destination images and backgrounds
│   ├── crew/              # Crew member images and backgrounds
│   └── technology/        # Technology images and backgrounds
│       ├── background-technology-*.webp    # Background images for each breakpoint
│       ├── image-*-portrait.webp           # Portrait orientation images (desktop)
│       └── image-*-landscape.webp          # Landscape orientation images (mobile/tablet)
├── .env                   # Environment variables (not tracked in Git)
├── .env.example           # Example environment variables file (tracked in Git)
└── package.json           # Project dependencies and scripts
```

## Key Patterns and Architecture

### 1. Routing Structure

The project uses Remix's file-based routing with a nested structure:

- `_layout/route.tsx`: Base layout component that wraps all pages
- `_layout._index/index.tsx`: Homepage component
- `_layout.[page]/route.tsx`: Individual page routes (destination, crew, technology)

This structure allows for:

- Shared layout across all pages
- Clean page transitions
- Consistent navigation state

### 2. Data Management

- **Data Source**: Content comes from Supabase database
- **Supabase Integration**:

  ```typescript
  // utils/supabase.ts
  import { createClient } from '@supabase/supabase-js'

  export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  ```

- **Data Access**:

  ```typescript
  // utils/data.server.ts
  import { supabase } from './supabase'

  export async function getCrew() {
    const { data, error } = await supabase.from('crew').select('*')

    if (error) throw error
    return data
  }

  // route.tsx
  export async function loader() {
    try {
      // SUPABASE VERSION: getCrew() now returns a Promise that resolves to an array of crew members
      const crew = await getCrew()

      if (!crew || crew.length === 0) {
        throw new Response('Data not found', { status: 404 })
      }

      return json({ crew })
    } catch (error) {
      console.error('Error loading data:', error)
      throw new Response('Error loading data', { status: 500 })
    }
  }
  ```

- **Data Consumption**:
  ```typescript
  const { crew } = useLoaderData<typeof loader>()
  ```
- **Error Handling**: Each route implements error boundaries to handle data loading issues

### 3. Component Patterns

#### Shared Components

1. **OptimizedBackground**:

   ```typescript
   <OptimizedBackground
     mobileImage={{ webp: '/path/mobile.webp', fallback: '/path/mobile.jpg' }}
     tabletImage={{ webp: '/path/tablet.webp', fallback: '/path/tablet.jpg' }}
     desktopImage={{ webp: '/path/desktop.webp', fallback: '/path/desktop.jpg' }}
     className="bg-cover bg-center bg-no-repeat min-h-screen opacity-25 mix-blend-screen"
   />
   ```

2. **OptimizedImage**:

   ```typescript
   <OptimizedImage
     webpSrc="/path/image.webp"
     fallbackSrc="/path/image.png"
     alt="Description"
     priority={true}
     onError={handleImageError}
     className="w-full max-w-[445px]"
   />
   ```

3. **ErrorBoundary**:
   ```typescript
   <ErrorBoundaryComponent
     defaultHeading="Custom Error Title"
     defaultMessage="Custom error message for this page."
     backgroundImages={{
       mobile: { webp: '/path/mobile.webp', fallback: '/path/mobile.jpg' },
       tablet: { webp: '/path/tablet.webp', fallback: '/path/tablet.jpg' },
       desktop: { webp: '/path/desktop.webp', fallback: '/path/desktop.jpg' },
     }}
   />
   ```

#### Page Structure Pattern

Each page follows this semantic structure:

```html
<main>
  <!-- Background -->
  <OptimizedBackground />

  <div className="container">
    <!-- Page Title -->
    <header>
      <h1><span>01</span> Page Title</h1>
    </header>

    <!-- Content -->
    <div className="content-layout">
      <!-- Left Content Section -->
      <article>
        <h2>Content Title</h2>
        <p>Description</p>
      </article>

      <!-- Right/Visual Section -->
      <figure className="visual-section">
        <img />
      </figure>

      <!-- Navigation Elements -->
      <nav aria-label="Section Navigation">
        <!-- Navigation Items -->
      </nav>
    </div>
  </div>
</main>
```

### 4. Responsive Design System

#### Breakpoints

- **Mobile**: Base styles (< 768px)
- **Tablet**: `md:` prefix (≥ 768px)
- **Desktop**: `lg:` prefix (≥ 1024px)
- **Extra Large**: `xl:` prefix (≥ 1280px) - Used sparingly

#### Container Widths

- **Max Width**: `max-w-[108rem]` (1728px) for overall containers
- **Content Areas**:
  - Mobile: `px-6` (24px padding)
  - Tablet: `md:px-10` (40px padding)
  - Desktop: `lg:px-40` (160px padding)

#### Spacing Scale

```css
/* Vertical Spacing Pattern */
pt-24 md:pt-36 lg:pt-48  /* Page top padding pattern */
gap-4 md:gap-6 lg:gap-8  /* Common spacing pattern */
mb-8 md:mb-14 lg:mb-0    /* Margin bottom pattern */
```

### 5. Typography System

#### Font Families

- **Headers**: `font-bellefair` (Bellefair)
- **Navigation/Labels**: `font-barlow-condensed` (Barlow Condensed)
- **Body Text**: `font-barlow` (Barlow)

#### Type Scale

```css
/* Heading Scale */
text-[80px] md:text-[150px]              /* Main headings */
text-[40px] md:text-[80px] lg:text-[100px] /* Sub headings */
text-2xl md:text-[40px] lg:text-[56px]    /* Section headings */

/* Body Text Scale */
text-[15px] md:text-base lg:text-[18px]   /* Body text */
leading-6 md:leading-7 lg:leading-[32px]  /* Line heights */

/* Letter Spacing */
tracking-[2.7px] md:tracking-[3.38px] lg:tracking-[4.725px] /* Label tracking */
```

### 6. Color System

```css
/* Main Colors */
bg-[#0B0D17]  /* Background/Dark */
text-white    /* Primary text */
text-[#D0D6F9] /* Secondary text */
bg-[#383B4B]  /* Dividers/Borders */

/* Opacity Variants */
opacity-25    /* Used for numbering */
opacity-[0.17] /* Used for inactive states */
bg-white/10   /* Background overlays */
```

### 7. Interactive Patterns

#### Navigation States

- **Default**: `text-[#D0D6F9] border-transparent`
- **Hover**: `hover:border-white/50` or `hover:opacity-50`
- **Active**: `text-white border-white` or `bg-white`

#### Dots Navigation (Crew Page)

```html
<nav aria-label="Crew member navigation">
  {crew.map((member, index) => ( <button key={index} onClick={() => handleCrewChange(index)} className={`w-[0.9375rem]
  h-[0.9375rem] rounded-full transition-opacity ${ index === currentIndex ? 'bg-white' : 'bg-white opacity-[0.17]
  hover:opacity-50' }`} aria-label={`View ${member.name}, ${member.role}`} aria-current={index === currentIndex ? 'true'
  : 'false'} /> ))}
</nav>
```

#### Numbers Navigation (Technology Page)

```html
<nav aria-label="Technology Navigation">
  {[0, 1, 2].map((index) => (
    <button
      key={index}
      onClick={() => handleChange(index)}
      aria-current={index === currentIndex ? 'true' : 'false'}
      className={`rounded-full border ${
        index === currentIndex
          ? 'bg-white text-[#0B0D17] border-white'
          : 'text-white border-white/25 hover:border-white hover:bg-white/10'
      }`}
    >
      {index + 1}
    </button>
  ))}
</nav>
```

#### Tabs Navigation (Destination Page)

```html
<nav aria-label="Destination navigation">
  <ul className="flex justify-center lg:justify-start gap-6 md:gap-8">
    {destinations.map((destination) => (
      <li key={destination.name}>
        <button
          onClick={() => handleDestinationChange(destination)}
          className={`pb-2 border-b-[3px] transition-all ${
            currentDestination.name === destination.name
              ? 'text-white border-white'
              : 'text-[#D0D6F9] border-transparent hover:border-white/50'
          }`}
          aria-current={currentDestination.name === destination.name ? 'true' : 'false'}
        >
          {destination.name}
        </button>
      </li>
    ))}
  </ul>
</nav>
```

### 8. Page-Specific Layouts

#### Home Page

- Large "Explore" button in circle shape
- Hover effect with scaling background ring
- Content on left, button on right for desktop
- Vertical stacking for mobile/tablet

#### Destination Page

- Planet image on top for mobile/tablet, left for desktop
- Tab navigation for switching planets
- Stats displayed in two columns (desktop) or stack (mobile)

#### Crew Page

- Image at bottom for mobile, top-right for desktop
- Dot navigation for switching crew members
- Role and name hierarchy with bio text
- Border line below image on mobile only

#### Technology Page

- Landscape image at top for mobile/tablet
- Portrait image at right for desktop
- Numbered horizontal navigation for mobile/tablet
- Numbered vertical navigation for desktop
- Max image width of 34.375rem (550px)

### 9. Error Handling

- Each route implements error boundaries
- Shared ErrorBoundary component for consistent styling
- Different error messages based on error type (404, 500)
- Proper handling of data loading errors
- Image error fallbacks for missing images

### 10. Accessibility Features

- Semantic HTML structure (`<main>`, `<nav>`, `<article>`, etc.)
- ARIA attributes for interactive elements
- Proper heading hierarchy
- Alt text for all images
- Keyboard navigation support
- Focus management for interactive elements

## Page Component Examples

### Destination Page Key Features

```typescript
// State management
const [currentDestination, setCurrentDestination] = useState(destinations[0])
const [isTransitioning, setIsTransitioning] = useState(false)

// Smooth transitions
const handleDestinationChange = (destination) => {
  setIsTransitioning(true)
  setTimeout(() => {
    setCurrentDestination(destination)
    setTimeout(() => setIsTransitioning(false), 50)
  }, 300)
}
```

### Crew Page Key Features

```typescript
// Mobile vs. desktop layout
<article className="order-2 md:order-1 lg:order-1 text-center md:text-center lg:text-left">
  {/* Content */}
</article>

<figure className="order-1 md:order-2 lg:order-2">
  {/* Image */}
</figure>

// Navigation dots position
<nav className="hidden md:flex gap-4 justify-center lg:justify-start lg:mt-auto lg:mb-20 md:mt-10">
  {/* Dots */}
</nav>
```

### Technology Page Key Features

```typescript
// Mobile/tablet landscape image
<section className="block lg:hidden w-full mt-8 md:mt-14">
  {/* Landscape image */}
</section>

// Desktop portrait image
<section className="hidden lg:block lg:flex-1 lg:max-w-[50%]">
  {/* Portrait image with max-width */}
  <img className="w-full max-w-[34.375rem] h-[527px]" />
</section>

// Flexible layout
<article className="lg:flex-1">
  {/* Content */}
</article>
```

## Future Extensions

When updating the project in the future:

1. **Adding New Pages**:

   - Create a new route folder in `app/routes/_layout.[page-name]/`
   - Follow the established semantic HTML structure
   - Implement responsive design following existing patterns
   - Add appropriate error handling

2. **Modifying Components**:

   - Maintain accessibility attributes
   - Keep responsive classes consistent
   - Follow established naming conventions
   - Use existing color and spacing system

3. **Enhancing Data**:

   - Update types in `app/types/`
   - Add loaders and error handling
   - Consider data fetching performance

4. **Improving Performance**:
   - Optimize image loading with priority flags
   - Use transitions for smoother UX
   - Implement proper error boundaries

This structure ensures consistency, maintainability, and adherence to web best practices throughout the project.
