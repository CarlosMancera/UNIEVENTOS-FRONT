import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditarArtistaComponent } from './modal-editar-artista.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ModalEditarArtistaComponent', () => {
  let component: ModalEditarArtistaComponent;
  let fixture: ComponentFixture<ModalEditarArtistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalEditarArtistaComponent,
        NoopAnimationsModule  // ✅ Soluciona NG05105 (animaciones)
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { nombre: 'Nombre prueba', genero: 'Pop' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarArtistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with updated artist on guardar()', () => {
    component.artista.nombre = 'Nuevo nombre';
    component.guardar();
    expect((component as any).dialogRef.close).toHaveBeenCalledWith(component.artista);
  });

  it('should close the dialog without data on cancelar()', () => {
    component.cancelar();
    expect((component as any).dialogRef.close).toHaveBeenCalledWith();
  });
});
