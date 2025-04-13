<template>
  <div class="app">
    <Header />
    
    <main>
      <Transition name="fade" mode="out-in">
        <component 
          :is="getComponentForRoute(currentRoute)" 
          v-bind="currentRouteParams"
          @navigate="navigateTo" 
        />
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, provide, defineAsyncComponent } from 'vue';
import { useShiftStore } from '../stores/shiftStore';
import { isBrowser, saveToLocalStorage, loadFromLocalStorage } from '../utils/helpers';
import type { RouteParams } from '../models/types';
import Header from './Header.vue';

// Constants
const ROUTE_STORAGE_KEY = 'porter-track-route';
const ROUTE_PARAMS_STORAGE_KEY = 'porter-track-route-params';

// Lazy loaded components for better performance
const HomeScreen = defineAsyncComponent(() => import('./HomeScreen.vue'));
const TaskScreen = defineAsyncComponent(() => import('./TaskScreen.vue'));
const TaskForm = defineAsyncComponent(() => import('./TaskForm.vue'));
const PendingTasksScreen = defineAsyncComponent(() => import('./PendingTasksScreen.vue'));
const CompletedTasksScreen = defineAsyncComponent(() => import('./CompletedTasksScreen.vue'));
const ShiftArchiveScreen = defineAsyncComponent(() => import('./ShiftArchiveScreen.vue'));
const ShiftDetailScreen = defineAsyncComponent(() => import('./ShiftDetailScreen.vue'));
const SettingsScreen = defineAsyncComponent(() => import('./SettingsScreen.vue'));

// Store
const shiftStore = useShiftStore();

// Route management with localStorage persistence
const currentRouteParams = ref<RouteParams>({});
const currentRoute = ref('home');

// Load initial route from localStorage (if available)
function initializeRouteFromStorage(): void {
  if (isBrowser()) {
    const savedRoute = localStorage.getItem(ROUTE_STORAGE_KEY);
    if (savedRoute) {
      currentRoute.value = savedRoute;
      
      try {
        const savedParams = localStorage.getItem(ROUTE_PARAMS_STORAGE_KEY);
        if (savedParams) {
          currentRouteParams.value = JSON.parse(savedParams);
        }
      } catch (error) {
        console.error('Error parsing route params from localStorage', error);
      }
    }
  }
}

// Call initialization immediately
initializeRouteFromStorage();

// Component mapping - for dynamic component loading
const getComponentForRoute = (route: string) => {
  // Normalize route to handle potential whitespace or case issues
  let normalizedRoute = 'home';
  
  if (typeof route === 'string') {
    // Strip any quotes and whitespace
    normalizedRoute = route.trim().replace(/^["']|["']$/g, '');
  }
  
  switch (normalizedRoute) {
    case 'home':
      return HomeScreen;
    case 'tasks':
      return TaskScreen;
    case 'taskForm':
      return TaskForm;
    case 'pendingTasks':
      return PendingTasksScreen;
    case 'completedTasks':
      return CompletedTasksScreen;
    case 'archive':
      return ShiftArchiveScreen;
    case 'shiftDetail':
      return ShiftDetailScreen;
    case 'settings':
      return SettingsScreen;
    default:
      // Don't log errors for dynamic components during HMR
      if (import.meta.env?.MODE !== 'development') {
        console.error(`Unknown route: "${normalizedRoute}" (original: "${route}")`);
      }
      // Always default to HomeScreen on invalid routes
      return HomeScreen;
  }
};

// Navigation with localStorage persistence
const navigateTo = (route: string, params: RouteParams = {}) => {
  currentRoute.value = route;
  currentRouteParams.value = params;
  
  // Save to localStorage for persistence
  if (isBrowser()) {
    saveToLocalStorage(ROUTE_STORAGE_KEY, route);
    saveToLocalStorage(ROUTE_PARAMS_STORAGE_KEY, params);
  }
};

// Provide navigation and route to child components
provide('navigate', navigateTo);
provide('currentRoute', currentRoute);

// Watch for shift status changes
watch(() => shiftStore.isShiftActive, (active, oldActive) => {
  // Only redirect if shift becomes inactive (completed)
  if (!active && oldActive) {
    navigateTo('home');
  }
});

// Initial data load
onMounted(async () => {
  console.log("App mounted - initializing application...");
  
  try {
    // Load all shifts data
    await shiftStore.loadShifts();
    
    // Smart navigation:
    // 1. If we're at home and there's an active shift, go to tasks
    // 2. Otherwise, respect the current route
    if (currentRoute.value === 'home' && shiftStore.isShiftActive) {
      console.log("Active shift detected, navigating to tasks screen");
      navigateTo('tasks');
    }
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
});
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  
  main {
    flex: 1;
    padding-bottom: var(--spacing-2xl);
  }
}
</style>
