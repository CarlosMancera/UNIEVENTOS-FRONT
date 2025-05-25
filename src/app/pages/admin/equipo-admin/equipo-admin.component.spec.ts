import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipoAdminComponent } from './equipo-admin.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamService } from '../../../services/Team.service';
import { BcLoadingService } from '../../../services/loading.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('EquipoAdminComponent', () => {
  let component: EquipoAdminComponent;
  let fixture: ComponentFixture<EquipoAdminComponent>;

  // Mocks actualizados
  const teamServiceMock = {
    listar: jasmine.createSpy().and.returnValue(of([])),
    eliminar: jasmine.createSpy().and.returnValue(of(null))
  };

  const dialogMock = {
    open: jasmine.createSpy().and.returnValue({
      afterClosed: () => of(true)
    })
  };

  const snackBarMock = {
    open: jasmine.createSpy()
  };

  const loadingServiceMock = {
    show: jasmine.createSpy(),
    close: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EquipoAdminComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TeamService, useValue: teamServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: BcLoadingService, useValue: loadingServiceMock }
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
    expect(teamServiceMock.listar).toHaveBeenCalled();
  });

  it('should call cargarEquipos and show snackbar after modal closes', () => {
    const cargarSpy = spyOn(component as any, 'cargarEquipos');
    component.abrirModal();
    expect(dialogMock.open).toHaveBeenCalled();
    expect(cargarSpy).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith('Equipo guardado correctamente', 'Cerrar', { duration: 3000 });
  });

  it('should call eliminar, recargar y mostrar snackbar', () => {
    const cargarSpy = spyOn(component as any, 'cargarEquipos');
    component.eliminar(1);
    expect(teamServiceMock.eliminar).toHaveBeenCalledWith(1);
    expect(loadingServiceMock.show).toHaveBeenCalledWith('Cargando datos...');
    expect(loadingServiceMock.close).toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith('Equipo eliminado', 'Cerrar', { duration: 3000 });
    expect(cargarSpy).toHaveBeenCalled();
  });
});
