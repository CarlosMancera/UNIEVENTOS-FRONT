import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEquipoComponent } from './modal-equipo.component';

describe('ModalEquipoComponent', () => {
  let component: ModalEquipoComponent;
  let fixture: ComponentFixture<ModalEquipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEquipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEquipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
