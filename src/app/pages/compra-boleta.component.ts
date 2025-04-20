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
import Swal from 'sweetalert2';
import { ENDPOINTS } from '../core/endpoints';
import { Team } from '../models/team.model';
import { TeamService } from '../services/Team.service';
import { CuentaService } from '../services/cuenta.service';
import { ChangeDetectorRef } from '@angular/core';
import { BcLoadingService } from '../services/loading.service';

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
  codigoVerificacionGenerado: string = '';

  isEditing = false;

  // Pasarela de pago
  showPaymentModal: boolean = false;
  showVerificationModal: boolean = false;
  showSuccessModal: boolean = false;
  paymentForm!: FormGroup;
  verificationCode: string = '';
  selectedPaymentMethod: string = '';
  cardNumberError: boolean = false;
  verificationForm!: FormGroup;
  selectedEvent: any = {}; // usado por modales

  constructor(
    private route: ActivatedRoute,
    private matchService: MatchService,
    private sectionService: SectionService,
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    private authService: AuthService,
    private http: HttpClientService,
    private router: Router,
    private teamService: TeamService,
    private cd: ChangeDetectorRef,
    private bcLoadingService: BcLoadingService

  ) {}

  ngOnInit(): void {

    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para continuar.');
      this.router.navigate(['/login']);
      return;
    }
    this.bcLoadingService.show('Cargando datos...');
    this.verificationForm = this.fb.group({
      verificationCode: ['', Validators.required]
    });


    this.paymentForm = this.fb.group({
      cardHolder: ['', Validators.required],
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^([0-9]{4}\\s?){4}$')
        ]
      ],
      expiryDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    });

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
        this.bcLoadingService.close();

      },
      error: (err) => {
        console.error('Error al obtener información del administrador:', err);
        alert('Error al obtener información del administrador.');
        this.bcLoadingService.close();
      }
    });

    const matchId = Number(this.route.snapshot.paramMap.get('id'));

    this.matchService.obtener(matchId).subscribe({
      next: (data) => {
        this.match = data;
        this.selectedEvent = { name: `${data.equipoLocal} vs ${data.equipoVisitante}`, date: data.fechaHora };
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
    let cantidad = this.form.get('cantidad')?.value || 1;

    if (cantidad > 3) {
      cantidad = 3;
      this.form.patchValue({ cantidad });
      Swal.fire({
        icon: 'warning',
        title: 'Límite de Boletas',
        text: 'Solo puedes comprar un máximo de 3 boletas por cuenta.',
        confirmButtonText: 'Entendido'
      });
    }

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
      const sectionId = +p.get('sectionId')?.value;
      const section = this.sections.find(s => s.id === sectionId);
      return total + (section?.precio || 0);
    }, 0);
  }

  isPaymentFormValid(): boolean {
    const rawCardNumber = this.paymentForm.get('cardNumber')?.value || '';
    const cardNumber = rawCardNumber.replace(/\s/g, '');
    this.cardNumberError = cardNumber.length !== 16;
    const resultado = this.paymentForm.valid && this.selectedPaymentMethod !== '' && !this.cardNumberError;
    return resultado;
  }


  comprar(): void {
    this.showPaymentModal = true;
  }

  confirmVerification(): void {

    const inputCode = this.verificationForm.get('verificationCode')?.value?.trim().toUpperCase();
    const expectedCode = this.codigoVerificacionGenerado;
    if (inputCode !== expectedCode) {
      Swal.fire('❌ Código inválido', 'Verifica tu correo e intenta nuevamente.', 'error');
      return;
    }
    this.bcLoadingService.show('Procesando compra...');
    const cuentaId = this.authService.getUserIdFromToken();
    if (!cuentaId || !this.match) return;

    const tickets = this.portadoresArray.getRawValue().map(p => ({
      matchId: this.match.id!,
      sectionId: p.sectionId,
      cuentaId,
      cedulaPortador: p.cedula,
      nombrePortador: p.nombre,
      direccionPortador: p.direccion,
      telefonoPortador: p.telefono,
      emailPortador: p.email
    }));

    const compraPayload = {
      cuentaId,
      matchId: this.match.id!,
      tickets
    };

    this.http.post(ENDPOINTS.crearCompra, compraPayload).subscribe({
      next: () => {
        this.showVerificationModal = false;
        this.showSuccessModal = true;
        this.bcLoadingService.close();
      },
      error: (error) => {
        this.bcLoadingService.close();
        Swal.fire('❌ Error en la compra', error?.error || 'No se pudieron procesar todas las entradas.', 'error');
      }
    });
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentForm.reset();
    this.selectedPaymentMethod = '';
    this.cardNumberError = false;
  }

  closeVerificationModal(): void {
    this.showVerificationModal = false;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/']);
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  getLocationPrice(sectionId: string): string {
    const section = this.sections.find(s => s.id === +sectionId);
    return section?.precio?.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) || 'COP 0';
  }

  getDiscountAmount(): number {
    return this.calcularTotal() * 0.2;
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

  obtenerEscudo(nombre: string): string {
    const equipo = this.equipos.find(e => e.nombre === nombre);
    return equipo?.escudoUrl || 'default.png';
  }

  obtenerCiudad(nombre: string): string {
    const equipo = this.equipos.find(e => e.nombre === nombre);
    return equipo?.ciudad || 'Ciudad desconocida';
  }

  onCardNumberInput(): void {
    const control = this.paymentForm.get('cardNumber');
    const rawValue = control?.value || '';
    const digits = rawValue.replace(/\D/g, '').slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    control?.setValue(formatted, { emitEvent: false });
    this.cardNumberError = digits.length !== 16;
    this.cd.detectChanges();
  }


  onExpiryDateInput(): void {
    const control = this.paymentForm.get('expiryDate');
    let value = control?.value || '';
    value = value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    control?.setValue(value, { emitEvent: false });
  }

  onCardHolderInput(): void {
    const control = this.paymentForm.get('cardHolder');
    let value: string = control?.value || '';

    value = value.toUpperCase();

    control?.setValue(value, { emitEvent: false });
  }


  verifyPurchase(): void {
    this.bcLoadingService.show('Cargando datos...');

    if (!this.isPaymentFormValid()) return;

    if (!this.validarDisponibilidadPorSeccion()) return;

    const codigoVerificacion = this.generarCodigoVerificacion();
    const cuentaEmail = this.adminData.correo;

    const emailPayload = {
      destinatario: cuentaEmail,
      asunto: 'Código de verificación - UniEventos',
      cuerpo: `Gracias por tu compra 🎉.\nTu código de verificación es: ${codigoVerificacion}`
    };

    this.http.post(ENDPOINTS.enviarCodigoPago, emailPayload).subscribe({
      next: () => {
        this.codigoVerificacionGenerado = codigoVerificacion;
        this.showPaymentModal = false;
        this.showVerificationModal = true;
        this.bcLoadingService.close();

      },
      error: err => {
        console.error('Error enviando el email:', err);
        alert('Hubo un problema al enviar el código de verificación.');
        this.bcLoadingService.close();

      }
    });
  }

  generarCodigoVerificacion(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
  }

  validarDisponibilidadPorSeccion(): boolean {
    const conteo: Record<number, number> = {};

    for (let portador of this.portadoresArray.controls) {
      const id = +portador.get('sectionId')?.value;
      if (!conteo[id]) {
        conteo[id] = 1;
      } else {
        conteo[id]++;
      }
    }

    for (let id in conteo) {
      const section = this.sections.find(s => s.id === +id);
      if (section && conteo[id] > section.capacidadRestante) {
        Swal.fire({
          icon: 'error',
          title: 'Capacidad Insuficiente',
          text: `La sección "${section.nombre}" solo tiene ${section.capacidadRestante} disponibles.`,
          confirmButtonText: 'Cambiar selección'
        });
        return false;
      }
    }

    return true;
  }

  get seccionesDisponibles(): Section[] {
    return this.sections.filter(s => s.capacidadRestante > 0);
  }

  onSectionChange(): void {
    const conteo: Record<number, number> = {};

    for (let portador of this.portadoresArray.controls) {
      const sectionId = +portador.get('sectionId')?.value;
      if (!sectionId) continue;

      conteo[sectionId] = (conteo[sectionId] || 0) + 1;

      const section = this.sections.find(s => s.id === sectionId);
      if (section && conteo[sectionId] > section.capacidadRestante) {
        portador.get('sectionId')?.setValue('');

        Swal.fire({
          icon: 'warning',
          title: 'Sección sin disponibilidad',
          text: `La sección "${section.nombre}" solo tiene ${section.capacidadRestante} cupos disponibles.`,
          confirmButtonText: 'Entendido'
        });
      }
    }
  }

}
