import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { BcLoadingService } from './services/loading.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { BcLoadingComponent } from './components/bc-loading/bc-loading.component';

// ✅ Mocks
class MockAuthService {
  currentUser$ = of({ name: 'Usuario Prueba' });
  checkAuthentication = jasmine.createSpy('checkAuthentication');
  logout = jasmine.createSpy('logout').and.returnValue(of('Sesión cerrada'));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockBcLoadingService {
  show = jasmine.createSpy();
  close = jasmine.createSpy();
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 👇 Standalone component
      imports: [
        AppComponent,
        RouterTestingModule.withRoutes([]),
        CommonModule,
        BcLoadingComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { provide: BcLoadingService, useClass: MockBcLoadingService },
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
    expect(component['router'].navigate).toHaveBeenCalledWith(['/']);
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
