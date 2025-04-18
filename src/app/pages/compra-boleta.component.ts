import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Match } from '../models/match.model';
import { Section } from '../models/section.model';
import { AuthService } from '../services/auth.service';
import { HttpClientService } from '../services/HttpClientService.service';
import { MatchService } from '../services/match.service';
import { SectionService } from '../services/section.service';
import { CrearTicketDTO } from '../dto/CrearTicketDTO';
import { ENDPOINTS } from '../core/endpoints';
import { Team } from '../models/team.model';
import { TeamService } from '../services/Team.service';
import { CuentaService } from '../services/cuenta.service';

@Component({
  selector: 'app-compra-boleta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './compra-boleta.component.html',
  styleUrls: ['./compra-boleta.component.css']
})
export class CompraBoletaComponent implements OnInit {
  match!: Match;
  sections: Section[] = [];
  equipos: Team[] = [];
  form!: FormGroup;
  portadores!: FormArray;
  soyElPortador: boolean = false;
  adminData = {
    cedula: '',
    nombreCompleto: '',
    direccion: '',
    telefono: '',
    correo: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  };

  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private sectionService: SectionService,
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    private authService: AuthService,
    private http: HttpClientService,
    private router: Router,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {

    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para continuar.');
      this.router.navigate(['/login']);
      return;
    }

    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      alert('No se pudo obtener el ID del usuario.');
      return;
    }

    const pathParams = new Map<string, string>();
    pathParams.set('id', userId.toString());

    this.http.get<any>(ENDPOINTS.recuperaInfoCuenta, pathParams).subscribe({
      next: (data) => {
        this.adminData = {
          cedula: data.cedula,
          nombreCompleto: data.nombre,
          direccion: data.direccion,
          telefono: data.telefono,
          correo: data.email,
          nuevaContrasena: '',
          confirmarContrasena: ''
        };
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Error al obtener información del administrador:', err);
        alert('Error al obtener información del administrador.');
      }
    });


    const matchId = Number(this.route.snapshot.paramMap.get('id'));

    this.matchService.obtener(matchId).subscribe({
      next: (data) => {
        this.match = data;
        this.cargarSecciones(data.id!);
      },
      error: () => {
        alert('Partido no encontrado');
        this.router.navigate(['/']);
      }
    });

    this.teamService.listar().subscribe({
      next: (data) => this.equipos = data,
      error: () => console.error('Error al cargar equipos')
    });

    this.portadores = this.fb.array([]);
    this.form = this.fb.group({
      cantidad: [1, [Validators.required, Validators.min(1)]],
      soyElPortador: [false],
      portadores: this.portadores
    });

    this.actualizarCantidadBoletas();
  }

  private cargarSecciones(matchId: number): void {
    this.sectionService.listarPorMatch(matchId).subscribe({
      next: (sections) => (this.sections = sections),
      error: () => alert('Error al cargar las secciones')
    });
  }

  actualizarCantidadBoletas(): void {
    const cantidad = this.form.get('cantidad')?.value || 1;
    this.portadores.clear();

    for (let i = 0; i < cantidad; i++) {
      this.portadores.push(
        this.fb.group({
          sectionId: ['', Validators.required],
          cedula: ['', Validators.required],
          nombre: ['', Validators.required],
          direccion: ['', Validators.required],
          telefono: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          soyElPortador: [false]
        })
      );
    }
  }

  get portadoresArray(): FormArray {
    return this.form.get('portadores') as FormArray;
  }

  calcularTotal(): number {
    return this.portadoresArray.controls.reduce((total, p) => {
      const sectionId = p.get('sectionId')?.value;
      const section = this.sections.find(s => s.id == sectionId);
      return total + (section?.precio || 0);
    }, 0);
  }

  comprar(): void {
    if (this.form.invalid || !this.match) return;

    const cuentaId = this.authService.getUserIdFromToken();
    if (!cuentaId) {
      alert('Error: Usuario no autenticado.');
      this.router.navigate(['/login']);
      return;
    }

    const portadores = this.portadoresArray.getRawValue();

    for (let p of portadores) {
      const ticket: CrearTicketDTO = {
        matchId: this.match.id!,
        sectionId: p.sectionId,
        cuentaId,
        cedulaPortador: p.cedula,
        nombrePortador: p.nombre,
        direccionPortador: p.direccion,
        telefonoPortador: p.telefono,
        emailPortador: p.email
      };

      this.http.post(ENDPOINTS.crearTicket, ticket).subscribe({
        next: () => {},
        error: (err) => {
          alert('Error al realizar la compra: ' + (err.error?.mensaje || 'Error interno'));
        }
      });
    }

    alert('Compra realizada. Se han enviado los tickets.');
    this.router.navigate(['/']);
  }

  obtenerEscudo(nombre: string): string {
    const equipo = this.equipos.find(e => e.nombre === nombre);
    return equipo?.escudoUrl || 'default.png';
  }

  obtenerCiudad(nombre: string): string {
    const equipo = this.equipos.find(e => e.nombre === nombre);
    return equipo?.ciudad || 'Ciudad desconocida';
  }

  onTogglePortador(index: number): void {
    const grupo = this.portadoresArray.at(index);
    const soyElPortadorValue = grupo.get('soyElPortador')?.value;

    if (soyElPortadorValue) {
      this.marcarComoPortador(index);
    } else {
      this.desmarcarPortador(index);
    }
  }

  marcarComoPortador(index: number): void {
    this.portadoresArray.controls.forEach((grupo, i) => {
      const soyElPortadorCtrl = grupo.get('soyElPortador');
      if (!soyElPortadorCtrl) return;

      if (i === index) {
        soyElPortadorCtrl.setValue(true);
        grupo.patchValue({
          cedula: this.adminData.cedula,
          nombre: this.adminData.nombreCompleto,
          direccion: this.adminData.direccion,
          telefono: this.adminData.telefono,
          email: this.adminData.correo
        });

        grupo.get('cedula')?.disable();
        grupo.get('nombre')?.disable();
        grupo.get('direccion')?.disable();
        grupo.get('telefono')?.disable();
        grupo.get('email')?.disable();
      } else {
        soyElPortadorCtrl.setValue(false);
        this.desmarcarPortador(i);
      }
    });
  }

  desmarcarPortador(index: number): void {
    const grupo = this.portadoresArray.at(index);
    grupo.get('cedula')?.reset('');
    grupo.get('nombre')?.reset('');
    grupo.get('direccion')?.reset('');
    grupo.get('telefono')?.reset('');
    grupo.get('email')?.reset('');

    grupo.get('cedula')?.enable();
    grupo.get('nombre')?.enable();
    grupo.get('direccion')?.enable();
    grupo.get('telefono')?.enable();
    grupo.get('email')?.enable();
  }

}
