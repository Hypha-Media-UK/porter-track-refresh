<template>
  <div class="shift-detail-screen">
    <div v-if="isLoading" class="loading-state">
      <p>Loading shift details...</p>
    </div>
    
    <div v-else-if="!shift" class="not-found-state">
      <p>Shift not found</p>
      <button class="btn-primary mt-3" @click="goBack">
        Return to Archive
      </button>
    </div>
    
    <template v-else>
      <div class="shift-header">
        <h2>{{ shift.type }} Shift Details</h2>
        <div class="shift-info">
          <div class="info-item">
            <span class="info-label">Date:</span>
            <span class="info-value">{{ formatDate(new Date(shift.date)) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Supervisor:</span>
            <span class="info-value">{{ shift.supervisor }}</span>
          </div>
          <div class="info-item" v-if="shift.startTime && shift.endTime">
            <span class="info-label">Duration:</span>
            <span class="info-value">{{ formatDuration(shift.startTime, shift.endTime) }}</span>
          </div>
        </div>
      </div>
      
      <div class="task-summary">
        <div class="summary-card completed">
          <div class="count">{{ completedTasksCount }}</div>
          <div class="label">Completed Tasks</div>
        </div>
        
        <div class="summary-card pending">
          <div class="count">{{ pendingTasksCount }}</div>
          <div class="label">Pending Tasks</div>
        </div>
      </div>
      
      <!-- Task grid - Desktop view -->
      <div class="task-grid desktop-only">
        <div class="grid-header">
          <div class="col">Time</div>
          <div class="col">Job Type</div>
          <div class="col">Item</div>
          <div class="col">Route</div>
          <div class="col">Staff</div>
          <div class="col">Status</div>
        </div>
        
        <div 
          v-for="task in shift.tasks" 
          :key="task.id"
          class="grid-row"
          :class="{ 'is-completed': task.status === 'Completed' }"
        >
          <div class="col time-col">{{ formatTime(new Date(task.receivedTime)) }}</div>
          <div class="col">{{ task.jobCategory }}</div>
          <div class="col">{{ task.itemType }}</div>
          <div class="col route-col">{{ task.fromDepartment }} → {{ task.toDepartment }}</div>
          <div class="col">{{ task.allocatedStaff || '-' }}</div>
          <div class="col status-actions">
            <div class="status-text" :class="task.status.toLowerCase()">
              {{ task.status }}
              <span v-if="task.completedTime && task.status === 'Completed'">
                ({{ formatTime(new Date(task.completedTime)) }})
              </span>
            </div>
            <button class="btn-small btn-edit" @click="editTask(task.id)">
              Edit
            </button>
          </div>
        </div>
      </div>
      
      <!-- Task list - Mobile view -->
      <div class="task-list mobile-only">
        <div 
          v-for="task in shift.tasks" 
          :key="task.id"
          class="task-card"
          :class="{ 'is-completed': task.status === 'Completed' }"
        >
          <div class="task-header">
            <div class="task-time">{{ formatTime(new Date(task.receivedTime)) }}</div>
            <div class="task-status" :class="task.status.toLowerCase()">{{ task.status }}</div>
          </div>
          
          <div class="task-body">
            <div class="task-detail">
              <span class="label">Job:</span>
              <span class="value">{{ task.jobCategory }}</span>
            </div>
            
            <div class="task-detail">
              <span class="label">Item:</span>
              <span class="value">{{ task.itemType }}</span>
            </div>
            
            <div class="task-detail">
              <span class="label">Route:</span>
              <span class="value">{{ task.fromDepartment }} → {{ task.toDepartment }}</span>
            </div>
            
            <div class="task-detail" v-if="task.allocatedStaff">
              <span class="label">Staff:</span>
              <span class="value">{{ task.allocatedStaff }}</span>
            </div>
            
            <div class="task-detail" v-if="task.completedTime && task.status === 'Completed'">
              <span class="label">Completed:</span>
              <span class="value">{{ formatTime(new Date(task.completedTime)) }}</span>
            </div>
            
            <div class="task-actions">
              <button class="btn-small btn-edit" @click="editTask(task.id)">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button class="btn-secondary" @click="goBack">
          Back to Archive
        </button>
        <button class="btn-primary" @click="exportShift">
          Export as JSON
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { inject, computed, onMounted, ref } from 'vue';
import { useShiftStore } from '../stores/shiftStore';
import { formatDate, formatTime, formatDuration, exportToJsonFile } from '../utils/helpers';
import type { Shift, RouteParams } from '../models/types';

// Props
interface Props {
  shiftId: string;
}
const props = defineProps<Props>();

// Store
const shiftStore = useShiftStore();
const { getShift, isLoading } = shiftStore;

// Navigation
type NavigateFn = (route: string, params?: RouteParams) => void;
const navigate = inject<NavigateFn>('navigate', (route: string) => {
  console.warn('navigate injection not found');
});

// State
const shift = ref<Shift | undefined>(undefined);

// Computed values
const completedTasksCount = computed(() => {
  if (!shift.value) return 0;
  return shift.value.tasks.filter(task => task.status === 'Completed').length;
});

const pendingTasksCount = computed(() => {
  if (!shift.value) return 0;
  return shift.value.tasks.filter(task => task.status === 'Pending').length;
});

// Initialize component
onMounted(() => {
  if (props.shiftId) {
    // Get shift data
    const shiftData = getShift(props.shiftId);
    if (shiftData) {
      shift.value = shiftData;
    }
  }
});

// Actions
const goBack = () => {
  navigate('archive');
};

const editTask = (taskId: string) => {
  navigate('taskForm', { taskId });
};

const exportShift = () => {
  if (!shift.value) return;
  
  // Create filename with date and shift type
  const date = new Date(shift.value.date);
  const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');
  const filename = `portertrack_${formattedDate}_${shift.value.type.toLowerCase()}.json`;
  
  // Export to JSON file
  exportToJsonFile(shift.value, filename);
};
</script>

<style lang="scss" scoped>
.shift-detail-screen {
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: var(--spacing-xl);
  
  .loading-state, .not-found-state {
    text-align: center;
    padding: var(--spacing-xl);
    background-color: var(--color-surface);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    margin-bottom: var(--spacing-xl);
    
    p {
      font-size: var(--font-size-lg);
      color: var(--color-text);
      margin-bottom: var(--spacing-md);
    }
  }
  
  .shift-header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
    
    h2 {
      color: var(--color-primary);
      margin-bottom: var(--spacing-sm);
    }
    
    .shift-info {
      display: flex;
      justify-content: center;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
      
      .info-item {
        .info-label {
          font-weight: 600;
          margin-right: var(--spacing-xs);
        }
        
        .info-value {
          color: var(--color-text);
        }
      }
    }
  }
  
  .task-summary {
    display: flex;
    justify-content: center;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    
    .summary-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: var(--color-surface);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      padding: var(--spacing-md) var(--spacing-lg);
      min-width: 150px;
      
      .count {
        font-size: var(--font-size-3xl);
        font-weight: 600;
      }
      
      .label {
        font-size: var(--font-size-sm);
        color: var(--color-text-light);
      }
      
      &.completed .count {
        color: var(--color-success);
      }
      
      &.pending .count {
        color: var(--color-pending);
      }
    }
  }
  
  .task-grid {
    background-color: var(--color-surface);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    overflow: hidden;
    margin-bottom: var(--spacing-xl);
    
    .grid-header {
      display: grid;
      grid-template-columns: 0.8fr 1fr 0.8fr 1.5fr 0.8fr 1.2fr;
      background-color: var(--color-primary);
      
      .col {
        padding: var(--spacing-sm) var(--spacing-sm);
        color: white;
        font-weight: 600;
        font-size: var(--font-size-sm);
        text-align: center;
        
        &:first-child {
          text-align: left;
          padding-left: var(--spacing-md);
        }
      }
    }
    
    .grid-row {
      display: grid;
      grid-template-columns: 0.8fr 1fr 0.8fr 1.5fr 0.8fr 1.2fr;
      border-bottom: 1px solid var(--color-border);
      font-size: var(--font-size-sm);
      
      &:last-child {
        border-bottom: none;
      }
      
      &.is-completed {
        background-color: rgba(68, 189, 50, 0.05);
      }
      
      .col {
        padding: var(--spacing-sm);
        text-align: center;
        
        &:first-child {
          text-align: left;
          padding-left: var(--spacing-md);
        }
        
        &.time-col {
          font-weight: 500;
          color: var(--color-primary);
        }
        
        &.route-col {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        &.status-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          
          .status-text {
            font-weight: 500;
            
            &.completed {
              color: var(--color-success);
            }
            
            &.pending {
              color: var(--color-pending);
            }
          }
          
          .btn-edit {
            font-size: var(--font-size-xs);
            padding: 2px 8px;
            background-color: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: background-color var(--transition-fast);
            
            &:hover {
              background-color: var(--color-primary-dark);
            }
          }
        }
      }
    }
  }
  
  .task-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    
    .task-card {
      background-color: var(--color-surface);
      border-radius: var(--border-radius);
      border-left: 4px solid var(--color-pending);
      box-shadow: var(--box-shadow);
      overflow: hidden;
      
      &.is-completed {
        border-left-color: var(--color-success);
      }
      
      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-xs) var(--spacing-md);
        background-color: rgba(245, 246, 250, 0.6);
        
        .task-time {
          font-weight: 600;
          color: var(--color-primary);
        }
        
        .task-status {
          padding: 2px 6px;
          border-radius: 12px;
          font-size: var(--font-size-xs);
          font-weight: 500;
          
          &.completed {
            background-color: var(--color-success);
            color: white;
          }
          
          &.pending {
            background-color: var(--color-pending);
            color: white;
          }
        }
      }
      
      .task-body {
        padding: var(--spacing-sm) var(--spacing-md);
        
        .task-detail {
          margin-bottom: var(--spacing-xs);
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .label {
            font-weight: 500;
            margin-right: var(--spacing-xs);
            color: var(--color-text-light);
          }
        }
        
        .task-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-xs);
          border-top: 1px solid var(--color-border-light);
          
          .btn-edit {
            font-size: var(--font-size-xs);
            padding: 4px 12px;
            background-color: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: background-color var(--transition-fast);
            
            &:hover {
              background-color: var(--color-primary-dark);
            }
          }
        }
      }
    }
  }
  
  .actions {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    
    button {
      padding: var(--spacing-sm) var(--spacing-lg);
      min-width: 160px;
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
  
  .shift-detail-screen {
    .shift-info {
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);
    }
    
    .task-summary {
      gap: var(--spacing-md);
      
      .summary-card {
        flex: 1;
        padding: var(--spacing-sm);
      }
    }
    
    .actions {
      flex-direction: column;
      gap: var(--spacing-sm);
      
      button {
        width: 100%;
      }
    }
  }
}
</style>
