import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clonamos la petición para agregar el token si existe
    const token = this.authService.getToken();
    let clonedRequest = req;

    if (token) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el token está vencido o hay error 401/403, cerramos sesión
        const mensaje = error.error?.respuesta || error.error?.mensaje || '';

        if (
          error.status === 401 ||
          error.status === 403 ||
          mensaje.includes('token vencido') ||
          mensaje.includes('Token está vencido')
        ) {
          console.warn('Sesión expirada o no autorizada. Cerrando sesión...');
          this.authService.logout().subscribe(() => {
            this.router.navigate(['/login']);
          });
        }

        return throwError(() => error);
      })
    );
  }
}
