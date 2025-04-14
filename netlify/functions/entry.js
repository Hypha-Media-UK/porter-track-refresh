// Entry point for Astro SSR on Netlify
export const handler = async function(event, context) {
  // This is a placeholder that should be replaced by Astro's build process
  // If you're seeing this response, the function wasn't properly replaced
  
  console.log("Request path:", event.path);
  console.log("Request headers:", event.headers);
  
  // Redirect to the Astro SSR function
  return {
    statusCode: 302,
    headers: {
      Location: '/.netlify/functions/ssr' + event.path
    },
    body: ''
  };
};
