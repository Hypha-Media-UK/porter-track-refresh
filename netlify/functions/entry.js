// Entry point for Astro SSR on Netlify
export const handler = async function(event, context) {
  // This is a placeholder that should be replaced by Astro's build process
  // If you're seeing this response, the function wasn't properly replaced
  
  console.log("Request path:", event.path);
  
  // Return a meaningful error message instead of redirecting
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Porter Track</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 650px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
          h1 { color: #4f46e5; }
          code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>Porter Track Deployment Diagnostic</h1>
        <p>The Astro SSR function isn't functioning correctly. This is a placeholder from the entry.js function.</p>
        <p>The build process should replace this function with the compiled Astro application.</p>
        <p>Request path: <code>${event.path}</code></p>
        <p>Check your Netlify deployment settings and build logs.</p>
      </body>
    </html>
    `
  };
};
