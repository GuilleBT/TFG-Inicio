import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  let rawData = '';

  // 🛡️ EL ESCUDO ANTI-SSR
  // Solo intentamos leer el sessionStorage si estamos en el navegador real
  if (typeof window !== 'undefined' && window.sessionStorage) {
    rawData = authService.getToken() || sessionStorage.getItem('auth-user') || '';
  }

  let finalToken = '';

  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      finalToken = parsed.token || parsed.accessToken || '';
    } catch (e) {
      finalToken = rawData.replace(/^"(.*)"$/, '$1');
    }
  }

  const authReq = finalToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${finalToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};