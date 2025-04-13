<template>
  <div class="task-screen">
    <div class="shift-info">
      <span class="shift-type">{{ currentShift?.type }} Shift</span>
      <span class="shift-date">{{ currentShift?.date ? formatDate(new Date(currentShift.date)) : '' }}</span>
    </div>
    
    <div class="action-container">
      <button class="btn-primary action-button" @click="createNewTask">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Task
      </button>
    </div>
    
    <div class="quick-access">
      <button class="quick-button pending" @click="viewPendingTasks">
        <div class="button-content">
          <span>Pending Tasks</span>
          <span class="count">{{ pendingTasks.length }}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </button>
      
      <button class="quick-button completed" @click="viewCompletedTasks">
        <div class="button-content">
          <span>Completed Tasks</span>
          <span class="count">{{ completedTasks.length }}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </button>
    </div>
    
    <!-- End Shift button and tab bar -->
    <div class="end-shift-container">
      <button class="btn-danger end-shift-button" @click="confirmEndShift = true">
        End Shift
      </button>
    </div>
    
    <!-- Tab bar navigation -->
    <nav class="tab-bar">
      <button class="tab-item" @click="navigateToHome">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span>Home</span>
      </button>
      
      <button class="tab-item active">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="m9 14 2 2 4-4"></path></svg>
        <span>Tasks</span>
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
import { formatDate } from '../utils/helpers';
import type { RouteParams } from '../models/types';

// Store
const shiftStore = useShiftStore();
const { currentShift, pendingTasks, completedTasks, endShift } = shiftStore;

// State
const confirmEndShift = ref(false);

// Navigation
type NavigateFn = (route: string, params?: RouteParams) => void;
const navigate = inject<NavigateFn>('navigate', (route: string) => {
  console.warn('navigate injection not found');
});

// Actions
const createNewTask = () => {
  navigate('taskForm');
};

const viewPendingTasks = () => {
  navigate('pendingTasks');
};

const viewCompletedTasks = () => {
  navigate('completedTasks');
};

const navigateToHome = () => {
  navigate('home');
};

const goToSettings = () => {
  navigate('settings');
};

const endCurrentShift = async () => {
  try {
    await endShift();
    navigate('home');
  } catch (error) {
    console.error('Error ending shift:', error);
  }
};
</script>

<style lang="scss" scoped>
.task-screen {
  max-width: 100%;
  margin: 0 auto;
  padding-bottom: 84px; /* Space for tab bar */
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  
  .shift-info {
    margin: var(--spacing-lg) auto;
    width: 100%;
    max-width: 450px;
    padding: 0 var(--spacing-md);
    text-align: center;
    
    .shift-type {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-primary);
      margin-right: var(--spacing-sm);
    }
    
    .shift-date {
      font-size: var(--font-size-base);
      color: var(--color-text-light);
    }
  }
  
  .action-container {
    margin: 0 auto var(--spacing-xl);
    width: 100%;
    max-width: 450px;
    padding: 0 var(--spacing-md);
    
    .action-button {
      width: 100%;
      padding: var(--spacing-md);
      font-size: var(--font-size-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      border-radius: var(--border-radius);
      box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.3);
      font-weight: var(--font-weight-medium);
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
  
  .quick-access {
    margin: 0 auto;
    width: 100%;
    max-width: 450px;
    padding: 0 var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    
    .quick-button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      border: none;
      border-radius: var(--border-radius);
      padding: var(--spacing-lg);
      text-align: left;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      transition: transform var(--transition-fast);
      
      &:active {
        transform: scale(0.98);
      }
      
      .button-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        
        span {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-medium);
          color: var(--color-text);
        }
        
        .count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 24px;
          min-width: 24px;
          padding: 0 var(--spacing-xs);
          border-radius: var(--border-radius-pill);
          font-size: var(--font-size-sm);
          color: white;
          font-weight: var(--font-weight-medium);
        }
      }
      
      svg {
        color: var(--color-text-light);
      }
      
      &.pending {
        border-left: 4px solid var(--color-pending);
        
        .count {
          background-color: var(--color-pending);
        }
      }
      
      &.completed {
        border-left: 4px solid var(--color-success);
        
        .count {
          background-color: var(--color-success);
        }
      }
    }
  }
  
  .end-shift-container {
    margin: var(--spacing-xl) auto 0;
    width: 100%;
    max-width: 450px;
    padding: 0 var(--spacing-md);
    
    .end-shift-button {
      width: 100%;
      padding: var(--spacing-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      border-radius: var(--border-radius);
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
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .task-screen {
    .shift-info,
    .action-container,
    .quick-access,
    .end-shift-container {
      max-width: 100%;
    }
  }
}

@media (min-width: 769px) {
  .task-screen {
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
