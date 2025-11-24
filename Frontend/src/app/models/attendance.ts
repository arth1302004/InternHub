export interface Attendance {
  attendanceId: string;
  internId: string;
  status: string;
  date: string; // Assuming date is sent as a string (ISO 8601)
  notes?: string; // Optional, if it exists in the backend
}