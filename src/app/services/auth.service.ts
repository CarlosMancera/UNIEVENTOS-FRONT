import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CrearCuentaDTO } from '../dto/cuentaDTO/CrearCuentaDTO';
import { MensajeDTO } from '../dto/MensajeDTO';
import { LoginDTO } from '../dto/LoginDTO';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  name: string;
  role: 'user' | 'admin';
}

import { JwtPayload } from 'jwt-decode';

interface MyJwtPayload extends JwtPayload {
  nombre?: string;
  rol?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private authURL = "https://unieventosbackend-production.up.railway.app/api/auth";
  private authAuxURL = "https://unieventosbackend-production.up.railway.app/api/cuenta";  

  constructor(private http: HttpClient) { }

  public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authAuxURL}/crear-cuenta`, cuentaDTO);
  }

  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/iniciar-sesion`, loginDTO);
  }

  public recuperarPassword(correo: string): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authAuxURL}/recuperar-password?correo=${correo}`, {});
  }

  // Método para decodificar el token y obtener la información del usuario
  decodeToken(token: string): User {
    const decoded = jwtDecode<MyJwtPayload>(token);

    // Puedes validar que las propiedades existan
    if (!decoded.sub || !decoded.nombre || !decoded.rol) {
      throw new Error('Token inválido: faltan datos del usuario');
    }

    const user: User = {
      email: decoded.sub,         // Se asume que 'sub' contiene el email
      name: decoded.nombre,       // Ahora 'nombre' es reconocido en MyJwtPayload
      role: decoded.rol === 'ADMIN' ? 'admin' : 'user'  // Mapea el rol según tu lógica
    };
    return user;
  }

  login(email: string, password: string): boolean {
    // Este método se mantiene para pruebas locales, pero no se usará cuando se use el backend.
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      this.currentUserSubject.next(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  }

  logout(): Observable<MensajeDTO> {
    const email = this.getCurrentUser()?.email;
    if (email) {
      return this.http.post<MensajeDTO>(`${this.authURL}/close-sesion`, email)
        .pipe(
          tap(response => {
            this.currentUserSubject.next(null);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
          })
        );
    } else {
      this.currentUserSubject.next(null);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      return of({ error: false, mensaje: "Cerró sesión correctamente", respuesta: null });
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  checkAuthentication() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && storedUser !== "undefined") {
      try {
        this.currentUserSubject.next(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al parsear currentUser:", error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  private users = [
    { email: 'user@email.com', password: 'useruser', name: 'Usuario Normal', role: 'user' as const },
    { email: 'admin@email.com', password: 'adminadmin', name: 'Administrador', role: 'admin' as const }
  ];

  public actualizarPassword(dto: any): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/actualizar-password`, dto);
  }

}
