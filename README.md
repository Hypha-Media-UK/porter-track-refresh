# Porter Track

A modern hospital transportation task management application built with Astro.js and Vue.js.

## Overview

Porter Track is designed to help hospital porters and supervisors efficiently manage transportation tasks within a hospital setting. The application provides a streamlined interface for creating, tracking, and completing various types of transportation tasks, such as patient transfers, sample deliveries, and equipment movement.

## Key Features

- **Shift Management**: Create and manage Day and Night shifts with supervisor assignment
- **Task Tracking**: Create, assign, and track transportation tasks throughout the hospital
- **Real-time Updates**: Monitor pending and completed tasks in real-time
- **Archived Shifts**: Access historical shift data and task completion records
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Astro.js**: Fast, modern static site generator with excellent Vue.js integration
- **Vue.js 3**: Progressive JavaScript framework using the Composition API
- **TypeScript**: Type-safe JavaScript for improved development experience
- **Pinia**: State management for Vue.js applications
- **SCSS**: Advanced styling with variables, mixins, and nesting
- **date-fns**: Modern JavaScript date utility library

## Architecture Improvements

The application has been completely rearchitected with the following improvements:

1. **Component Structure**: Modular components with clear separation of concerns
2. **Type Safety**: Comprehensive TypeScript interfaces and types
3. **State Management**: Centralized store with Pinia for predictable state mutations
4. **API Layer**: RESTful API endpoints for data persistence
5. **Responsive Design**: Mobile-first approach with responsive UI components
6. **Performance Optimization**: Lazy-loaded components and efficient data handling
7. **Code Organization**: Logical file structure with clear naming conventions

## Directory Structure

```
porter-track/
├── public/            # Static assets and data files
│   ├── data/          # JSON data storage
│   │   └── shifts/    # Shift and task data
├── src/               
│   ├── components/    # Vue components
│   ├── layouts/       # Astro layout templates
│   ├── models/        # TypeScript interfaces and types
│   ├── pages/         # Astro pages and API routes
│   │   └── api/       # API endpoints
│   ├── stores/        # Pinia stores
│   ├── styles/        # Global SCSS files
│   └── utils/         # Utility functions
```

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Endpoints

- `GET /api/loadShiftData`: Get all shifts
- `GET /api/shifts/:id`: Get a specific shift
- `POST /api/shifts`: Create or update a shift
- `GET /api/shifts/task/:id`: Get a specific task
- `POST /api/shifts/task`: Create, update or change status of a task
