/**
 * Shift Store - Central state management for shifts and tasks
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Shift, Task, ShiftType, TaskStatus, Supervisor } from '../models/types';
import { 
  generateId, 
  getCurrentISOTime,
  saveToLocalStorage, 
  loadFromLocalStorage, 
  exportToJsonFile,
  getValidTimeForShift
} from '../utils/helpers';

// Constants
const STORAGE_KEY = 'porter-track-shifts';
const API_BASE = '/api/shifts';

export const useShiftStore = defineStore('shift', () => {
  // State
  const shifts = ref<Shift[]>([]);
  const currentShift = ref<Shift | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed state
  const isShiftActive = computed(() => currentShift.value !== null && !currentShift.value.endTime);
  
  const pendingTasks = computed(() => {
    if (!currentShift.value) return [];
    return currentShift.value.tasks
      .filter(task => task.status === 'Pending')
      .sort((a, b) => new Date(a.receivedTime).getTime() - new Date(b.receivedTime).getTime());
  });
  
  const completedTasks = computed(() => {
    if (!currentShift.value) return [];
    return currentShift.value.tasks
      .filter(task => task.status === 'Completed')
      .sort((a, b) => {
        // If both have completedTime, sort by that
        if (a.completedTime && b.completedTime) {
          return new Date(b.completedTime).getTime() - new Date(a.completedTime).getTime();
        }
        // Otherwise, sort by receivedTime
        return new Date(b.receivedTime).getTime() - new Date(a.receivedTime).getTime();
      });
  });
  
  const completedShifts = computed(() => {
    // Only shifts with an endTime are considered completed
    return shifts.value
      .filter(shift => shift.endTime)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  /**
   * Load all shift data from API or localStorage
   */
  async function loadShifts(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Try to load data from API first
      console.log("Loading shift data from API...");
      
      const response = await fetch('/api/loadShiftData');
      if (response.ok) {
        const data = await response.json();
        console.log(`Loaded ${data.length} shifts successfully`);
        
        // Update state with fetched data
        shifts.value = data;
        
        // Find active shift (the one without an endTime)
        const activeShift = shifts.value.find(shift => !shift.endTime);
        
        if (activeShift) {
          console.log("Active shift found:", activeShift.id);
          currentShift.value = activeShift;
        } else {
          console.log("No active shift found");
          currentShift.value = null;
        }
      } else {
        // Fallback to localStorage if API fails
        console.log('API endpoint failed, using localStorage fallback');
        shifts.value = loadFromLocalStorage(STORAGE_KEY, []);
        
        // Find active shift
        const activeShift = shifts.value.find(shift => !shift.endTime);
        if (activeShift) {
          currentShift.value = activeShift;
        } else {
          currentShift.value = null;
        }
      }
    } catch (err) {
      console.error('Error loading shift data:', err);
      error.value = err instanceof Error ? err.message : 'Unknown error loading shifts';
      
      // Fallback to localStorage on any error
      shifts.value = loadFromLocalStorage(STORAGE_KEY, []);
      
      // Find active shift
      const activeShift = shifts.value.find(shift => !shift.endTime);
      if (activeShift) {
        currentShift.value = activeShift;
      } else {
        currentShift.value = null;
      }
    } finally {
      isLoading.value = false;
    }
  }

  // API interaction methods
  async function saveToAPI(data: any): Promise<boolean> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      return response.ok;
    } catch (err) {
      console.error('Error saving to API:', err);
      return false;
    }
  }

  /**
   * Save all shift data to localStorage and current shift to API
   */
  async function saveShifts(): Promise<void> {
    // Update localStorage with all shifts
    saveToLocalStorage(STORAGE_KEY, shifts.value);
    
    // Save current shift to API if it exists
    if (currentShift.value) {
      await saveToAPI(currentShift.value);
    }
  }

  /**
   * Start a new shift
   */
  async function startShift(shiftType: ShiftType, supervisor: Supervisor): Promise<Shift> {
    // Check if there's already an active shift
    if (isShiftActive.value) {
      throw new Error('Cannot start a new shift while one is active');
    }

    const newShift: Shift = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0], // Just date part
      type: shiftType,
      supervisor: supervisor,
      startTime: getCurrentISOTime(),
      tasks: []
    };

    // Set as current shift
    currentShift.value = newShift;
    
    // Add to shifts array
    shifts.value.push(newShift);
    
    // Save changes
    await saveShifts();
    
    return newShift;
  }

  /**
   * End the current shift
   */
  async function endShift(): Promise<void> {
    if (!currentShift.value) {
      throw new Error('No active shift to end');
    }

    currentShift.value.endTime = getCurrentISOTime();
    
    // Save changes
    await saveShifts();
    
    // Reset current shift
    currentShift.value = null;
  }

  /**
   * Add a new task to the current shift
   */
  async function addTask(task: Omit<Task, 'id' | 'status'>): Promise<Task> {
    if (!currentShift.value) {
      throw new Error('No active shift to add task to');
    }

    const newTask: Task = {
      ...task,
      id: generateId(),
      status: 'Pending'
    };

    currentShift.value.tasks.push(newTask);
    await saveShifts();
    
    // Also save task change to the API
    await saveTaskChange(newTask.id, newTask, 'add');
    
    return newTask;
  }

  /**
   * Update an existing task
   */
  async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    // Find task in current shift
    if (currentShift.value) {
      const taskIndex = currentShift.value.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        // Update the task
        currentShift.value.tasks[taskIndex] = {
          ...currentShift.value.tasks[taskIndex],
          ...updates
        };
        
        await saveShifts();
        await saveTaskChange(taskId, updates);
        return currentShift.value.tasks[taskIndex];
      }
    }
    
    // If the task wasn't found in the current shift, check completed shifts
    for (const shift of shifts.value) {
      if (shift.id !== currentShift.value?.id) { // Skip current shift as we already checked it
        const taskIndex = shift.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          // Update the task in the archived shift
          shift.tasks[taskIndex] = {
            ...shift.tasks[taskIndex],
            ...updates
          };
          
          await saveShifts();
          await saveTaskChange(taskId, updates);
          return shift.tasks[taskIndex];
        }
      }
    }
    
    throw new Error('Task not found');
  }

  /**
   * Set a task's status (Pending or Completed)
   */
  async function setTaskStatus(taskId: string, status: TaskStatus, completedTime?: string): Promise<Task> {
    const updates: Partial<Task> = { status };
    
    // If marking as completed, set completion time
    if (status === 'Completed') {
      updates.completedTime = completedTime || getCurrentISOTime();
    } else {
      // If marking as pending, remove completion time
      updates.completedTime = undefined;
    }
    
    // Update task
    const updatedTask = await updateTask(taskId, updates);
    
    // Save task status change to API
    await saveTaskChange(taskId, { status, completedTime: updates.completedTime }, 'set_status');
    
    return updatedTask;
  }

  /**
   * Save task changes to API
   */
  async function saveTaskChange(taskId: string, updates: any, action: string = 'update'): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, updates, action })
      });
      
      return response.ok;
    } catch (err) {
      console.error('Error saving task change:', err);
      return false;
    }
  }

  /**
   * Get a task by ID
   */
  function getTask(taskId: string): Task | undefined {
    // Check in current shift first
    if (currentShift.value) {
      const task = currentShift.value.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    
    // If not found in current shift, check all shifts
    for (const shift of shifts.value) {
      if (shift.id !== currentShift.value?.id) { // Skip current shift as we already checked it
        const task = shift.tasks.find(t => t.id === taskId);
        if (task) return task;
      }
    }
    
    return undefined;
  }

  /**
   * Get a shift by ID
   */
  function getShift(shiftId: string): Shift | undefined {
    // Check if it's the current shift
    if (currentShift.value?.id === shiftId) {
      return currentShift.value;
    }
    
    // Otherwise look in all shifts
    return shifts.value.find(s => s.id === shiftId);
  }

  // Return store
  return {
    // State
    shifts,
    currentShift,
    isLoading,
    error,
    
    // Computed
    isShiftActive,
    pendingTasks,
    completedTasks,
    completedShifts,
    
    // Actions
    loadShifts,
    startShift,
    endShift,
    addTask,
    updateTask,
    setTaskStatus,
    getTask,
    getShift,
    
    // Helper functions
    getValidTimeForShift
  };
});
