import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EquipoAdminComponent } from './equipo-admin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BcLoadingService } from '../../../services/loading.service';
import { TeamService } from '../../../services/Team.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
  open = jasmine.createSpy('open');
}

class MockBcLoadingService {
  show = jasmine.createSpy('show');
  close = jasmine.createSpy('close');
}

describe('EquipoAdminComponent', () => {
  let component: EquipoAdminComponent;
  let fixture: ComponentFixture<EquipoAdminComponent>;
  let teamService: MockTeamService;
  let snackBar: MockMatSnackBar;

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
      ],
      schemas: [NO_ERRORS_SCHEMA] // ✅ Ignora ModalEquipoComponent y otros standalone
    }).compileComponents();

    fixture = TestBed.createComponent(EquipoAdminComponent);
    component = fixture.componentInstance;
    teamService = TestBed.inject(TeamService) as any;
    snackBar = TestBed.inject(MatSnackBar) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call teamService.listar on init', () => {
    expect(teamService.listar).toHaveBeenCalled();
  });

  it('should call cargarEquipos and show snackbar after modal closes', fakeAsync(() => {
    const cargarSpy = spyOn(component as any, 'cargarEquipos');
    component.abrirModal();
    tick(); // ⏳ procesa el afterClosed
    fixture.detectChanges(); // 🔄 procesa cambios del DOM
    expect(cargarSpy).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Equipo guardado correctamente',
      'Cerrar',
      { duration: 3000 }
    );
  }));

  it('should call eliminar, recargar y mostrar snackbar', fakeAsync(() => {
    const cargarSpy = spyOn(component as any, 'cargarEquipos');
    component.eliminar(1);
    tick(); // ⏳ procesa la suscripción de eliminar
    fixture.detectChanges(); // 🔄 actualiza los cambios
    expect(teamService.eliminar).toHaveBeenCalledWith(1);
    expect(cargarSpy).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Equipo eliminado',
      'Cerrar',
      { duration: 3000 }
    );
  }));
});
