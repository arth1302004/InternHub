import { Routes } from '@angular/router';
import { Interns } from './components/interns/interns';
import { Projects } from './components/projects/projects';
import { Reports } from './components/reports/reports';
import { Login } from './components/login/login';
import { Main } from './components/main/main';
import { Signup } from './components/signup/signup';
import { Profile } from './components/profile/profile';
import { AttendanceList } from './components/attendance-list/attendance-list';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard'; // Import adminGuard
import { EditProfile } from './components/edit-profile/edit-profile';
import { AddIntern } from './components/add-intern/add-intern'; // Assuming this path
// Assuming this path
import { Settings } from './components/settings/settings';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { InternDashboard } from './components/intern-dashboard/intern-dashboard';
import { Application } from './components/application/application';
import { TaskManagement } from './components/task-management/task-management';
import { VerifyPasswordComponent } from './components/verify-password/verify-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ApplicationFormComponent } from './components/application-form/application-form.component';
import { AdminProfile } from './components/admin-profile/admin-profile';
import { SecurityQuestionsComponent } from './components/security-questions/security-questions.component';
import { AnswerSecurityQuestionsComponent } from './components/answer-security-questions/answer-security-questions.component';
import { AdminApprovalCenterComponent } from './components/admin-approval-center/admin-approval-center.component';
import { EvaluationComponent } from './components/evaluation/evaluation';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Changed this line
  { path: 'login', component: Login },
  {path:'sign-up',component:Signup},
  {path: 'verify-password/:id', component: VerifyPasswordComponent},
  {path: 'reset-password/:id', component: ResetPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},

  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'answer-security-questions', component: AnswerSecurityQuestionsComponent},
  {path: 'application-form', component: ApplicationFormComponent},

  {
    path: '',
    component: Main,  
    canActivate: [authGuard],
    children: [
   
      { path: 'interns', component: Interns, canActivate: [adminGuard] }, // Apply adminGuard
      { path: 'reports', component: Reports },
      { path: 'projects', component: Projects },
      {path: 'view-profile/:id', component:Profile},
       {path: 'intern-profile', component:Profile},
      {path:'application',component:Application, canActivate: [adminGuard]},
      {path:'task-management',component:TaskManagement, canActivate: [adminGuard]},
      {path:'evaluation',component:EvaluationComponent, canActivate: [adminGuard]},
      {path:'document',component:Document, canActivate: [adminGuard]},
      {path:'forgot-password',component:ForgotPasswordComponent},
      {path:'admin-dashboard',component:AdminDashboard, canActivate: [adminGuard]},
      {path:'admin-profile',component:AdminProfile},
      {path:'intern-dashboard',component:InternDashboard},
      {path:'admin-approvals',component:AdminApprovalCenterComponent, canActivate: [adminGuard]},
      {path: 'attendances', component:AttendanceList, canActivate: [adminGuard]},
      {path:'edit-profile',component:EditProfile},
       {path:'edit-profile/:id',component:EditProfile},
      {path: 'add-intern', component: AddIntern, canActivate: [adminGuard]}, // New route for adding intern
   
      {path: 'settings', component: Settings, canActivate: [adminGuard]},
      {path: 'security-questions', component: SecurityQuestionsComponent}
    ]
  },

  { path: '**', redirectTo: 'login' }
];
