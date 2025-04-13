<template>
  <div class="task-form" :class="{ 'slide-up': true }">
    <div class="form-header">
      <button type="button" class="close-btn" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <h2>{{ isEditing ? 'Edit Task' : 'New Task' }}</h2>
      <div class="spacer"></div>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <div class="loading-indicator"></div>
      <p>Loading task data...</p>
    </div>
    
    <form v-else @submit.prevent="submitForm" class="form-container">
      <div class="form-scroll-container">
        <div class="form-section">
          <h3>Task Details</h3>
          
          <!-- Time Received -->
          <div class="form-group">
            <label for="receivedTime">Time Received</label>
            <select 
              id="receivedTime" 
              v-model="formData.receivedTime" 
              required
              :disabled="isEditing && task?.status === 'Completed' && !isFromArchive"
            >
              <option v-for="time in timeOptions" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>
          
          <!-- Job Category -->
          <div class="form-group">
            <label for="jobCategory">Job Category</label>
            <select 
              id="jobCategory" 
              v-model="formData.jobCategory" 
              required
              @change="updateItemTypes"
              :disabled="isEditing && task?.status === 'Completed' && !isFromArchive"
            >
              <option value="" disabled>Select Job Category</option>
              <option v-for="category in jobCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <!-- Item Type -->
          <div class="form-group">
            <label for="itemType">{{ formData.jobCategory === 'Patient Transfer' ? 'Transport Type' : 'Item Type' }}</label>
            <select 
              id="itemType" 
              v-model="formData.itemType" 
              required
              :disabled="isEditing && task?.status === 'Completed' && !isFromArchive"
            >
              <option value="" disabled>{{ formData.jobCategory === 'Patient Transfer' ? 'Select Transport Type' : 'Select Item Type' }}</option>
              <option v-for="item in availableItemTypes" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Location</h3>
          
          <!-- From Department -->
          <div class="form-group">
            <label for="fromDepartment">From Department</label>
            <select 
              id="fromDepartment" 
              v-model="formData.fromDepartment" 
              required
              :disabled="isEditing && task?.status === 'Completed' && !isFromArchive"
            >
              <option value="" disabled>Select Department</option>
              <option v-for="dept in departments" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
          </div>
          
          <!-- To Department -->
          <div class="form-group">
            <label for="toDepartment">To Department</label>
            <select 
              id="toDepartment" 
              v-model="formData.toDepartment" 
              required
              :disabled="isEditing && task?.status === 'Completed'"
            >
              <option value="" disabled>Select Department</option>
              <option v-for="dept in departments" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-section">
          <h3>Time and Staff</h3>
          
          <!-- Allocated Staff -->
          <div class="form-group">
            <label for="staffMember">Allocated Staff Member</label>
            <select 
              id="staffMember" 
              v-model="formData.allocatedStaff"
              :disabled="isEditing && task?.status === 'Completed'"
            >
              <option value="">None</option>
              <option v-for="staff in staffMembers" :key="staff" :value="staff">
                {{ staff }}
              </option>
            </select>
          </div>
          
          <!-- Time Allocated -->
          <div class="form-group">
            <label for="allocatedTime">Time Allocated</label>
            <select 
              id="allocatedTime" 
              v-model="formData.allocatedTime" 
              required
              :disabled="isEditing && task?.status === 'Completed'"
            >
              <option v-for="time in timeOptions" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>
          
          <!-- Time Completed -->
          <div class="form-group">
            <label for="completedTime">Time Completed</label>
            <select 
              id="completedTime" 
              v-model="formData.completedTime" 
              :disabled="isEditing && task?.status === 'Completed'"
            >
              <option value="">Not completed</option>
              <option v-for="time in timeOptions" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <!-- Status Actions for Existing Tasks -->
        <template v-if="isEditing">
          <div class="status-actions" v-if="task?.status === 'Pending'">
            <button 
              type="button" 
              class="btn-success action-button" 
              @click="markAsCompleted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Mark as Completed
            </button>
          </div>
          
          <div class="status-actions" v-if="task?.status === 'Completed'">
            <button 
              type="button" 
              class="btn-pending action-button" 
              @click="markAsPending"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12h4l3 8 4-16 3 8h4"></path>
              </svg>
              Return to Pending
            </button>
          </div>
          
          <button 
            type="submit" 
            class="btn-primary submit-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            Save Changes
          </button>
        </template>
        
        <!-- Actions for New Tasks -->
        <template v-else>
          <button 
            type="submit" 
            class="btn-success action-button"
            @click="setCompleted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Save as Completed
          </button>
          
          <button 
            type="submit" 
            class="btn-pending action-button"
            @click="setPending"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12h4l3 8 4-16 3 8h4"></path>
            </svg>
            Save as Pending
          </button>
          
          <button 
            type="button" 
            class="btn-secondary cancel-button"
            @click="goBack"
          >
            Cancel
          </button>
        </template>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, inject } from 'vue';
import { useShiftStore } from '../stores/shiftStore';
import { formatTime, getCurrentISOTime, isoToTimeString, timeToISOString, parseTime, generateTimeOptions, getValidTimeForShift, loadFromLocalStorage } from '../utils/helpers';
import type { JobCategory, Department, ItemType, StaffMember, Task, RouteParams, ShiftType } from '../models/types';

// Props
interface Props {
  taskId?: string;
}
const props = defineProps<Props>();

// Navigation
type NavigateFn = (route: string, params?: RouteParams) => void;
const navigate = inject<NavigateFn>('navigate', (route: string) => {
  console.warn('navigate injection not found');
});

// Store
const shiftStore = useShiftStore();
const { getTask, addTask, updateTask, setTaskStatus, currentShift, completedShifts, isLoading } = shiftStore;

// Settings storage key
const SETTINGS_STORAGE_KEY = 'porter-track-settings';

// Default settings
const defaultSettings = {
  jobCategories: ['Patient Transfer', 'Samples', 'Asset Movement', 'Gases', 'Ad Hoc'],
  itemTypes: {
    'Patient Transfer': ['Bed', 'Chair', 'Trolly'],
    'Samples': ['Blood', 'Urine Sample'],
    'Gases': ['Gas Cylinder'],
    'Asset Movement': ['Equipment'],
    'Ad Hoc': ['Other']
  },
  departments: ['AMU', 'IAU', 'A+E', 'NICU', 'Ward 27', 'Pathology'],
  staff: ['Porter 1', 'Porter 2', 'Porter 3', 'Porter 4', 'Porter 5']
};

// Load settings from localStorage with proper typing
interface AppSettings {
  jobCategories: string[];
  itemTypes: { [category: string]: string[] };
  departments: string[];
  staff: string[];
}

const settingsData = loadFromLocalStorage(SETTINGS_STORAGE_KEY, defaultSettings) as AppSettings;

// Constants for the dropdowns - use settings
const jobCategories: JobCategory[] = settingsData.jobCategories;
const departments: Department[] = settingsData.departments;
const staffMembers: StaffMember[] = settingsData.staff;

// Item type mappings
const itemTypesByCategory = settingsData.itemTypes;

// State
const task = ref<Task | undefined>(undefined);
const formData = ref({
  receivedTime: '',
  jobCategory: '' as JobCategory,
  fromDepartment: '' as Department,
  toDepartment: '' as Department,
  itemType: '' as ItemType,
  allocatedStaff: '' as StaffMember | '',
  allocatedTime: '',
  completedTime: '',
  status: 'Pending' as 'Pending' | 'Completed'
});
const availableItemTypes = ref<ItemType[]>([]);
const timeOptions = ref<string[]>([]);
const isFormSubmitting = ref(false);
const currentTimeStr = ref(formatTime(new Date()));

// Computed properties
const isEditing = computed(() => !!props.taskId);
const samplesActive = computed(() => formData.value.jobCategory === 'Samples');
const transfusionActive = computed(() => formData.value.jobCategory === 'Transfusion');
const isFromArchive = computed(() => {
  if (!isEditing.value || !task.value) return false;
  
  // Check if this task is from a completed shift in the archives
  return !!completedShifts.find(shift => 
    shift.tasks.some(t => t.id === task.value?.id)
  );
});

// Update available item types based on job category
const updateItemTypes = () => {
  const category = formData.value.jobCategory;
  if (category) {
    availableItemTypes.value = itemTypesByCategory[category] as ItemType[] || [];
    
    // Set a default item type if none selected
    if (!formData.value.itemType && availableItemTypes.value.length > 0) {
      formData.value.itemType = availableItemTypes.value[0];
    }
    
    // Handle special case for Samples going to Pathology
    if (category === 'Samples' && samplesActive.value) {
      formData.value.toDepartment = 'Pathology';
    }
    
    // Handle special case for Transfusion coming from Pathology
    if (category === 'Transfusion' && transfusionActive.value) {
      formData.value.fromDepartment = 'Pathology';
    }
  }
};

// Initialize time options
const initializeTimeOptions = () => {
  // Get time options based on shift type
  if (currentShift) {
    timeOptions.value = generateTimeOptions(currentShift.type);
  } else {
    // If editing a task from a completed shift
    timeOptions.value = [...generateTimeOptions('Day'), ...generateTimeOptions('Night')];
    
    // Remove duplicates
    timeOptions.value = [...new Set(timeOptions.value)];
  }
  
  // Make sure the current time is included in the options
  if (currentTimeStr.value && !timeOptions.value.includes(currentTimeStr.value)) {
    timeOptions.value.push(currentTimeStr.value);
  }
  
  // Sort time options
  timeOptions.value.sort();
};

// Set default times for a new task
const setDefaultTimes = () => {
  // Only set defaults for new tasks
  if (isEditing.value) return;
  
  // Get the current time and use it directly (don't validate against shift times for default values)
  const now = new Date();
  formData.value.receivedTime = formatTime(now);
  
  // Set allocated time to 1 minute after current time
  const allocatedDate = new Date(now);
  allocatedDate.setMinutes(now.getMinutes() + 1);
  formData.value.allocatedTime = formatTime(allocatedDate);
  
  // Set completed time to 17 minutes after current time
  const completedDate = new Date(now);
  completedDate.setMinutes(now.getMinutes() + 17);
  formData.value.completedTime = formatTime(completedDate);
  
  // Add all times to options if not already there
  [formData.value.receivedTime, formData.value.allocatedTime, formData.value.completedTime].forEach(time => {
    if (time && !timeOptions.value.includes(time)) {
      timeOptions.value.push(time);
    }
  });
  
  // Resort time options
  timeOptions.value.sort();
};

// Set initial form data
const initializeForm = () => {
  // Initialize time options first
  initializeTimeOptions();
  
  if (isEditing.value && props.taskId) {
    // Load existing task data
    task.value = getTask(props.taskId);
    
    if (task.value) {
      // Set form data from task
      formData.value.receivedTime = isoToTimeString(task.value.receivedTime);
      formData.value.jobCategory = task.value.jobCategory;
      
      // Update available item types before setting current value
      availableItemTypes.value = itemTypesByCategory[task.value.jobCategory] as ItemType[];
      formData.value.itemType = task.value.itemType;
      
      formData.value.fromDepartment = task.value.fromDepartment;
      formData.value.toDepartment = task.value.toDepartment;
      formData.value.allocatedStaff = task.value.allocatedStaff || '';
      formData.value.allocatedTime = isoToTimeString(task.value.allocatedTime);
      formData.value.completedTime = task.value.completedTime ? isoToTimeString(task.value.completedTime) : '';
      formData.value.status = task.value.status;
      
      // Add any times to the options if they're not already there
      [formData.value.receivedTime, formData.value.allocatedTime, formData.value.completedTime].forEach(time => {
        if (time && !timeOptions.value.includes(time)) {
          timeOptions.value.push(time);
        }
      });
      
      // Resort time options
      timeOptions.value.sort();
    }
  } else {
    // Set defaults for new task
    setDefaultTimes();
  }
};

// Watch for job category changes
watch(() => formData.value.jobCategory, () => {
  updateItemTypes();
});

  // Watch for time changes and update dependent times
watch(() => formData.value.receivedTime, (newTime) => {
  if (!newTime || isEditing.value) return;
  
  // Get current time as Date object
  const now = new Date();
  
  // Update allocated time to be 1 minute after current time
  const allocatedDate = new Date(now);
  allocatedDate.setMinutes(now.getMinutes() + 1);
  let newAllocatedTime = formatTime(allocatedDate);
  
  // Update completed time to be 17 minutes after current time
  const completedDate = new Date(now);
  completedDate.setMinutes(now.getMinutes() + 17);
  let newCompletedTime = formatTime(completedDate);
  
  // Ensure times are within shift hours
  if (currentShift) {
    newAllocatedTime = getValidTimeForShift(newAllocatedTime, currentShift.type);
    newCompletedTime = getValidTimeForShift(newCompletedTime, currentShift.type);
  }
  
  // Update form data
  formData.value.allocatedTime = newAllocatedTime;
  formData.value.completedTime = newCompletedTime;
  
  // Add times to options if not already there
  [newAllocatedTime, newCompletedTime].forEach(time => {
    if (time && !timeOptions.value.includes(time)) {
      timeOptions.value.push(time);
    }
  });
  
  // Resort time options
  timeOptions.value.sort();
});

// Form action flags
const setPending = () => {
  formData.value.status = 'Pending';
};

const setCompleted = () => {
  formData.value.status = 'Completed';
  
  // If completed time is empty, set it to allocated time
  if (!formData.value.completedTime) {
    formData.value.completedTime = formData.value.allocatedTime;
  }
};

// Form submission handler
const submitForm = async () => {
  if (isFormSubmitting.value) return;
  isFormSubmitting.value = true;
  
  try {
    // Get current date to use for time-to-ISO conversion
    const today = new Date();
    
    // Convert times to ISO strings, handling empty completedTime
    const receivedTimeIso = timeToISOString(formData.value.receivedTime, today);
    const allocatedTimeIso = timeToISOString(formData.value.allocatedTime, today);
    const completedTimeIso = formData.value.completedTime ? 
      timeToISOString(formData.value.completedTime, today) : undefined;
    
    // Prepare task data
    const taskData = {
      receivedTime: receivedTimeIso,
      jobCategory: formData.value.jobCategory,
      fromDepartment: formData.value.fromDepartment,
      toDepartment: formData.value.toDepartment,
      itemType: formData.value.itemType,
      allocatedStaff: formData.value.allocatedStaff || undefined,
      allocatedTime: allocatedTimeIso,
      completedTime: completedTimeIso
    };
    
    if (isEditing.value && props.taskId) {
      // Update existing task
      await updateTask(props.taskId, taskData);
      
      // Update status if needed
      if (formData.value.status === 'Completed' && task.value?.status !== 'Completed') {
        await setTaskStatus(props.taskId, 'Completed', completedTimeIso);
      } else if (formData.value.status === 'Pending' && task.value?.status !== 'Pending') {
        await setTaskStatus(props.taskId, 'Pending');
      }
    } else {
      // Create new task
      const newTask = await addTask(taskData);
      
      // Set status if completed
      if (formData.value.status === 'Completed') {
        await setTaskStatus(newTask.id, 'Completed', completedTimeIso);
      }
    }
    
    // Navigate back
    goBack();
  } catch (error) {
    console.error('Error saving task:', error);
  } finally {
    isFormSubmitting.value = false;
  }
};

// Status change actions
const markAsCompleted = async () => {
  if (!props.taskId) return;
  
  try {
    // If completedTime is empty, use current time
    const completedTimeIso = formData.value.completedTime ?
      timeToISOString(formData.value.completedTime) : getCurrentISOTime();
    
    await setTaskStatus(props.taskId, 'Completed', completedTimeIso);
    goBack();
  } catch (error) {
    console.error('Error marking task as completed:', error);
  }
};

const markAsPending = async () => {
  if (!props.taskId) return;
  
  try {
    await setTaskStatus(props.taskId, 'Pending');
    goBack();
  } catch (error) {
    console.error('Error marking task as pending:', error);
  }
};

// Navigation
const goBack = () => {
  // If editing a task from an archived shift, go back to the shift details
  if (isEditing.value && task.value) {
    // Find the shift that contains this task
    const archivedShift = completedShifts.find(shift => 
      shift.tasks.some(t => t.id === task.value?.id)
    );
    
    if (archivedShift) {
      return navigate('shiftDetail', { shiftId: archivedShift.id });
    }
  }
  
  // Default to tasks screen
  navigate('tasks');
};

// Initialize on component mount
onMounted(() => {
  // Ensure current time is updated
  currentTimeStr.value = formatTime(new Date());
  
  // Initialize the form
  initializeForm();
});
</script>

<style lang="scss" scoped>
.task-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  border-top-left-radius: var(--border-radius-lg);
  border-top-right-radius: var(--border-radius-lg);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.15);
  z-index: 100;
  height: 90vh;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  
  &.slide-up {
    animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  
  .form-header {
    display: grid;
    grid-template-columns: 44px 1fr 44px;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 5;
    
    h2 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      text-align: center;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: var(--color-text-light);
      cursor: pointer;
      padding: var(--spacing-xs);
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--border-radius-pill);
      transition: background-color var(--transition-fast);
      
      &:hover, &:active {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
    
    .spacer {
      width: 44px;
    }
  }
  
  .loading-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xl);
    gap: var(--spacing-md);
    
    .loading-indicator {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(var(--color-primary-rgb), 0.2);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 1s ease-in-out infinite;
    }
    
    p {
      font-size: var(--font-size-base);
      color: var(--color-text-light);
    }
  }
  
  .form-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
    height: 100%;
    overflow: hidden;
    
    .form-scroll-container {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-md) var(--spacing-md) var(--spacing-xl);
      -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
    }
    
    .form-section {
      background-color: var(--color-surface);
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-md);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      
      h3 {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text);
        margin-top: 0;
        margin-bottom: var(--spacing-md);
      }
      
      .form-group {
        margin-bottom: var(--spacing-md);
        
        &:last-child {
          margin-bottom: 0;
        }
        
        label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-text-secondary);
        }
        
        select {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
          font-family: var(--font-family);
          font-size: var(--font-size-base);
          color: var(--color-text);
          background-color: white;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1em;
          
          &:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
          }
          
          &:disabled {
            background-color: rgba(0, 0, 0, 0.03);
            color: var(--color-text-light);
          }
        }
      }
    }
    
    .form-actions {
      padding: var(--spacing-md);
      background-color: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-top: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      position: sticky;
      bottom: 0;
      
      .status-actions {
        margin-bottom: var(--spacing-sm);
      }
      
      .action-button, .submit-button, .cancel-button {
        width: 100%;
        padding: var(--spacing-md);
        font-weight: var(--font-weight-medium);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        
        svg {
          flex-shrink: 0;
        }
      }
    }
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .task-form {
    height: 94vh;
    max-height: 94vh;
    
    .form-header {
      padding: var(--spacing-sm) var(--spacing-md);
    }
    
    .form-container {
      .form-section {
        padding: var(--spacing-md);
      }
    }
  }
}

@media (min-width: 769px) {
  .task-form {
    left: 50%;
    width: 500px;
    transform: translateX(-50%);
    height: 85vh;
    max-height: 85vh;
    border-top-left-radius: var(--border-radius-lg);
    border-top-right-radius: var(--border-radius-lg);
    
    &.slide-up {
      animation: none;
      transform: translateY(0) translateX(-50%);
    }
  }
}
</style>
