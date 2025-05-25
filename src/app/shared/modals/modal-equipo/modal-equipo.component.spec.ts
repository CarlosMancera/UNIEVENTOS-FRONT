import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEquipoComponent } from './modal-equipo.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { TeamService } from '../../../services/Team.service';
import { ImagenService } from '../../../services/ImagenService.service';
import { BcLoadingService } from '../../../services/loading.service';
import { Team } from '../../../models/team.model';

// Mocks
class MockTeamService {
  crear = jasmine.createSpy().and.returnValue(of({}));
  actualizar = jasmine.createSpy().and.returnValue(of({}));
}

class MockImagenService {
  subirImagen = jasmine.createSpy().and.returnValue(of('url-de-prueba'));
}

class MockBcLoadingService {
  show = jasmine.createSpy();
  close = jasmine.createSpy();

}

describe('ModalEquipoComponent', () => {
  let component: ModalEquipoComponent;
  let fixture: ComponentFixture<ModalEquipoComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ModalEquipoComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ModalEquipoComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: TeamService, useClass: MockTeamService },
        { provide: ImagenService, useClass: MockImagenService },
        { provide: BcLoadingService, useClass: MockBcLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call crear when equipo.id is not defined', () => {
    component.equipo = {
      nombre: 'Test FC',
      ciudad: 'Palmira',
      entrenador: 'Juan Pérez',
      escudoUrl: ''
    };

    component.guardarEquipo();

    const teamService = TestBed.inject(TeamService) as unknown as MockTeamService;
    expect(teamService.crear).toHaveBeenCalledWith(component.equipo);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call actualizar when equipo.id is defined', () => {
    component.equipo = {
      id: 1,
      nombre: 'Test FC',
      ciudad: 'Palmira',
      entrenador: 'Juan Pérez',
      escudoUrl: ''
    };

    component.guardarEquipo();

    const teamService = TestBed.inject(TeamService) as unknown as MockTeamService;
    expect(teamService.actualizar).toHaveBeenCalledWith(1, component.equipo);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should set image url and call guardarEquipo when imagenSeleccionada exists', () => {
    const fakeFile = new File([''], 'test.png', { type: 'image/png' });
    component.imagenSeleccionada = fakeFile;

    component.equipo = {
      nombre: 'Test FC',
      ciudad: 'Palmira',
      entrenador: 'Juan Pérez',
      escudoUrl: ''
    };

    const guardarSpy = spyOn(component, 'guardarEquipo').and.callThrough();

    component.subirImagenYGuardar();

    const imagenService = TestBed.inject(ImagenService) as unknown as MockImagenService;
    expect(imagenService.subirImagen).toHaveBeenCalledWith(fakeFile);
    expect(guardarSpy).toHaveBeenCalled();
  });
});
