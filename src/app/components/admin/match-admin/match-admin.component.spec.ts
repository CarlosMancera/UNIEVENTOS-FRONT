import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchAdminComponent } from './match-admin.component';
import { Router } from '@angular/router';
import { MatchService } from '../../../services/match.service';
import { of } from 'rxjs';

// Mock para MatchService
class MockMatchService {
  listar = jasmine.createSpy().and.returnValue(of([]));
  eliminar = jasmine.createSpy().and.returnValue(of(null));
}

// Mock para Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('MatchAdminComponent', () => {
  let component: MatchAdminComponent;
  let fixture: ComponentFixture<MatchAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchAdminComponent],
      providers: [
        { provide: MatchService, useClass: MockMatchService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call MatchService.listar on init', () => {
    expect(component['matchService'].listar).toHaveBeenCalled();
  });

  it('should navigate to create page when crear() is called', () => {
    component.crear();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/admin/crear-partido']);
  });

  it('should navigate to edit page when editar() is called', () => {
    component.editar(123);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/admin/editar-partido', 123]);
  });
});
