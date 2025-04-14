import fs from 'fs';
import path from 'path';
export { renderers } from '../../renderers.mjs';

// API endpoint to load shift data

/**
 * Loads all shift data from the data directory
 * This includes active and completed shifts
 */
async function GET() {
  try {
    console.log("API: Loading shift data");
    const shiftsData = [];
    const shiftsDir = path.join(process.cwd(), 'public/data/shifts');
    
    // Check if directory exists
    if (!fs.existsSync(shiftsDir)) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // First, check if there's a current active shift
    const currentShiftPath = path.join(shiftsDir, 'current_shift.json');
    if (fs.existsSync(currentShiftPath)) {
      try {
        const currentShiftData = JSON.parse(fs.readFileSync(currentShiftPath, 'utf8'));
        shiftsData.push(currentShiftData);
      } catch (error) {
        console.error("Error loading current shift:", error);
      }
    }
    
    // Then load all completed shifts from the month directories
    const monthDirs = fs.readdirSync(shiftsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.match(/^\d{2}-\d{4}$/))
      .map(dirent => dirent.name);
    
    for (const monthDir of monthDirs) {
      const monthPath = path.join(shiftsDir, monthDir);
      const shiftFiles = fs.readdirSync(monthPath)
        .filter(file => file.endsWith('.json'));
      
      for (const shiftFile of shiftFiles) {
        try {
          const shiftData = JSON.parse(fs.readFileSync(path.join(monthPath, shiftFile), 'utf8'));
          shiftsData.push(shiftData);
        } catch (error) {
          console.error(`Error loading shift file ${shiftFile}:`, error);
        }
      }
    }
    
    console.log(`API: Loaded ${shiftsData.length} shifts`);
    return new Response(JSON.stringify(shiftsData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error loading shift data:", error);
    return new Response(JSON.stringify({ error: 'Failed to load shift data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
