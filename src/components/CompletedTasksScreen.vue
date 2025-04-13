<template>
  <div class="tasks-screen">
    <div class="screen-header">
      <h2>Completed Tasks</h2>
      <div class="task-count">{{ completedTasks.length }} tasks</div>
    </div>
    
    <div class="task-list-container">
      <div v-if="completedTasks.length === 0" class="empty-list">
        <div class="empty-state">
          <p>No completed tasks</p>
          <p class="subtext">Tasks will appear here when completed</p>
        </div>
      </div>
      
      <div v-else class="tasks">
        <task-card 
          v-for="task in completedTasks" 
          :key="task.id" 
          :task="task"
          @click="editTask(task)"
        />
      </div>
    </div>
    
    <div class="navigation-buttons">
      <button class="btn-secondary" @click="navigateBack">
        Back to Dashboard
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, defineAsyncComponent } from 'vue';
import { useShiftStore } from '../stores/shiftStore';
import type { Task, RouteParams } from '../models/types';

// Lazy load the TaskCard component
const TaskCard = defineAsyncComponent(() => import('./TaskCard.vue'));

// Store
const shiftStore = useShiftStore();
const { completedTasks } = shiftStore;

// Navigation
type NavigateFn = (route: string, params?: RouteParams) => void;
const navigate = inject<NavigateFn>('navigate', (route: string) => {
  console.warn('navigate injection not found');
});

// Actions
const editTask = (task: Task) => {
  navigate('taskForm', { taskId: task.id });
};

const navigateBack = () => {
  navigate('tasks');
};
</script>

<style lang="scss" scoped>
.tasks-screen {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: var(--spacing-xl);
  
  .screen-header {
    margin-bottom: var(--spacing-lg);
    
    h2 {
      font-size: var(--font-size-2xl);
      color: var(--color-success);
      margin-bottom: var(--spacing-xs);
    }
    
    .task-count {
      font-size: var(--font-size-md);
      color: var(--color-text-light);
      font-weight: 500;
    }
  }
  
  .task-list-container {
    background-color: var(--color-surface);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: var(--spacing-lg);
    min-height: 400px;
    margin-bottom: var(--spacing-lg);
    
    .empty-list {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      
      .empty-state {
        text-align: center;
        color: var(--color-text-light);
        
        p {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-xs);
        }
        
        .subtext {
          font-size: var(--font-size-sm);
          opacity: 0.7;
        }
      }
    }
    
    .tasks {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }
  }
  
  .navigation-buttons {
    display: flex;
    justify-content: center;
    
    button {
      min-width: 180px;
    }
  }
}

@media (max-width: 768px) {
  .tasks-screen {
    .navigation-buttons {
      button {
        width: 100%;
      }
    }
  }
}
</style>
