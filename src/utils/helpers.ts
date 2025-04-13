/**
 * Utility helper functions for Porter Track application
 */
import { format, parse, addMinutes, differenceInMilliseconds } from 'date-fns';
import type { ShiftType } from '../models/types';

/**
 * Generate a unique ID for tasks/shifts
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Date and Time Formatting Utilities
 */

// Format a date as DD/MM/YYYY
export function formatDate(date: Date): string {
  return format(date, 'dd/MM/yyyy');
}

// Format time as HH:MM
export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

// Format date and time as DD/MM/YYYY, HH:MM
export function formatDateTime(date: Date): string {
  return format(date, 'dd/MM/yyyy, HH:mm');
}

// Format duration between two dates/times in hours and minutes
export function formatDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const durationMs = differenceInMilliseconds(end, start);
  
  // Format as hours and minutes
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

/**
 * Time Conversion Utilities
 */

// Parse HH:MM string to Date object preserving the date part from the base date
export function parseTime(timeStr: string, baseDate: Date = new Date()): Date {
  if (!timeStr) return baseDate;
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

// Get current time as ISO string
export function getCurrentISOTime(): string {
  return new Date().toISOString();
}

// Check if a time is within day shift hours (08:00-20:00)
export function isDayShift(date: Date): boolean {
  const hours = date.getHours();
  return hours >= 8 && hours < 20;
}

/**
 * Time Options Generation
 */

// Generate time options at 15-minute intervals for a given shift type
export function generateTimeOptions(shiftType: ShiftType): string[] {
  const times: string[] = [];
  const interval = 15; // minutes
  
  if (shiftType === 'Day') {
    // Day shift: 8:00 to 20:00
    let currentTime = new Date();
    currentTime.setHours(8, 0, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(20, 0, 0, 0);
    
    while (currentTime < endTime) {
      times.push(format(currentTime, 'HH:mm'));
      currentTime = addMinutes(currentTime, interval);
    }
  } else {
    // Night shift: 20:00 to 8:00 (next day)
    
    // First, add times from 20:00 to 23:45
    let eveningTime = new Date();
    eveningTime.setHours(20, 0, 0, 0);
    
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    while (eveningTime < midnight) {
      times.push(format(eveningTime, 'HH:mm'));
      eveningTime = addMinutes(eveningTime, interval);
    }
    
    // Then add times from 00:00 to 08:00
    let morningTime = new Date();
    morningTime.setHours(0, 0, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(8, 0, 0, 0);
    
    while (morningTime < endTime) {
      times.push(format(morningTime, 'HH:mm'));
      morningTime = addMinutes(morningTime, interval);
    }
  }
  
  return times;
}

// Get a time that is valid for the given shift type, adjusting if necessary
export function getValidTimeForShift(timeStr: string, shiftType: ShiftType): string {
  const time = parseTime(timeStr);
  const hours = time.getHours();
  
  if (shiftType === 'Day') {
    // Day shift: 8:00 to 20:00
    if (hours < 8) return '08:00';
    if (hours >= 20) return '19:45';
    return timeStr;
  } else {
    // Night shift: 20:00 to 8:00
    if (hours >= 8 && hours < 20) {
      return hours < 14 ? '08:00' : '20:00';
    }
    return timeStr;
  }
}

// Convert HH:MM time to ISO string, preserving the date from the base date
export function timeToISOString(timeStr: string, baseDate: Date = new Date()): string {
  return parseTime(timeStr, baseDate).toISOString();
}

// Extract HH:MM from ISO string
export function isoToTimeString(isoString?: string): string {
  if (!isoString) return '';
  return format(new Date(isoString), 'HH:mm');
}

/**
 * Browser/Environment Detection
 */

// Check if code is running in browser environment
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * LocalStorage Utilities
 */

// Save data to localStorage
export function saveToLocalStorage<T>(key: string, data: T): boolean {
  if (!isBrowser()) return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

// Load data from localStorage
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue;
  
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

// Clear specific item from localStorage
export function clearFromLocalStorage(key: string): boolean {
  if (!isBrowser()) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage item:', error);
    return false;
  }
}

/**
 * File Export Utilities
 */

// Save data to file for download
export function exportToJsonFile(data: any, filename: string): void {
  if (!isBrowser()) return;
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'export.json';
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
}
