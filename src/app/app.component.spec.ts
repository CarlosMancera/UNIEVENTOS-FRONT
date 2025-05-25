import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { BcLoadingService } from './services/loading.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

// Mocks
class MockAuthService {
  currentUser$ = of({ name: 'Usuario Prueba' });
  checkAuthentication = jasmine.createSpy('checkAuthentication');
  logout = jasmine.createSpy('logout').and.returnValue(of('Sesión cerrada'));

    isLoggedIn() {
    return true;
  }

  // 👇 SI USAS TAMBIÉN ESTO EN HTML
  getCurrentUser() {
    return { name: 'Usuario Prueba', role: 'admin' };
  }
}

class MockBcLoadingService {
  loading = of({ action: 'show', text: 'Cargando...' });
  show = jasmine.createSpy('show');
  close = jasmine.createSpy('close');
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]), // ✅ configura el router correctamente
        AppComponent                        // ✅ standalone se importa aquí
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: BcLoadingService, useClass: MockBcLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title "UNIEVENTOS"', () => {
    expect(component.title).toBe('UNIEVENTOS');
  });

  it('should call authService.checkAuthentication on init', () => {
    expect(component['authService'].checkAuthentication).toHaveBeenCalled();
  });

  it('should update usuarioNombre from currentUser$', () => {
    expect(component.usuarioNombre).toBe('Usuario Prueba');
  });

  it('should navigate to / and close session on logout success', () => {
    component.logout(new MouseEvent('click'));
    expect(component['authService'].logout).toHaveBeenCalled();
    expect(component['bcLoadingService'].close).toHaveBeenCalled();
  });

  it('should close dropdown and menu when document is clicked', () => {
    component.isMenuOpen = true;
    component.dropdownVisible = true;
    component.onDocumentClick(new MouseEvent('click'));
    expect(component.isMenuOpen).toBeFalse();
    expect(component.dropdownVisible).toBeFalse();
  });
});
