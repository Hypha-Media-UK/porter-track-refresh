/**
 * Core data types for Porter Track application
 */

export type ShiftType = 'Day' | 'Night';

// Change from strict literal types to string to allow for dynamic values from settings
export type JobCategory = string;
// Legacy flat Department type
export type Department = string;

// New hierarchical location types
export interface Building {
  id: string;
  name: string;
  departments: LocationItem[];
  wards: LocationItem[];
}

export interface LocationItem {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  buildingId: string;
  name: string;
  type: 'department' | 'ward';
}
export type ItemType = string;
export type StaffMember = string;

// Default values for reference
export const DEFAULT_JOB_CATEGORIES = [
  'Patient Transfer', 'Samples', 'Asset Movement', 'Gases', 'Ad Hoc'
] as const;

export const DEFAULT_DEPARTMENTS = [
  'AMU', 'IAU', 'A+E', 'NICU', 'Ward 27', 'Pathology'
] as const;

export const DEFAULT_ITEM_TYPES = {
  'Patient Transfer': ['Bed', 'Chair', 'Trolly'],
  'Samples': ['Blood', 'Urine Sample'],
  'Gases': ['Gas Cylinder'],
  'Asset Movement': ['Equipment'],
  'Ad Hoc': ['Other']
} as const;

export const DEFAULT_STAFF_MEMBERS = [
  'Porter 1', 'Porter 2', 'Porter 3', 'Porter 4', 'Porter 5'
] as const;

export type Supervisor = 'Supervisor 1' | 'Supervisor 2' | 'Supervisor 3';

export type TaskStatus = 'Pending' | 'Completed';

/**
 * Task Interface - Represents a transportation task within a shift
 */
export interface Task {
  id: string;
  receivedTime: string; // ISO string
  jobCategory: JobCategory;
  fromDepartment: Department;
  toDepartment: Department;
  itemType: ItemType;
  allocatedStaff?: StaffMember; // Optional
  allocatedTime: string; // ISO string, when the task is allocated
  completedTime?: string; // ISO string, optional
  status: TaskStatus;
}

/**
 * Shift Interface - Represents a work shift with multiple transportation tasks
 */
export interface Shift {
  id: string;
  date: string; // ISO string for date
  type: ShiftType;
  supervisor: Supervisor; // Supervisor on shift
  startTime: string; // ISO string
  endTime?: string; // ISO string, optional if shift is still ongoing
  tasks: Task[];
}

/**
 * Navigation route parameters type
 */
export interface RouteParams {
  [key: string]: any;
}
