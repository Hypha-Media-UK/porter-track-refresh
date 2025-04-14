# Porter Track (Astro + Vue)

A shift tracking application built with Astro and Vue.js, configured for deployment on Netlify.

## Project Overview

This application allows users to track shifts and tasks. It uses:

- **Astro**: As the framework with server-side rendering
- **Vue.js**: For interactive components
- **Pinia**: For state management
- **date-fns**: For date formatting and manipulation
- **Netlify**: For deployment with serverless functions

## Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Preview the production build:
   ```
   npm run preview
   ```

## Deployment to Netlify

This project is configured for seamless deployment on Netlify using the Astro Netlify adapter.

### Automatic Deployment (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Log in to Netlify and click "New site from Git"
3. Select your repository and configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (Netlify will automatically detect the Astro site configuration)

### Manual Deployment

You can also deploy manually using the Netlify CLI:

1. Install the Netlify CLI:
   ```
   npm install netlify-cli -g
   ```

2. Build the project:
   ```
   npm run build
   ```

3. Deploy to Netlify:
   ```
   netlify deploy
   ```
   
## Key Configuration Files

- **netlify.toml**: Contains build settings, redirect rules, and function configuration
- **build.sh**: Custom build script that ensures _redirects file is properly created
- **astro.config.mjs**: Configured with the Netlify adapter for server-side rendering

## API Endpoints

The application uses server-side API endpoints:

- `/api/loadShiftData`: Loads all shift data 
- `/api/shifts`: Manages shifts (create, complete)
- `/api/shifts/task`: Manages tasks within shifts

These endpoints are handled by the Netlify adapter as serverless functions.

## Data Structure

Shift data is stored in JSON files in the `public/data/shifts` directory:
- Active shift in `current_shift.json`
- Completed shifts organized by month in `MM-YYYY/` subdirectories
