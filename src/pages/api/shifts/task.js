// API endpoint for managing tasks within shifts
import fs from 'fs';
import path from 'path';

/**
 * Process POST requests to save task changes
 */
export async function POST({ request }) {
  try {
    // Get the task data from the request
    const { taskId, updates, action = 'update' } = await request.json();
    
    // Make sure we have the necessary data
    if (!taskId) {
      return new Response(JSON.stringify({ error: 'Task ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get the paths to our data directories
    const shiftsDir = path.join(process.cwd(), 'public/data/shifts');
    
    // First, check if this task is in the current shift
    const currentShiftPath = path.join(shiftsDir, 'current_shift.json');
    if (fs.existsSync(currentShiftPath)) {
      const currentShift = JSON.parse(fs.readFileSync(currentShiftPath, 'utf8'));
      const taskIndex = currentShift.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        // Found the task in the current shift
        if (action === 'update') {
          // Update the task with the new data
          currentShift.tasks[taskIndex] = {
            ...currentShift.tasks[taskIndex],
            ...updates
          };
        } else if (action === 'add') {
          // Add a new task (should not happen here but just in case)
          currentShift.tasks.push(updates);
        } else if (action === 'delete') {
          // Remove the task
          currentShift.tasks.splice(taskIndex, 1);
        } else if (action === 'set_status') {
          // Update task status and completion time if needed
          currentShift.tasks[taskIndex].status = updates.status;
          if (updates.status === 'Completed' && updates.completedTime) {
            currentShift.tasks[taskIndex].completedTime = updates.completedTime;
          } else if (updates.status === 'Pending') {
            // Remove completedTime if task is set back to pending
            delete currentShift.tasks[taskIndex].completedTime;
          }
        }
        
        // Save the updated shift
        fs.writeFileSync(currentShiftPath, JSON.stringify(currentShift, null, 2));
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // If the task wasn't in the current shift, search through completed shifts
    const monthDirs = fs.readdirSync(shiftsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.match(/^\d{2}-\d{4}$/))
      .map(dirent => dirent.name);
    
    for (const monthDir of monthDirs) {
      const monthPath = path.join(shiftsDir, monthDir);
      const shiftFiles = fs.readdirSync(monthPath)
        .filter(file => file.endsWith('.json'));
      
      for (const shiftFile of shiftFiles) {
        const shiftFilePath = path.join(monthPath, shiftFile);
        const shift = JSON.parse(fs.readFileSync(shiftFilePath, 'utf8'));
        const taskIndex = shift.tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
          // Found the task in this shift
          if (action === 'update') {
            // Update the task with the new data
            shift.tasks[taskIndex] = {
              ...shift.tasks[taskIndex],
              ...updates
            };
          } else if (action === 'add') {
            // Add a new task (should not happen here but just in case)
            shift.tasks.push(updates);
          } else if (action === 'delete') {
            // Remove the task
            shift.tasks.splice(taskIndex, 1);
          } else if (action === 'set_status') {
            // Update task status and completion time if needed
            shift.tasks[taskIndex].status = updates.status;
            if (updates.status === 'Completed' && updates.completedTime) {
              shift.tasks[taskIndex].completedTime = updates.completedTime;
            } else if (updates.status === 'Pending') {
              // Remove completedTime if task is set back to pending
              delete shift.tasks[taskIndex].completedTime;
            }
          }
          
          // Save the updated shift
          fs.writeFileSync(shiftFilePath, JSON.stringify(shift, null, 2));
          
          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }
    
    // If we got here, we couldn't find the task
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("API error updating task:", error);
    return new Response(JSON.stringify({ error: 'Failed to update task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Process GET requests to retrieve a specific task
 */
export async function GET({ params }) {
  try {
    const { id } = params;
    
    // If no ID is provided, return an error
    if (!id) {
      return new Response(JSON.stringify({ error: 'Task ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const shiftsDir = path.join(process.cwd(), 'public/data/shifts');
    
    // First, check if this task is in the current shift
    const currentShiftPath = path.join(shiftsDir, 'current_shift.json');
    if (fs.existsSync(currentShiftPath)) {
      const currentShift = JSON.parse(fs.readFileSync(currentShiftPath, 'utf8'));
      const task = currentShift.tasks.find(t => t.id === id);
      
      if (task) {
        return new Response(JSON.stringify(task), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // If not in the current shift, search through completed shifts
    const monthDirs = fs.readdirSync(shiftsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name.match(/^\d{2}-\d{4}$/))
      .map(dirent => dirent.name);
    
    for (const monthDir of monthDirs) {
      const monthPath = path.join(shiftsDir, monthDir);
      const shiftFiles = fs.readdirSync(monthPath)
        .filter(file => file.endsWith('.json'));
      
      for (const shiftFile of shiftFiles) {
        const shift = JSON.parse(fs.readFileSync(path.join(monthPath, shiftFile), 'utf8'));
        const task = shift.tasks.find(t => t.id === id);
        
        if (task) {
          return new Response(JSON.stringify(task), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }
    
    // If we get here, the task was not found
    return new Response(JSON.stringify({ error: 'Task not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("API error retrieving task:", error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve task' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
