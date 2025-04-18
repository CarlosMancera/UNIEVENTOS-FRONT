import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoAdminComponent } from './equipo-admin.component';

describe('EquipoAdminComponent', () => {
  let component: EquipoAdminComponent;
  let fixture: ComponentFixture<EquipoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
