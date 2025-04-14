export default async (request, context) => {
  // Pass through to the main Netlify Function (SSR handler)
  const url = new URL(request.url);
  
  // If making API requests, forward to the Netlify Function without modification
  if (url.pathname.startsWith('/api/')) {
    return context.next();
  }
  
  try {
    // Forward to the SSR handler
    return await context.next();
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(`Server Error: ${error.message}`, { status: 500 });
  }
};
