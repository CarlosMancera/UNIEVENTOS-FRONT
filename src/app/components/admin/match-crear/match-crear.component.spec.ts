import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchCrearComponent } from './match-crear.component';
import { MatchService } from '../../../services/match.service';
import { ImagenService } from '../../../services/ImagenService.service';
import { TeamService } from '../../../services/Team.service';
import { SectionService } from '../../../services/section.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

// Mocks
class MockMatchService {
  crear = jasmine.createSpy().and.returnValue(of(1));
  actualizar = jasmine.createSpy().and.returnValue(of(null));
  obtener = jasmine.createSpy().and.returnValue(of({
    id: 1,
    equipoLocal: '',
    equipoVisitante: '',
    fechaHora: '',
    estado: 'PROGRAMADO',
    tipoEvento: '',
    imagenPortada: '',
    descripcion: ''
  }));
  listar = jasmine.createSpy().and.returnValue(of([]));
}

class MockImagenService {
  subirImagen = jasmine.createSpy().and.returnValue(of('url-imagen'));
}

class MockTeamService {
  listar = jasmine.createSpy().and.returnValue(of([]));
}

class MockSectionService {
  crear = jasmine.createSpy().and.returnValue(of(1));
  eliminar = jasmine.createSpy().and.returnValue(of(null));
  listarPorMatch = jasmine.createSpy().and.returnValue(of([]));
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: () => null // Cambia a '1' si deseas simular edición
    }
  };
}

describe('MatchCrearComponent', () => {
  let component: MatchCrearComponent;
  let fixture: ComponentFixture<MatchCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchCrearComponent],
      providers: [
        { provide: MatchService, useClass: MockMatchService },
        { provide: ImagenService, useClass: MockImagenService },
        { provide: TeamService, useClass: MockTeamService },
        { provide: SectionService, useClass: MockSectionService },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatchCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call teamService.listar on init', () => {
    expect(component['teamService'].listar).toHaveBeenCalled();
  });

  it('should call matchService.crear when match.id is undefined', () => {
    component.match = {
      equipoLocal: 'A',
      equipoVisitante: 'B',
      fechaHora: '2025-06-01',
      estado: 'PROGRAMADO',
      tipoEvento: 'CONCIERTO',
      imagenPortada: '',
      descripcion: ''
    };
    component.guardarPartido();
    expect(component['matchService'].crear).toHaveBeenCalled();
  });

  it('should call matchService.actualizar when match.id is present', () => {
    component.match = {
      id: 1,
      equipoLocal: 'A',
      equipoVisitante: 'B',
      fechaHora: '2025-06-01',
      estado: 'PROGRAMADO',
      tipoEvento: 'CONCIERTO',
      imagenPortada: '',
      descripcion: ''
    };
    component.guardarPartido();
    expect(component['matchService'].actualizar).toHaveBeenCalled();
  });
});
