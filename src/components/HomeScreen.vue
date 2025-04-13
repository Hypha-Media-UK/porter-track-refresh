<template>
  <div class="home-screen">
    <div class="content">
      <!-- When there is an active shift, show resume button -->
      <div v-if="isShiftActive" class="shift-actions">
        <div class="status-card">
          <div class="status-header">
            <div class="status-badge">
              <div class="status-indicator"></div>
              <span>Active</span>
            </div>
            <span class="shift-type">{{ currentShift?.type }} Shift</span>
          </div>
          <div class="status-info">
            <div class="info-item">
              <span class="label">Start Time</span>
              <span class="value">{{ formatTime(new Date(currentShift?.startTime || '')) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Supervisor</span>
              <span class="value">{{ currentShift?.supervisor }}</span>
            </div>
          </div>
        </div>
        
        <button class="btn-primary btn-large main-action resume-button" @click="resumeShift">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          Continue to Tasks
        </button>
        
        <button class="btn-danger end-button" @click="confirmEndShift = true">
          End Shift
        </button>
      </div>
      
      <!-- When no active shift, show supervisor selection -->
      <div v-else class="start-shift">
        <div class="supervisor-container">
          <label for="supervisor-select">Supervisor</label>
          <select 
            id="supervisor-select"
            class="supervisor-select"
            v-model="selectedSupervisor" 
            required
          >
            <option value="" disabled selected>Select Supervisor</option>
            <option value="Supervisor 1">Supervisor 1</option>
            <option value="Supervisor 2">Supervisor 2</option>
            <option value="Supervisor 3">Supervisor 3</option>
          </select>
        </div>
      
        <div class="shift-buttons">
          <button 
            class="btn-primary btn-large start-button"
            @click="startDayShift"
            :disabled="!selectedSupervisor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
            Start Day Shift
          </button>
          
          <button 
            class="btn-secondary btn-large start-button"
            @click="startNightShift"
            :disabled="!selectedSupervisor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            Start Night Shift
          </button>
        </div>
      </div>
    </div>
    
    <!-- Footer navigation -->
    <nav class="tab-bar">
      <button class="tab-item active" @click="navigateToHome">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span>Home</span>
      </button>
      
      <button class="tab-item" @click="goToArchive">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
        <span>Archive</span>
      </button>
      
      <button class="tab-item" @click="goToSettings">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        <span>Settings</span>
      </button>
    </nav>
    
    <!-- End Shift Confirmation Modal -->
    <div v-if="confirmEndShift" class="modal-backdrop" @click.self="confirmEndShift = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>End Current Shift</h3>
        </div>
        <div class="modal-body">
          <p>
            Are you sure you want to complete this shift?<br>
            All task data will be saved and exported.
          </p>
        </div>
        <div class="modal-actions">
          <button class="btn-secondary" @click="confirmEndShift = false">
            Cancel
          </button>
          <button class="btn-danger" @click="endCurrentShift">
            End Shift
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useShiftStore } from '../stores/shiftStore';
import { formatTime } from '../utils/helpers';
import type { Supervisor, RouteParams } from '../models/types';

// Store
const shiftStore = useShiftStore();
const { isShiftActive, currentShift, startShift, endShift } = shiftStore;

// Modal state
const confirmEndShift = ref(false);

// Navigation
type NavigateFn = (route: string, params?: RouteParams) => void;
const navigate = inject<NavigateFn>('navigate', (route: string) => {
  console.warn('navigate injection not found');
});

// State
const selectedSupervisor = ref<Supervisor | ''>('');

// Resume active shift
const resumeShift = () => {
  console.log('Resuming shift, navigating to tasks screen');
  navigate('tasks');
};

// Navigate to home (mainly for tab navigation)
const navigateToHome = () => {
  // Already on home screen, no need to navigate
};

// Start shift functions
const startDayShift = async () => {
  if (selectedSupervisor.value) {
    try {
      await startShift('Day', selectedSupervisor.value as Supervisor);
      navigate('tasks');
    } catch (error) {
      console.error('Error starting day shift:', error);
      // In a more robust application, we would show an error message to the user
    }
  }
};

const startNightShift = async () => {
  if (selectedSupervisor.value) {
    try {
      await startShift('Night', selectedSupervisor.value as Supervisor);
      navigate('tasks');
    } catch (error) {
      console.error('Error starting night shift:', error);
      // In a more robust application, we would show an error message to the user
    }
  }
};

// Navigation
const goToArchive = () => {
  navigate('archive');
};

const goToSettings = () => {
  navigate('settings');
};

// End current shift
const endCurrentShift = async () => {
  try {
    await endShift();
    confirmEndShift.value = false;
    // Don't manually navigate - let the watcher in App.vue handle it
  } catch (error) {
    console.error('Error ending shift:', error);
    // In a more robust application, we would show an error message to the user
  }
};
</script>

<style lang="scss" scoped>
.home-screen {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  height: calc(100vh - 140px); /* Adjust for header/footer height */
  
  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg) var(--spacing-md);
    padding-bottom: 84px; /* Leave space for tab bar */
  }
  
  /* Active shift styles */
  .shift-actions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    width: 100%;
    max-width: 450px;
    
    .status-card {
      background-color: white;
      border-radius: var(--border-radius-lg);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-md);
      
      .status-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
        
        .status-badge {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          
          .status-indicator {
            width: 8px;
            height: 8px;
            background-color: var(--color-success);
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          
          span {
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            color: var(--color-success);
          }
        }
        
        .shift-type {
          font-weight: var(--font-weight-semibold);
          font-size: var(--font-size-lg);
          color: var(--color-text);
        }
      }
      
      .status-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-md);
        
        .info-item {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          
          .label {
            font-size: var(--font-size-xs);
            color: var(--color-text-light);
            margin-bottom: var(--spacing-xs);
          }
          
          .value {
            font-size: var(--font-size-base);
            font-weight: var(--font-weight-medium);
            color: var(--color-text);
          }
        }
      }
    }
    
    .main-action {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--border-radius);
      box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.4);
      animation: pulse-highlight 2s infinite;
    }
    
    .resume-button {
      margin: var(--spacing-lg) 0;
      font-size: 18px;
      min-height: 60px;
    }
    
    .end-button {
      align-self: center;
      margin-top: var(--spacing-sm);
    }
  }
  
  /* Start shift styles */
  .start-shift {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    width: 100%;
    max-width: 450px;
    
    .supervisor-container {
      text-align: left;
      margin-bottom: var(--spacing-md);
      
      label {
        display: block;
        margin-bottom: var(--spacing-sm);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-secondary);
      }
      
      .supervisor-select {
        width: 100%;
        padding: var(--spacing-md);
        border-radius: var(--border-radius);
        border: 1px solid var(--color-border);
        background-color: white;
        font-size: var(--font-size-base);
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1em;
        
        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
        }
      }
    }
    
    .shift-buttons {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      
      .start-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-medium);
        border-radius: var(--border-radius);
        
        &:first-child {
          box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.3);
        }
      }
    }
  }
  
  /* Tab Bar - iOS style */
  .tab-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid var(--color-border);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 84px;
    padding-bottom: 20px; /* Safe area for iOS Home indicator */
    z-index: 10;
    
    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      background: none;
      border: none;
      color: var(--color-text-light);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      transition: color var(--transition-fast);
      cursor: pointer;
      flex: 1;
      height: 100%;
      
      svg {
        width: 24px;
        height: 24px;
        transition: all var(--transition-fast);
      }
      
      &:hover {
        color: var(--color-primary);
        
        svg {
          stroke: var(--color-primary);
        }
      }
      
      &.active {
        color: var(--color-primary);
        
        svg {
          stroke: var(--color-primary);
          fill: rgba(var(--color-primary-rgb), 0.1);
        }
      }
    }
  }
  
  /* Modal styling with iOS aesthetic */
  .modal-content {
    border-radius: var(--border-radius-lg);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    max-width: 350px;
    
    .modal-header {
      text-align: center;
      margin-bottom: var(--spacing-md);
      
      h3 {
        font-weight: var(--font-weight-semibold);
        color: var(--color-text);
        margin: 0;
      }
    }
    
    .modal-body {
      text-align: center;
      margin-bottom: var(--spacing-lg);
      
      p {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
        line-height: 1.5;
      }
    }
    
    .modal-actions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      
      button {
        width: 100%;
        padding: var(--spacing-sm) 0;
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-medium);
        
        &:first-child {
          margin-bottom: var(--spacing-xs);
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse-highlight {
  0% {
    box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(var(--color-primary-rgb), 0.6);
  }
  100% {
    box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.4);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .home-screen {
    .content {
      padding: var(--spacing-md);
      padding-bottom: 84px;
    }
    
    .shift-actions .status-card,
    .start-shift {
      max-width: 100%;
    }
  }
}

@media (min-width: 769px) {
  .home-screen {
    .tab-bar {
      max-width: 450px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
      border: 1px solid var(--color-border);
      border-bottom: none;
    }
  }
}
</style>
