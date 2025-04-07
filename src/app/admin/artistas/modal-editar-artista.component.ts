import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-editar-artista',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './modal-editar-artista.component.html',
  styleUrls: ['./modal-editar-artista.component.css']
})
export class ModalEditarArtistaComponent {
  artista: any;

  constructor(
    private dialogRef: MatDialogRef<ModalEditarArtistaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.artista = { ...data };
  }

  guardar() {
    this.dialogRef.close(this.artista);
  }

  cancelar() {
    this.dialogRef.close();
  }
}
