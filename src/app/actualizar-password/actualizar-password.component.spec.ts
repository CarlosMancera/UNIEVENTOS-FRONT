import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActualizarPasswordComponent } from './actualizar-password.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import Swal from 'sweetalert2';
beforeEach(() => {
  spyOn(Swal, 'fire');
});

// Mocks de servicios
class MockAuthService {
  actualizarPassword = jasmine.createSpy().and.returnValue(of({ respuesta: true, error: false }));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ActualizarPasswordComponent', () => {
  let component: ActualizarPasswordComponent;
  let fixture: ComponentFixture<ActualizarPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarPasswordComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ correo: 'usuario@correo.com' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActualizarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correo from query param', () => {
    expect(component.correo).toBe('usuario@correo.com');
  });

  it('should show alert if fields are missing', () => {
    component.actualizarPassword();
    expect(Swal.fire).toHaveBeenCalledWith('⚠️ Todos los campos son obligatorios.');
  });

  it('should show alert if passwords do not match', () => {
    component.correo = 'usuario@correo.com';
    component.codigo = '123456';
    component.nuevaPassword = 'clave123';
    component.confirmarPassword = 'otraClave';
    component.actualizarPassword();
    expect(Swal.fire).toHaveBeenCalledWith('⚠️ Las contraseñas no coinciden.');
  });

  it('should call actualizarPassword and navigate on success', () => {
    component.correo = 'usuario@correo.com';
    component.codigo = '123456';
    component.nuevaPassword = 'clave123';
    component.confirmarPassword = 'clave123';

    component.actualizarPassword();

    expect(component['authService'].actualizarPassword).toHaveBeenCalledWith({
      email: 'usuario@correo.com',
      codigo: '123456',
      nuevaPassword: 'clave123'
    });

    expect(Swal.fire).toHaveBeenCalledWith('✅ Contraseña actualizada correctamente.');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error if response indicates failure', () => {
    component['authService'].actualizarPassword = jasmine
      .createSpy()
      .and.returnValue(of({ respuesta: false, error: true }));

    component.correo = 'usuario@correo.com';
    component.codigo = '123456';
    component.nuevaPassword = 'clave123';
    component.confirmarPassword = 'clave123';

    component.actualizarPassword();

    expect(Swal.fire).toHaveBeenCalledWith('❌ Error: el código es incorrecto o ha expirado.');
  });

  it('should show error if request fails', () => {
    component['authService'].actualizarPassword = jasmine
      .createSpy()
      .and.returnValue(throwError(() => new Error('Error')));

    component.correo = 'usuario@correo.com';
    component.codigo = '123456';
    component.nuevaPassword = 'clave123';
    component.confirmarPassword = 'clave123';

    component.actualizarPassword();

    expect(Swal.fire).toHaveBeenCalledWith('❌ Error al actualizar la contraseña. Intente de nuevo.');
  });
});
