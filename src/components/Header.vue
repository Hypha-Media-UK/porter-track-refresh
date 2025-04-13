<template>
  <header class="header">
    <div class="header-left">
      <div v-if="currentRoute !== 'home'" class="back-button" @click="navigateToHome">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </div>
    </div>

    <div class="header-title" @click="navigateToHome" role="button" tabindex="0">
      <h1>Porter Track</h1>
    </div>

    <div class="header-right">
      <button 
        v-if="isShiftActive && currentRoute !== 'tasks'" 
        @click="navigateToTasks" 
        class="action-button"
      >
        View
      </button>
    </div>

    <div v-if="isShiftActive" class="shift-status">
      <div class="status-indicator"></div>
      <span>{{ currentShift?.type }} Shift · {{ formatDate(new Date(currentShift?.startTime || '')) }}</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { useShiftStore } from '../stores/shiftStore';
import { formatDate } from '../utils/helpers';
import type { RouteParams } from '../models/types';

// Store
const { isShiftActive, currentShift } = useShiftStore();

// Navigation
type NavigateFn = (screen: string, params?: RouteParams) => void;
const navigate = inject<NavigateFn>('navigate', (screen: string) => {
  console.warn('navigate injection not found');
});

// Current route
const currentRoute = inject<string>('currentRoute', 'home');

// Navigate to tasks screen
const navigateToTasks = () => {
  navigate('tasks');
};

// Navigate to home screen
const navigateToHome = () => {
  navigate('home');
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin-bottom: var(--spacing-xl);
  
  /* iOS-style sticky header with subtle shadow */
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
  
  .header-left {
    justify-self: start;
    
    .back-button {
      display: flex;
      align-items: center;
      color: var(--color-primary);
      cursor: pointer;
      padding: var(--spacing-xs);
      margin-left: -8px;
      border-radius: var(--border-radius-pill);
      transition: background-color var(--transition-fast);
      
      &:hover {
        background-color: rgba(var(--color-primary-rgb), 0.1);
      }
      
      &:active {
        background-color: rgba(var(--color-primary-rgb), 0.2);
      }
    }
  }
  
  .header-title {
    cursor: pointer;
    text-align: center;
    
    h1 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
      transition: opacity var(--transition-fast);
      
      &:active {
        opacity: 0.7;
      }
    }
    
    &:focus {
      outline: none;
    }
  }
  
  .header-right {
    justify-self: end;
    
    .action-button {
      background: none;
      border: none;
      color: var(--color-primary);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-base);
      padding: var(--spacing-xs) var(--spacing-sm);
      cursor: pointer;
      border-radius: var(--border-radius-pill);
      transition: background-color var(--transition-fast);
      
      &:hover {
        background-color: rgba(var(--color-primary-rgb), 0.1);
      }
      
      &:active {
        background-color: rgba(var(--color-primary-rgb), 0.2);
      }
    }
  }
  
  .shift-status {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs);
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
    
    .status-indicator {
      width: 8px;
      height: 8px;
      background-color: var(--color-success);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    
    span {
      font-weight: var(--font-weight-medium);
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

@media (max-width: 768px) {
  .header {
    padding: var(--spacing-sm) var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    
    .header-title h1 {
      font-size: var(--font-size-lg);
    }
  }
}
</style>
