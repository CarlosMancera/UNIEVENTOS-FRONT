import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarArtistaComponent } from './modal-editar-artista.component';

describe('ModalEditarArtistaComponent', () => {
  let component: ModalEditarArtistaComponent;
  let fixture: ComponentFixture<ModalEditarArtistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarArtistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarArtistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
