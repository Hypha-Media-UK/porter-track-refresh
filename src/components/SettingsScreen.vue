<template>
  <div class="settings-screen">
    <h2>Application Settings</h2>
    <p class="description">
      Manage job categories, item types, departments, and staff
    </p>

    <div class="settings-container">
      <!-- Job Categories -->
      <div class="settings-section">
        <h3>
          <span>Job Categories</span>
          <button class="btn-small btn-accent" @click="addNewItem('jobCategory')">
            <span class="icon">+</span> Add
          </button>
        </h3>
        
        <div class="items-list">
          <div v-for="(category, index) in settings.jobCategories" :key="`category-${index}`" class="list-item">
            <input 
              type="text" 
              v-model="settings.jobCategories[index]" 
              @input="settingsChanged = true"
            />
            <button class="btn-small btn-danger" @click="removeItem('jobCategories', index)">
              <span class="icon">×</span>
            </button>
          </div>
          <div v-if="settings.jobCategories.length === 0" class="empty-list">
            No job categories defined
          </div>
        </div>
      </div>

      <!-- Quick Add Job Types -->
      <div class="settings-section">
        <h3>
          <span>Quick Add Job Types</span>
        </h3>
        
        <div class="quick-add-form">
          <div class="form-row">
            <div class="form-group">
              <label for="quickAddCategory">Category</label>
              <div class="select-with-add">
                <select 
                  id="quickAddCategory" 
                  v-model="quickAddCategory" 
                  class="category-select"
                >
                  <option value="" disabled>Select or type new category</option>
                  <option 
                    v-for="category in settings.jobCategories" 
                    :key="category" 
                    :value="category"
                  >
                    {{ category }}
                  </option>
                  <option value="__new__">+ Add New Category</option>
                </select>
              </div>
            </div>
            
            <div class="form-group" v-if="quickAddCategory === '__new__'">
              <label for="newCategoryName">New Category Name</label>
              <input 
                id="newCategoryName" 
                type="text" 
                v-model="newCategoryName" 
                placeholder="Enter new category name" 
              />
            </div>
            
            <div class="form-group">
              <label for="quickAddItemType">Item Type</label>
              <input 
                id="quickAddItemType" 
                type="text" 
                v-model="quickAddItemType" 
                placeholder="Enter item type" 
              />
            </div>
            
            <button 
              class="btn-primary btn-small add-button" 
              @click="quickAddJobType" 
              :disabled="!canAddJobType"
            >
              Add
            </button>
          </div>
        </div>
        
        <div class="quick-add-items">
          <div v-for="(entry, index) in recentlyAddedItems" :key="`quick-item-${index}`" class="quick-add-item">
            <div class="category-badge">{{ entry.category }}</div>
            <div class="item-name">{{ entry.itemType }}</div>
            <div class="item-status">Added</div>
          </div>
        </div>
      </div>
      
      <!-- Item Types with Category Association -->
      <div class="settings-section">
        <h3>
          <span>All Item Types</span>
        </h3>
        
        <div class="items-list">
          <div v-for="(categoryData, category) in settings.itemTypes" :key="`category-${category}`" class="item-category-group">
            <h4>{{ category }}</h4>
            <div v-for="(item, index) in categoryData" :key="`item-${category}-${index}`" class="list-item">
              <input 
                type="text" 
                v-model="settings.itemTypes[category][index]" 
                @input="settingsChanged = true"
              />
              <button class="btn-small btn-danger" @click="removeItemType(category, index)">
                <span class="icon">×</span>
              </button>
            </div>
          </div>
          <div v-if="Object.keys(settings.itemTypes).length === 0" class="empty-list">
            No item types defined
          </div>
        </div>
      </div>

      <!-- Departments -->
      <div class="settings-section">
        <h3>
          <span>Departments</span>
          <button class="btn-small btn-accent" @click="addNewItem('department')">
            <span class="icon">+</span> Add
          </button>
        </h3>
        
        <div class="items-list">
          <div v-for="(department, index) in settings.departments" :key="`department-${index}`" class="list-item">
            <input 
              type="text" 
              v-model="settings.departments[index]" 
              @input="settingsChanged = true"
            />
            <button class="btn-small btn-danger" @click="removeItem('departments', index)">
              <span class="icon">×</span>
            </button>
          </div>
          <div v-if="settings.departments.length === 0" class="empty-list">
            No departments defined
          </div>
        </div>
      </div>

      <!-- Staff Members -->
      <div class="settings-section">
        <h3>
          <span>Staff Members</span>
          <button class="btn-small btn-accent" @click="addNewItem('staff')">
            <span class="icon">+</span> Add
          </button>
        </h3>
        
        <div class="items-list">
          <div v-for="(staff, index) in settings.staff" :key="`staff-${index}`" class="list-item">
            <input 
              type="text" 
              v-model="settings.staff[index]" 
              @input="settingsChanged = true"
            />
            <button class="btn-small btn-danger" @click="removeItem('staff', index)">
              <span class="icon">×</span>
            </button>
          </div>
          <div v-if="settings.staff.length === 0" class="empty-list">
            No staff members defined
          </div>
        </div>
      </div>
      
      <!-- Buildings, Wards and Departments -->
      <div class="settings-section">
        <h3>
          <span>Buildings & Locations</span>
        </h3>
        
        <p class="section-description">
          Hierarchical structure of buildings, wards, and departments available in the task form.
        </p>
        
        <div class="info-box">
          <p>This new hierarchical structure allows for better organization of locations:</p>
          <ul>
            <li>Buildings can contain both wards and departments</li>
            <li>The system will automatically maintain backward compatibility</li>
            <li>Existing tasks will be mapped to the new structure</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Save and Cancel Buttons -->
    <div class="settings-actions">
      <button class="btn-secondary" @click="goBack">
        Cancel
      </button>
      <button 
        class="btn-primary" 
        @click="saveSettings" 
        :disabled="!settingsChanged"
      >
        Save Changes
      </button>
    </div>

    <!-- Add Item Type Modal -->
    <div v-if="showAddItemTypeModal" class="modal-backdrop" @click.self="showAddItemTypeModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add New Item Type</h3>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="itemTypeCategory">Category</label>
            <select id="itemTypeCategory" v-model="newItemTypeCategory" required>
              <option value="" disabled>Select Category</option>
              <option v-for="category in settings.jobCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="itemTypeName">Item Type Name</label>
            <input id="itemTypeName" type="text" v-model="newItemTypeName" required placeholder="Enter item type name" />
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn-secondary" @click="showAddItemTypeModal = false">
            Cancel
          </button>
          <button 
            class="btn-primary" 
            @click="addNewItemType" 
            :disabled="!newItemTypeCategory || !newItemTypeName"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <!-- New Item Input Modal -->
    <div v-if="showNewItemModal" class="modal-backdrop" @click.self="showNewItemModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add New {{ newItemModalTitle }}</h3>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label :for="'new-item-input'">Name</label>
            <input 
              id="new-item-input" 
              type="text" 
              v-model="newItemName" 
              required 
              :placeholder="`Enter ${newItemModalTitle.toLowerCase()} name`" 
            />
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn-secondary" @click="showNewItemModal = false">
            Cancel
          </button>
          <button 
            class="btn-primary" 
            @click="confirmAddNewItem" 
            :disabled="!newItemName"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, computed, onMounted } from 'vue';
import type { RouteParams } from '../models/types';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/helpers';

// Define types for our settings
interface ItemTypes {
  [category: string]: string[];
}

interface AppSettings {
  jobCategories: string[];
  itemTypes: ItemTypes;
  departments: string[];
  staff: string[];
  locations?: {
    buildings: Building[];
  };
  [key: string]: any;
}

import type { Building, LocationItem } from '../models/types';

// Navigation
type NavigateFn = (route: string, params?: RouteParams) => void;
const navigate = inject<NavigateFn>('navigate', (route: string) => {
  console.warn('navigate injection not found');
});

// Settings storage key
const SETTINGS_STORAGE_KEY = 'porter-track-settings';

// Default settings
const defaultSettings = {
  jobCategories: ['Patient Transfer', 'Samples', 'Transfusion', 'Asset Movement', 'Gases', 'Ad Hoc'],
  itemTypes: {
    'Patient Transfer': ['Bed', 'Chair', 'Trolly'],
    'Samples': ['Blood', 'Urine Sample'],
    'Transfusion': ['Blood Units', 'Platelets', 'Plasma'],
    'Gases': ['Gas Cylinder'],
    'Asset Movement': ['Equipment'],
    'Ad Hoc': ['Other']
  },
  departments: ['AMU', 'IAU', 'A+E', 'NICU', 'Ward 27', 'Pathology'],
  staff: ['Porter 1', 'Porter 2', 'Porter 3', 'Porter 4', 'Porter 5']
};

// State
const settings = reactive<AppSettings>({...defaultSettings});
const settingsChanged = ref(false);

// Quick add job types
const quickAddCategory = ref('');
const newCategoryName = ref('');
const quickAddItemType = ref('');
const recentlyAddedItems = ref<{category: string, itemType: string}[]>([]);

// Computed to check if we can add a job type
const canAddJobType = computed(() => {
  if (!quickAddItemType.value.trim()) return false;
  
  if (quickAddCategory.value === '__new__') {
    return !!newCategoryName.value.trim();
  }
  
  return !!quickAddCategory.value;
});

// Modal state for adding new item types
const showAddItemTypeModal = ref(false);
const newItemTypeCategory = ref('');
const newItemTypeName = ref('');

// Modal state for adding new items (categories, departments, staff)
const showNewItemModal = ref(false);
const newItemType = ref<string>('');
const newItemName = ref<string>('');

// Computed modal title based on item type being added
const newItemModalTitle = computed(() => {
  switch (newItemType.value) {
    case 'jobCategory': return 'Job Category';
    case 'department': return 'Department';
    case 'staff': return 'Staff Member';
    default: return 'Item';
  }
});

// Load settings from localStorage
function loadSettings() {
  const savedSettings = loadFromLocalStorage(SETTINGS_STORAGE_KEY, null);
  
  if (savedSettings) {
    // Update each property of the reactive settings object
    Object.keys(defaultSettings).forEach(key => {
      if (savedSettings[key]) {
        settings[key] = savedSettings[key];
      }
    });
  }
  
  // Reset change flag
  settingsChanged.value = false;
}

// Save settings to localStorage
function saveSettings() {
  saveToLocalStorage(SETTINGS_STORAGE_KEY, settings);
  settingsChanged.value = false;
  
  // Show success message or notification here if needed
  alert('Settings saved successfully!');
}

// Add a new item
function addNewItem(type: string) {
  newItemType.value = type;
  newItemName.value = '';
  showNewItemModal.value = true;
}

// Confirm adding a new item
function confirmAddNewItem() {
  if (!newItemName.value) return;
  
  switch (newItemType.value) {
    case 'jobCategory':
      if (!settings.jobCategories.includes(newItemName.value)) {
        settings.jobCategories.push(newItemName.value);
        
        // Also create an empty array for item types in this category
        settings.itemTypes[newItemName.value] = [];
      }
      break;
    case 'department':
      if (!settings.departments.includes(newItemName.value)) {
        settings.departments.push(newItemName.value);
      }
      break;
    case 'staff':
      if (!settings.staff.includes(newItemName.value)) {
        settings.staff.push(newItemName.value);
      }
      break;
  }
  
  settingsChanged.value = true;
  showNewItemModal.value = false;
}

// Quick add job type function
function quickAddJobType() {
  if (!canAddJobType.value) return;
  
  // Determine the category to use
  let category = quickAddCategory.value;
  
  // If it's a new category, use the new category name
  if (category === '__new__' && newCategoryName.value) {
    category = newCategoryName.value.trim();
    
    // Add the new category if it doesn't exist
    if (!settings.jobCategories.includes(category)) {
      settings.jobCategories.push(category);
    }
  }
  
  // Make sure the category exists in itemTypes
  if (!settings.itemTypes[category]) {
    settings.itemTypes[category] = [];
  }
  
  // Add the item type if it doesn't already exist
  const itemType = quickAddItemType.value.trim();
  if (!settings.itemTypes[category].includes(itemType)) {
    settings.itemTypes[category].push(itemType);
    
    // Add to recently added items
    recentlyAddedItems.value.unshift({ category, itemType });
    
    // Keep only the 5 most recent items
    if (recentlyAddedItems.value.length > 5) {
      recentlyAddedItems.value.pop();
    }
    
    settingsChanged.value = true;
  }
  
  // Reset item type input but keep the category for multiple additions
  quickAddItemType.value = '';
  
  // If it was a new category, reset to the newly created category
  if (quickAddCategory.value === '__new__') {
    quickAddCategory.value = category;
    newCategoryName.value = '';
  }
}

// Add a new item type
function addNewItemType() {
  if (!newItemTypeCategory.value || !newItemTypeName.value) return;
  
  // Initialize the category array if it doesn't exist
  if (!settings.itemTypes[newItemTypeCategory.value]) {
    settings.itemTypes[newItemTypeCategory.value] = [];
  }
  
  // Add the item type if it doesn't already exist
  if (!settings.itemTypes[newItemTypeCategory.value].includes(newItemTypeName.value)) {
    settings.itemTypes[newItemTypeCategory.value].push(newItemTypeName.value);
    settingsChanged.value = true;
  }
  
  // Reset form and close modal
  newItemTypeCategory.value = '';
  newItemTypeName.value = '';
  showAddItemTypeModal.value = false;
}

// Remove an item from an array setting
function removeItem(settingKey: keyof AppSettings, index: number) {
  const settingArray = settings[settingKey] as unknown as any[];
  if (index >= 0 && index < settingArray.length) {
    
    // Special handling for job categories - also remove associated item types
    if (settingKey === 'jobCategories') {
      const category = settings.jobCategories[index];
      if (settings.itemTypes[category]) {
        delete settings.itemTypes[category];
      }
    }
    
    // Remove the item
    settingArray.splice(index, 1);
    settingsChanged.value = true;
  }
}

// Remove an item type
function removeItemType(category: string, index: number) {
  if (settings.itemTypes[category] && index >= 0 && index < settings.itemTypes[category].length) {
    settings.itemTypes[category].splice(index, 1);
    
    // If this was the last item in the category, remove the category from the itemTypes
    if (settings.itemTypes[category].length === 0) {
      delete settings.itemTypes[category];
    }
    
    settingsChanged.value = true;
  }
}

// Navigation
function goBack() {
  if (settingsChanged.value) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      navigate('home');
    }
  } else {
    navigate('home');
  }
}

// Reset settings to defaults
function resetToDefaults() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    Object.keys(defaultSettings).forEach(key => {
      settings[key] = JSON.parse(JSON.stringify(defaultSettings[key]));
    });
    settingsChanged.value = true;
  }
}

// Initialize component
onMounted(() => {
  loadSettings();
});
</script>

<style lang="scss" scoped>
.section-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.info-box {
  background-color: rgba(var(--color-primary-rgb), 0.05);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  p {
    margin-top: 0;
    margin-bottom: var(--spacing-sm);
  }
  
  ul {
    margin: 0;
    padding-left: var(--spacing-lg);
    
    li {
      margin-bottom: var(--spacing-xs);
      font-size: var(--font-size-sm);
    }
  }
}

.settings-screen {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: var(--spacing-xl);
  
  h2 {
    text-align: center;
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-primary);
  }
  
  .description {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    color: var(--color-text-light);
  }
  
  .settings-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
  }
  
  .settings-section {
    background-color: var(--color-surface);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: var(--spacing-lg);
    
    h3 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
      color: var(--color-primary);
      
      button {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
    
    h4 {
      margin-top: var(--spacing-md);
      margin-bottom: var(--spacing-sm);
      font-weight: 600;
      color: var(--color-text);
      border-bottom: 1px solid var(--color-border);
      padding-bottom: var(--spacing-xs);
    }
    
    .items-list {
      .list-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-sm);
        
        input {
          flex: 1;
        }
        
        button {
          flex-shrink: 0;
        }
      }
      
      .empty-list {
        text-align: center;
        color: var(--color-text-light);
        padding: var(--spacing-md);
        font-style: italic;
      }
    }
    
    .quick-add-form {
      margin-bottom: var(--spacing-lg);
      padding: var(--spacing-md);
      background-color: rgba(var(--color-primary-rgb), 0.05);
      border-radius: var(--border-radius);
      
      .form-row {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }
      
      .form-group {
        flex: 1;
        
        label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
        }
        
        input, select {
          width: 100%;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius);
          border: 1px solid var(--color-border);
        }
      }
      
      .add-button {
        align-self: flex-end;
        margin-top: var(--spacing-sm);
      }
    }
    
    .quick-add-items {
      margin-top: var(--spacing-md);
      
      .quick-add-item {
        display: flex;
        align-items: center;
        padding: var(--spacing-sm);
        border-radius: var(--border-radius);
        background-color: rgba(var(--color-primary-rgb), 0.05);
        margin-bottom: var(--spacing-sm);
        
        .category-badge {
          font-size: var(--font-size-sm);
          padding: var(--spacing-xs) var(--spacing-sm);
          background-color: var(--color-primary);
          color: white;
          border-radius: var(--border-radius);
          margin-right: var(--spacing-sm);
        }
        
        .item-name {
          flex: 1;
          font-weight: 500;
        }
        
        .item-status {
          font-size: var(--font-size-sm);
          color: var(--color-success);
        }
      }
    }
  }
  
  .settings-actions {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    
    button {
      min-width: 150px;
    }
  }
}

@media (max-width: 900px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .settings-screen {
    h2 {
      font-size: var(--font-size-xl);
    }
    
    .settings-section {
      padding: var(--spacing-md);
    }
    
    .settings-actions {
      flex-direction: column;
      
      button {
        width: 100%;
        margin-bottom: var(--spacing-sm);
      }
    }
  }
}
</style>
