# Space Tourism - Mission Control Feature

## Overview

Mission Control is a members-only section of the Space Tourism website that provides exclusive content and features to registered users. The design will follow the existing space tourism aesthetic while introducing new interactive elements.

## Features

### 1. Authentication

- **Sign Up**

  - Email/Password registration
  - Optional: Social auth (GitHub, Google)
  - Username selection
  - Welcome email

- **Login/Logout**

  - Email/Password login
  - Remember me option
  - Secure session management
  - Clear logout process

- **User Profile**
  - Profile picture
  - Display name
  - Join date
  - Achievement showcase
  - Mission participation history

### 2. Mission Control Dashboard

#### Layout

- Follows existing site design patterns
- Dark theme with accent colors
- Grid-based layout for different sections
- Responsive design (mobile, tablet, desktop)

#### Components

1. **Mission Status Panel**

   - Current active missions
   - Upcoming launches
   - Mission countdown timers
   - Basic info (public)
   - Detailed info (members only)

2. **Achievement System**

   - **Badges**
     - Space Cadet (new member)
     - Mission Observer (viewed 10 missions)
     - Cosmic Explorer (active for 30 days)
     - Star Navigator (completed profile)
     - Mission Specialist (participated in community)
   - Badge showcase section
   - Progress tracking
   - Unlock animations

3. **Behind the Scenes Content**

   - Exclusive crew interviews
   - Technical deep-dives
   - Training footage
   - Mission preparation insights

4. **Interactive Features**
   - Virtual Mission Simulator
   - Space Knowledge Quiz
   - Mission Planning Tool

## Database Schema (Current Implementation)

### Public Tables

```sql
missions
  - id: uuid PRIMARY KEY
  - created_at: timestamptz
  - name: text
  - launch_date: timestamp
  - status: text
  - basic_description: text
  - thumbnail_url: text

badges
  - id: uuid PRIMARY KEY
  - name: text
  - description: text
  - image_url: text
  - requirements: jsonb
  - tier: integer
```

### Protected Tables (Members Only)

```sql
mission_details
  - id: uuid PRIMARY KEY
  - mission_id: uuid REFERENCES missions(id)
  - classified_info: text
  - technical_specs: jsonb
  - behind_scenes_content: text
  - member_notes: text

user_profiles
  - id: uuid PRIMARY KEY
  - user_id: uuid UNIQUE
  - display_name: text
  - avatar_url: text
  - created_at: timestamptz

user_achievements
  - id: uuid PRIMARY KEY
  - created_at: timestamptz
  - user_id: uuid REFERENCES user_profiles(id)
  - badge_id: uuid REFERENCES badges(id)
  - progress: integer
  - earned_date: timestamptz
  - updated_at: timestamptz

user_mission_progress
  - id: uuid PRIMARY KEY
  - created_at: timestamptz
  - updated_at: timestamptz
  - user_id: uuid REFERENCES user_profiles(id)
  - mission_id: uuid REFERENCES missions(id)
  - last_viewed_at: timestamptz
  - completion_percentage: integer
  - UNIQUE(user_id, mission_id)
```

## Current RLS Policies

### Public Access

- `missions`: Read access for all
- `badges`: Read access for all
- `crew_members`: Read access for all
- `destinations`: Read access for all
- `technologies`: Read access for all

### Authenticated Access

- `mission_details`: Read access for authenticated users
- `user_profiles`: Users can read/update their own profiles
- `user_achievements`: Users can view their own achievements
- `user_mission_progress`: Users can view/update their own progress

## Design Assets Needed

### Images

1. Badge Icons

   - Vector-based achievement badges
   - Multiple tiers (bronze, silver, gold)
   - Space-themed designs

2. Mission Control UI

   - Dashboard background
   - Section dividers
   - Interactive element graphics
   - Loading states/animations

3. Content Images
   - Mission thumbnails
   - Behind-the-scenes photos
   - Technical diagrams
   - Profile picture placeholders

### Image Resources

- FontAwesome (for icons and badges)
- Unsplash Space Collection
- NASA Image Gallery (public domain)
- SpaceX Media Gallery

## Development Phases

### Phase 1: Foundation

1. Create Mission Control route
2. Set up basic page layout
3. Implement Supabase auth
4. Create database tables

### Phase 2: Core Features

1. User registration/login flow
2. Protected routes setup
3. Basic mission display
4. Profile system

### Phase 3: Achievement System

1. Badge system implementation
2. Progress tracking
3. Achievement notifications
4. Badge showcase

### Phase 4: Enhanced Content

1. Behind-the-scenes section
2. Interactive features
3. Member-only content areas
4. Mission details expansion

### Phase 5: Polish

1. Loading states
2. Error handling
3. Animations
4. Performance optimization
5. Accessibility improvements

## Technical Considerations

### Authentication Flow

1. User clicks Sign Up/Login
2. Supabase auth handles credentials
3. Create user profile on success
4. Redirect to Mission Control
5. Handle session persistence

### Protected Routes

- Use Remix loader authentication checks
- Redirect unauthorized users
- Handle loading states
- Maintain user session

### Performance

- Lazy load member-only content
- Optimize image delivery
- Cache appropriate data
- Minimize database queries

### Security

- Row Level Security (RLS) policies
- Input validation
- XSS prevention
- CSRF protection
- Rate limiting

## Next Steps

### Phase 1: Authentication UI (Next)

1. Create Sign Up component
   - Email/Password form
   - Username selection
   - Profile creation
2. Create Login component
   - Email/Password form
   - Remember me option
3. Add authentication state management
4. Implement protected routes

### Phase 2: Mission Control Dashboard

1. Create dashboard layout
2. Implement mission list view
   - Public mission info
   - Member-only content indicators
3. Add achievement display
   - Badge showcase
   - Progress indicators
4. Create user profile section

### Phase 3: Mission Details

1. Create mission detail view
2. Implement progress tracking
3. Add behind-the-scenes content
4. Create achievement notifications

### Phase 4: Polish & Optimization

1. Add loading states
2. Implement error handling
3. Add animations for achievements
4. Optimize data fetching
5. Add responsive design improvements

## Technical Implementation Notes

### Database Structure

- All tables implemented with UUID primary keys
- Timestamps for creation and updates
- Foreign key relationships established
- Unique constraints where needed

### Security

- RLS policies implemented for all tables
- Authentication flow ready for frontend implementation
- Row-level access control for user data
- Public/private data separation maintained

### Next Technical Tasks

1. Set up Supabase client in frontend
2. Implement authentication context
3. Create protected route middleware
4. Design reusable components for mission display
5. Implement real-time updates for achievements
