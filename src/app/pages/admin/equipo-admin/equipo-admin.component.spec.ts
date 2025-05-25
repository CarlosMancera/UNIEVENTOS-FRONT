import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { EquipoAdminComponent } from './equipo-admin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BcLoadingService } from '../../../services/loading.service';
import { TeamService } from '../../../services/Team.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockTeamService {
  listar = jasmine.createSpy().and.returnValue(of([]));
  eliminar = jasmine.createSpy().and.returnValue(of(null));
}

class MockMatDialogRef {
  afterClosed = jasmine.createSpy().and.returnValue(of(true));
  componentInstance = {};
}

class MockMatDialog {
  open = jasmine.createSpy().and.returnValue(new MockMatDialogRef());
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
      schemas: [NO_ERRORS_SCHEMA]
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


});
