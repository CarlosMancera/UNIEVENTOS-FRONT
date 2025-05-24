import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEquipoComponent } from './modal-equipo.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { TeamService } from '../../../services/Team.service';
import { ImagenService } from '../../../services/ImagenService.service';
import { BcLoadingService } from '../../../services/loading.service';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalEquipoComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule // <- para evitar errores de animaciones
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy() } },
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
});
