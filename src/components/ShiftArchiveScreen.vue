<template>
  <div class="archive-screen">
    <h2>Shift Archive</h2>
    
    <div v-if="isLoading" class="loading-state">
      <p>Loading shift archive...</p>
    </div>
    
    <div v-else-if="!completedShifts.length" class="empty-state">
      <p>No completed shifts found</p>
      <p class="subtext">Completed shifts will appear here</p>
      <button class="btn-primary mt-3" @click="goBack">
        Return to Home
      </button>
    </div>
    
    <template v-else>
      <!-- Archive table on desktop -->
      <div class="archive-table desktop-only">
        <div class="table-header">
          <div class="header-cell">Date and Shift</div>
          <div class="header-cell">Completed Tasks</div>
          <div class="header-cell">Pending Tasks</div>
          <div class="header-cell">Supervisor</div>
        </div>
        
        <div 
          v-for="shift in completedShifts" 
          :key="shift.id" 
          class="table-row"
          @click="viewShiftDetails(shift.id)"
        >
          <div class="cell">
            {{ formatDate(new Date(shift.date)) }} - {{ shift.type }}
          </div>
          <div class="cell completed-cell">
            {{ getCompletedTasksCount(shift) }}
          </div>
          <div class="cell pending-cell">
            {{ getPendingTasksCount(shift) }}
          </div>
          <div class="cell">
            {{ shift.supervisor }}
          </div>
        </div>
      </div>
      
      <!-- Archive cards on mobile -->
      <div class="archive-cards mobile-only">
        <div 
          v-for="shift in completedShifts" 
          :key="shift.id" 
          class="archive-card"
          @click="viewShiftDetails(shift.id)"
        >
          <div class="card-header">
            <span class="date">{{ formatDate(new Date(shift.date)) }}</span>
            <span class="shift-type">{{ shift.type }} Shift</span>
          </div>
          
          <div class="card-body">
            <div class="stats-row">
              <div class="stat">
                <span class="label">Completed:</span>
                <span class="value completed">{{ getCompletedTasksCount(shift) }}</span>
              </div>
              <div class="stat">
                <span class="label">Pending:</span>
                <span class="value pending">{{ getPendingTasksCount(shift) }}</span>
              </div>
            </div>
            
            <div class="supervisor-row">
              <span class="label">Supervisor:</span>
              <span class="value">{{ shift.supervisor }}</span>
            </div>
            
            <div class="duration-row" v-if="shift.startTime && shift.endTime">
              <span class="label">Duration:</span>
              <span class="value">{{ formatDuration(shift.startTime, shift.endTime) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button class="btn-secondary" @click="goBack">
          Back to Home
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import { useShiftStore } from '../stores/shiftStore';
import { formatDate, formatDuration } from '../utils/helpers';
import type { Shift, RouteParams } from '../models/types';

// Store
const shiftStore = useShiftStore();
const { completedShifts, isLoading } = shiftStore;

// Navigation
type NavigateFn = (route: string, params?: RouteParams) => void;
const navigate = inject<NavigateFn>('navigate', (route: string) => {
  console.warn('navigate injection not found');
});

// Helper functions for task counting
const getCompletedTasksCount = (shift: Shift) => {
  return shift.tasks.filter(task => task.status === 'Completed').length;
};

const getPendingTasksCount = (shift: Shift) => {
  return shift.tasks.filter(task => task.status === 'Pending').length;
};

// Navigation functions
const viewShiftDetails = (shiftId: string) => {
  navigate('shiftDetail', { shiftId });
};

const goBack = () => {
  navigate('home');
};
</script>

<style lang="scss" scoped>
.archive-screen {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: var(--spacing-xl);
  
  h2 {
    text-align: center;
    margin-bottom: var(--spacing-lg);
    color: var(--color-primary);
  }
  
  .loading-state, .empty-state {
    text-align: center;
    padding: var(--spacing-xl);
    background-color: var(--color-surface);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    margin-bottom: var(--spacing-xl);
    
    p {
      font-size: var(--font-size-lg);
      color: var(--color-text);
      margin-bottom: var(--spacing-sm);
      
      &.subtext {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
      }
    }
  }
  
  .archive-table {
    background-color: var(--color-surface);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    overflow: hidden;
    margin-bottom: var(--spacing-xl);
    
    .table-header {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      background-color: var(--color-primary);
      
      .header-cell {
        color: white;
        font-weight: 600;
        padding: var(--spacing-sm) var(--spacing-md);
        text-align: center;
        
        &:first-child {
          text-align: left;
        }
      }
    }
    
    .table-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      border-bottom: 1px solid var(--color-border);
      cursor: pointer;
      transition: background-color var(--transition-fast);
      
      &:hover {
        background-color: rgba(74, 105, 189, 0.1);
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .cell {
        padding: var(--spacing-sm) var(--spacing-md);
        text-align: center;
        
        &:first-child {
          text-align: left;
          font-weight: 500;
          color: var(--color-primary);
        }
        
        &.completed-cell {
          color: var(--color-success);
          font-weight: 500;
        }
        
        &.pending-cell {
          color: var(--color-pending);
          font-weight: 500;
        }
      }
    }
  }
  
  .archive-cards {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    
    .archive-card {
      background-color: var(--color-surface);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      overflow: hidden;
      cursor: pointer;
      transition: transform var(--transition-fast);
      
      &:hover {
        transform: translateY(-2px);
      }
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--color-primary);
        color: white;
        padding: var(--spacing-sm) var(--spacing-md);
        font-weight: 600;
      }
      
      .card-body {
        padding: var(--spacing-md);
        
        .stats-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--spacing-sm);
          
          .stat {
            .label {
              font-weight: 500;
              margin-right: var(--spacing-xs);
            }
            
            .value {
              &.completed {
                color: var(--color-success);
                font-weight: 500;
              }
              
              &.pending {
                color: var(--color-pending);
                font-weight: 500;
              }
            }
          }
        }
        
        .supervisor-row, .duration-row {
          margin-top: var(--spacing-xs);
          
          .label {
            font-weight: 500;
            margin-right: var(--spacing-xs);
          }
        }
      }
    }
  }
  
  .actions {
    display: flex;
    justify-content: center;
    
    button {
      padding: var(--spacing-sm) var(--spacing-xl);
      min-width: 200px;
    }
  }
}

// Responsive utilities
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: block;
  }
}
</style>
