import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordDialogComponent } from './forgot-password-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { BcLoadingService } from '../../../services/loading.service';
import { of, throwError } from 'rxjs';

// Mocks
class MockAuthService {
  recuperarPassword = jasmine.createSpy().and.returnValue(of(null));
}

class MockBcLoadingService {
  show = jasmine.createSpy();
  close = jasmine.createSpy();
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('ForgotPasswordDialogComponent', () => {
  let component: ForgotPasswordDialogComponent;
  let fixture: ComponentFixture<ForgotPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: BcLoadingService, useClass: MockBcLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message if correo is empty', () => {
    component.correo = '';
    component.sendRecoveryEmail();
    expect(component.message).toBe('Por favor, ingrese un correo electrónico válido.');
    expect(component.success).toBeFalse();
  });

  it('should call recuperarPassword and navigate on success', (done) => {
    component.correo = 'test@example.com';
    component.sendRecoveryEmail();

    expect(component['authService'].recuperarPassword).toHaveBeenCalledWith('test@example.com');

    // Esperamos que el mensaje de éxito se actualice
    setTimeout(() => {
      expect(component.message).toContain('Revisa tu correo');
      expect(component.success).toBeTrue();
      expect(component['dialogRef'].close).toHaveBeenCalled();
      expect(component['router'].navigate).toHaveBeenCalledWith(['/actualizar-password'], {
        queryParams: { correo: 'test@example.com' }
      });
      done();
    }, 2100);
  });

  it('should show error message on recuperarPassword error', () => {
    component.correo = 'test@example.com';
    component['authService'].recuperarPassword = jasmine.createSpy().and.returnValue(throwError(() => new Error('Error')));
    component.sendRecoveryEmail();

    expect(component.success).toBeFalse();
    expect(component.message).toContain('Error al enviar el correo');
  });

  it('should close dialog on cancelar', () => {
    component.cancelar();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });
});
