import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipoAdminComponent } from './equipo-admin.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamService } from '../../../services/Team.service';
import { BcLoadingService } from '../../../services/loading.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

// 👉 Mocks
class MockTeamService {
  listar = jasmine.createSpy().and.returnValue(of([]));
  eliminar = jasmine.createSpy().and.returnValue(of(null));
}

class MockDialogRef {
  close = jasmine.createSpy();
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of({ nombre: 'nuevo equipo' }) // 🧠 simula creación válida
    };
  }
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
      ]
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

  it('should call cargarEquipos and show snackbar after modal closes', (done) => {
    const cargarSpy = spyOn(component as any, 'cargarEquipos');
    component.abrirModal();
    // Esperar ciclo de vida de `afterClosed()`
    setTimeout(() => {
      expect(cargarSpy).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Equipo guardado correctamente',
        'Cerrar',
        { duration: 3000 }
      );
      done();
    });
  });

  it('should call eliminar, recargar y mostrar snackbar', (done) => {
    const cargarSpy = spyOn(component as any, 'cargarEquipos');
    component.eliminar(1);
    // Espera a que el observable de `eliminar` se complete
    setTimeout(() => {
      expect(teamService.eliminar).toHaveBeenCalledWith(1);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Equipo eliminado',
        'Cerrar',
        { duration: 3000 }
      );
      expect(cargarSpy).toHaveBeenCalled();
      done();
    });
  });
});
