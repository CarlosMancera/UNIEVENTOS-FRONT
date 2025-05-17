import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeMock: Partial<ActivatedRouteSnapshot>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerMock = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    routeMock = {
      data: {
        expectedRole: 'admin'
      }
    };
  });

  it('debe permitir el acceso si el usuario tiene el rol esperado', () => {
    authServiceSpy.getCurrentUser.and.returnValue({
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin'
    });

    const result = guard.canActivate(routeMock as any);

    expect(result).toBeTrue();
  });

  it('debe redirigir si el usuario NO tiene el rol esperado', () => {
    const fakeTree = {} as UrlTree;
    authServiceSpy.getCurrentUser.and.returnValue({
      id: 2,
      name: 'Otro Usuario',
      email: 'user@example.com',
      role: 'user'
    });

    routerSpy.parseUrl.and.returnValue(fakeTree);

    const result = guard.canActivate(routeMock as any);

    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/');
    expect(result).toBe(fakeTree);
  });

  it('debe redirigir si no hay usuario logueado', () => {
    const fakeTree = {} as UrlTree;
    authServiceSpy.getCurrentUser.and.returnValue(null);
    routerSpy.parseUrl.and.returnValue(fakeTree);

    const result = guard.canActivate(routeMock as any);

    expect(result).toBe(fakeTree);
  });
});
