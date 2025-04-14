import fs from 'fs';
import path from 'path';
export { renderers } from '../../renderers.mjs';

// API endpoint for managing shifts

/**
 * Process POST requests to save shift data
 */
async function POST({ request }) {
  try {
    // Get the shift data from the request
    const shift = await request.json();
    
    // Create data directory structure if it doesn't exist
    const dataDir = path.join(process.cwd(), 'public/data');
    const shiftsDir = path.join(dataDir, 'shifts');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    if (!fs.existsSync(shiftsDir)) {
      fs.mkdirSync(shiftsDir);
    }

    // Handle saving based on whether the shift is active or completed
    if (shift.endTime) {
      // This is a completed shift, save to a month directory
      const shiftDate = new Date(shift.date);
      const monthDir = `${String(shiftDate.getMonth() + 1).padStart(2, '0')}-${shiftDate.getFullYear()}`;
      const monthPath = path.join(shiftsDir, monthDir);
      
      // Create month directory if it doesn't exist
      if (!fs.existsSync(monthPath)) {
        fs.mkdirSync(monthPath);
      }
      
      // Format the filename: DD-MM-YY-Type_ID.json
      const day = String(shiftDate.getDate()).padStart(2, '0');
      const month = String(shiftDate.getMonth() + 1).padStart(2, '0');
      const year = String(shiftDate.getFullYear()).slice(2);
      const fileName = `${day}-${month}-${year}-${shift.type}_${shift.id}.json`;
      
      // Save the shift to file
      fs.writeFileSync(path.join(monthPath, fileName), JSON.stringify(shift, null, 2));
      
      // If this was previously the current shift, remove the current_shift.json file
      const currentShiftPath = path.join(shiftsDir, 'current_shift.json');
      if (fs.existsSync(currentShiftPath)) {
        const currentShift = JSON.parse(fs.readFileSync(currentShiftPath, 'utf8'));
        if (currentShift.id === shift.id) {
          fs.unlinkSync(currentShiftPath);
        }
      }
    } else {
      // This is an active shift, save to current_shift.json
      fs.writeFileSync(path.join(shiftsDir, 'current_shift.json'), JSON.stringify(shift, null, 2));
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error saving shift:", error);
    return new Response(JSON.stringify({ error: 'Failed to save shift' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

/**
 * Process GET requests to retrieve a specific shift
 */
async function GET({ params }) {
  try {
    const { id } = params;
    
    // If no ID is provided, return an error
    if (!id) {
      return new Response(JSON.stringify({ error: 'Shift ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const shiftsDir = path.join(process.cwd(), 'public/data/shifts');
    
    // First, check if this is the current shift
    const currentShiftPath = path.join(shiftsDir, 'current_shift.json');
    if (fs.existsSync(currentShiftPath)) {
      const currentShift = JSON.parse(fs.readFileSync(currentShiftPath, 'utf8'));
      if (currentShift.id === id) {
        return new Response(JSON.stringify(currentShift), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
    
    // If not the current shift, search through the month directories
    const monthDirs = fs.readdirSync(shiftsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.match(/^\d{2}-\d{4}$/))
      .map(dirent => dirent.name);
    
    for (const monthDir of monthDirs) {
      const monthPath = path.join(shiftsDir, monthDir);
      const shiftFiles = fs.readdirSync(monthPath)
        .filter(file => file.endsWith('.json'));
      
      for (const shiftFile of shiftFiles) {
        const shiftData = JSON.parse(fs.readFileSync(path.join(monthPath, shiftFile), 'utf8'));
        if (shiftData.id === id) {
          return new Response(JSON.stringify(shiftData), {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      }
    }
    
    // If we get here, the shift was not found
    return new Response(JSON.stringify({ error: 'Shift not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("API error retrieving shift:", error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve shift' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
