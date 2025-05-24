import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipoAdminComponent } from './equipo-admin.component';
import { TeamService } from '../../../services/Team.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BcLoadingService } from '../../../services/loading.service';
import { of } from 'rxjs';

// Mocks
class MockTeamService {
  listar = jasmine.createSpy().and.returnValue(of([]));
  eliminar = jasmine.createSpy().and.returnValue(of(null));
}

class MockMatDialog {
  open = jasmine.createSpy().and.returnValue({
    afterClosed: () => of(true)
  });
}

class MockSnackBar {
  open = jasmine.createSpy();
}

class MockBcLoadingService {
  show = jasmine.createSpy();
  close = jasmine.createSpy();
}

describe('EquipoAdminComponent', () => {
  let component: EquipoAdminComponent;
  let fixture: ComponentFixture<EquipoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipoAdminComponent],
      providers: [
        { provide: TeamService, useClass: MockTeamService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatSnackBar, useClass: MockSnackBar },
        { provide: BcLoadingService, useClass: MockBcLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call listar equipos on init', () => {
    expect(component['teamService'].listar).toHaveBeenCalled();
  });

  it('should open dialog and reload equipos after modal closed', () => {
    const spy = spyOn(component, 'cargarEquipos');
    component.abrirModal();
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component['snackBar'].open).toHaveBeenCalledWith('Equipo guardado correctamente', 'Cerrar', { duration: 3000 });
  });

  it('should call eliminar equipo and reload equipos', () => {
    const spy = spyOn(component, 'cargarEquipos');
    component.eliminar(1);
    expect(component['teamService'].eliminar).toHaveBeenCalledWith(1);
    expect(component['bcLoadingService'].show).toHaveBeenCalledWith('Cargando datos...');
    expect(component['bcLoadingService'].close).toHaveBeenCalled();
    expect(component['snackBar'].open).toHaveBeenCalledWith('Equipo eliminado', 'Cerrar', { duration: 3000 });
    expect(spy).toHaveBeenCalled();
  });
});
