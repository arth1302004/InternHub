import { InternInfo } from './intern-info.model';

export interface Comment {
  id: number;
  author: string;
  message: string;
  date: string;
  time: string;
}

export interface Attachment {
  id: number;
  name: string;
  size: string;
  type: string;
}

export interface Task {
  taskId: string;
  taskName: string;
  description: string;
  status: string;
  dueDate: string;
  priority: string;
  tags?: string[];
  assignedInterns: InternInfo[];
  department?: string;
  createdDate?: string;
  createdBy?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface TaskDetail extends Task {
  modifiedDate?: Date;
}

export interface TaskCreate {
  taskName: string;
  description: string;
  status: string;
  dueDate: string;
  priority: string;
  tags?: string[];
  internIds: string[];
  estimatedHours: number;
}