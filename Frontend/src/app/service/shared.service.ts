import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  loginSuccess = new EventEmitter<void>();
  attendanceUpdated = new EventEmitter<void>();
  sidebarToggle = new Subject<void>();
  private passwordResetStatus = new Subject<boolean>();
  passwordResetStatus$ = this.passwordResetStatus.asObservable();

  constructor() { }

  notifyLoginSuccess() {
    this.loginSuccess.emit();
  }

  notifyAttendanceUpdated() {
    this.attendanceUpdated.emit();
  }

  notifyPasswordResetStatus(status: boolean) {
    this.passwordResetStatus.next(status);
  }

  toggleSidebar() {
    this.sidebarToggle.next();
  }
}
