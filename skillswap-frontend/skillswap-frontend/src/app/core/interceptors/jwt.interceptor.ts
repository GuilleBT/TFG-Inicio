import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

const PUBLIC_ROUTES = ['/api/matching', '/api/users/search', '/api/reviews/user', '/api/tecnologias', '/api/auth/'];

function isPublicRoute(url: string): boolean {
  return PUBLIC_ROUTES.some(route => url.includes(route));
}

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  let rawData = authService.getToken() || sessionStorage.getItem('auth-user') || '';
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
        if (isPublicRoute(req.url)) {
          return throwError(() => error);
        }
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
