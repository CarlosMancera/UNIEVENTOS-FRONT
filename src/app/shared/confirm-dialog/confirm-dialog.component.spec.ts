import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            titulo: 'Confirmar acción',
            mensaje: '¿Estás seguro de que deseas continuar?',
            confirmBtn: 'Sí',
            cancelBtn: 'No'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with true when confirmar is called', () => {
    component.confirmar();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when cancelar is called', () => {
    component.cancelar();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });
});
