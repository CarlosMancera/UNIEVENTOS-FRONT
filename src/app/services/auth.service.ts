import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CrearCuentaDTO } from '../dto/cuentaDTO/CrearCuentaDTO';
import { MensajeDTO } from '../dto/MensajeDTO';
import { LoginDTO } from '../dto/LoginDTO';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ENDPOINTS } from '../core/endpoints';


interface User {
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface MyJwtPayload extends JwtPayload {
  nombre?: string;
  rol?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO> {
    const url = `${ENDPOINTS.crearCuenta.baseUrl}/${ENDPOINTS.crearCuenta.path}`;
    return this.http.post<MensajeDTO>(url, cuentaDTO);
  }

  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
    const url = `${ENDPOINTS.iniciarSesion.baseUrl}/${ENDPOINTS.iniciarSesion.path}`;
    return this.http.post<MensajeDTO>(url, loginDTO);
  }

  public recuperarPassword(correo: string): Observable<MensajeDTO> {
    const url = `${ENDPOINTS.recuperarPassword.baseUrl}/${ENDPOINTS.recuperarPassword.path}?correo=${correo}`;
    return this.http.post<MensajeDTO>(url, {});
  }

  public actualizarPassword(dto: any): Observable<MensajeDTO> {
    const url = `${ENDPOINTS.iniciarSesion.baseUrl}/actualizar-password`;
    return this.http.post<MensajeDTO>(url, dto);
  }

  public logout(): Observable<MensajeDTO> {
    const email = this.getCurrentUser()?.email;

    const url = `${ENDPOINTS.iniciarSesion.baseUrl}/close-sesion`;

    if (email) {
      return this.http.post<MensajeDTO>(url, email).pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
        })
      );
    } else {
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      return of({ error: false, mensaje: 'Cerró sesión correctamente', respuesta: null });
    }
  }

  public decodeToken(token: string): User {
    const decoded = jwtDecode<MyJwtPayload>(token);

    if (!decoded.sub || !decoded.nombre || !decoded.rol) {
      throw new Error('Token inválido: faltan datos del usuario');
    }

    const user: User = {
      email: decoded.sub,
      name: decoded.nombre,
      role: decoded.rol === 'ADMIN' ? 'admin' : 'user',
    };

    return user;
  }

  public login(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      this.currentUserSubject.next(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  }

  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  public isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  public checkAuthentication(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && storedUser !== 'undefined') {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error al parsear currentUser:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  private users = [
    {
      email: 'user@email.com',
      password: 'useruser',
      name: 'Usuario Normal',
      role: 'user' as const,
    },
    {
      email: 'admin@email.com',
      password: 'adminadmin',
      name: 'Administrador',
      role: 'admin' as const,
    },
  ];
}
