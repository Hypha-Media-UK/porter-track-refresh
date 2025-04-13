<template>
  <div class="task-card" :class="{ 'is-completed': task.status === 'Completed' }">
    <div class="task-status-indicator" :class="task.status.toLowerCase()"></div>
    
    <div class="task-content">
      <div class="task-header">
        <div class="task-time-and-category">
          <span class="task-time">{{ formatTime(new Date(task.receivedTime)) }}</span>
          <span class="task-category">{{ task.jobCategory }}</span>
        </div>
        <div class="task-status-badge" :class="task.status.toLowerCase()">
          {{ task.status }}
        </div>
      </div>
      
      <div class="task-details">
        <div class="task-type">{{ task.itemType }}</div>
        <div class="task-route">
          <span class="from">{{ task.fromDepartment }}</span>
          <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span class="to">{{ task.toDepartment }}</span>
        </div>
      </div>
      
      <div class="task-footer">
        <div v-if="task.allocatedStaff" class="task-staff">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          {{ task.allocatedStaff }}
        </div>
        
        <div v-if="task.status === 'Completed' && task.completedTime" class="task-completed">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {{ formatTime(new Date(task.completedTime)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '../utils/helpers';
import type { Task } from '../models/types';

interface Props {
  task: Task;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.task-card {
  position: relative;
  background-color: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-strong);
  }
  
  &.is-completed {
    .task-status-indicator {
      background-color: var(--color-success);
    }
  }
  
  .task-status-indicator {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: var(--color-pending);
    
    &.completed {
      background-color: var(--color-success);
    }
  }
  
  .task-content {
    flex: 1;
    padding: var(--spacing-md);
    padding-left: calc(var(--spacing-md) + 4px);
    
    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-sm);
      
      .task-time-and-category {
        display: flex;
        flex-direction: column;
        gap: 2px;
        
        .task-time {
          font-weight: var(--font-weight-semibold);
          color: var(--color-primary);
          font-size: var(--font-size-sm);
        }
        
        .task-category {
          font-weight: var(--font-weight-medium);
          font-size: var(--font-size-base);
          color: var(--color-text);
        }
      }
      
      .task-status-badge {
        font-size: var(--font-size-xs);
        padding: 2px 8px;
        border-radius: var(--border-radius-pill);
        font-weight: var(--font-weight-medium);
        
        &.pending {
          background-color: var(--color-pending);
          color: white;
        }
        
        &.completed {
          background-color: var(--color-success);
          color: white;
        }
      }
    }
    
    .task-details {
      margin-bottom: var(--spacing-sm);
      
      .task-type {
        font-size: var(--font-size-sm);
        color: var(--color-text);
        margin-bottom: var(--spacing-xs);
        font-weight: var(--font-weight-medium);
      }
      
      .task-route {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        
        .arrow-icon {
          color: var(--color-primary);
          min-width: 16px;
        }
        
        .from, .to {
          padding: 2px 6px;
          background-color: rgba(0, 0, 0, 0.03);
          border-radius: var(--border-radius-sm);
        }
      }
    }
    
    .task-footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-xs);
      padding-top: var(--spacing-xs);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      
      .task-staff {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--color-text-light);
        
        svg {
          color: var(--color-secondary);
        }
      }
      
      .task-completed {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--color-success);
        font-weight: var(--font-weight-medium);
        
        svg {
          color: var(--color-success);
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .task-card {
    .task-content {
      .task-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-xs);
      }
    }
  }
}
</style>
