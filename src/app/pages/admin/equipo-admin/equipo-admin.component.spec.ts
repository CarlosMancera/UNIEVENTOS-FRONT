import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipoAdminComponent } from './equipo-admin.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamService } from '../../../services/Team.service';
import { BcLoadingService } from '../../../services/loading.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Team } from '../../../models/team.model';

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

class MockMatSnackBar {
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
      imports: [
        EquipoAdminComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TeamService, useClass: MockTeamService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
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

  it('should call teamService.listar on init', () => {
    expect(component['teamService'].listar).toHaveBeenCalled();
  });

  it('should call cargarEquipos and show snackbar after modal closes', () => {
    const spy = spyOn(component, 'cargarEquipos');
    component.abrirModal();
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component['snackBar'].open).toHaveBeenCalledWith('Equipo guardado correctamente', 'Cerrar', { duration: 3000 });
  });

  it('should call eliminar, recargar y mostrar snackbar', () => {
    const spy = spyOn(component, 'cargarEquipos');
    component.eliminar(1);
    expect(component['teamService'].eliminar).toHaveBeenCalledWith(1);
    expect(component['bcLoadingService'].show).toHaveBeenCalledWith('Cargando datos...');
    expect(component['bcLoadingService'].close).toHaveBeenCalled();
    expect(component['snackBar'].open).toHaveBeenCalledWith('Equipo eliminado', 'Cerrar', { duration: 3000 });
    expect(spy).toHaveBeenCalled();
  });
});
