import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userRole = authService.getUserRole();

  if (userRole === 'admin') {
    return true;
  } else {
    // Optionally, redirect to a different page or show an access denied message
    router.navigate(['/dashboard']); // Redirect to dashboard if not admin
    return false;
  }
};