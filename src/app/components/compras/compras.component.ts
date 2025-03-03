import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface LocationPrices {
  [key: string]: number;
}

interface Event {
  id: number;
  name: string;
  band: string;
  description: string;
  location: string;
  date: string;
  image: string;
}

@Component({
  selector: 'app-compras',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {
  bookingForm!: FormGroup;
  paymentForm!: FormGroup;
  verificationForm!: FormGroup;

  showPaymentModal: boolean = false;
  showVerificationModal: boolean = false;
  showSuccessModal: boolean = false;
  discountRate: number = 0; // Inicialmente sin descuento
  selectedPaymentMethod: string = ''; 
  cartItems: any[] = [];
  verificationError: boolean = false; 
  cardNumberError: boolean = false; 

  selectedEvent: Event = {
    id: 1,
    name: 'Concierto de Rock',
    band: 'CURA',
    description: 'La Mejor Banda de Rock de la Región',
    location: 'Salón de Eventos Norte',
    date: '15 de Septiembre de 2024',
    image: 'cura.png'
  };

  locations: LocationPrices = {
    'VIP': 80000,
    'Platea': 60000,
    'General': 50000
  };

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.bookingForm = this.fb.group({
      location: ['VIP', Validators.required],
      quantity: [2, [Validators.required, Validators.min(1)]],
      promoCode: ['']
    });

    this.paymentForm = this.fb.group({
      cardHolder: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryDate: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]]
    });

    this.verificationForm = this.fb.group({
      verificationCode: ['', Validators.required]
    });
  }

  getSubtotal(): number {
    const location = this.bookingForm.get('location')?.value as string;
    const quantity = this.bookingForm.get('quantity')?.value as number;
    return this.locations[location] * quantity;
  }

  calculateTotal(): number {
    const subtotal = this.getSubtotal();
    const discountAmount = subtotal * this.discountRate;
    return subtotal - discountAmount;
  }

  updateQuantity(change: number): void {
    const currentQuantity = this.bookingForm.get('quantity')?.value ?? 1;
    const newQuantity = Math.max(1, currentQuantity + change);
    this.bookingForm.patchValue({ quantity: newQuantity });
  }

  applyPromoCode(): void {
    const promoCode = this.bookingForm.get('promoCode')?.value;
    this.discountRate = 0.20; // Aplica el 20% de descuento
    alert("Código de descuento aplicado correctamente.");
  }

  addToCart(): void {
    const item = {
      event: this.selectedEvent,
      location: this.bookingForm.get('location')?.value,
      quantity: this.bookingForm.get('quantity')?.value,
      subtotal: this.getSubtotal()
    };
    this.cartItems.push(item);
    alert('Añadido al carrito');
  }

  openPaymentModal(): void {
    if (this.cartItems.length > 0) {
      this.showPaymentModal = true;
    } else {
      alert('Agrega productos al carrito antes de generar la orden de compra');
    }
  }

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  isPaymentFormValid(): boolean {
    const cardNumber = this.paymentForm.get('cardNumber')?.value;
    this.cardNumberError = cardNumber?.length !== 16;
    return this.paymentForm.valid && this.selectedPaymentMethod !== '' && !this.cardNumberError;
  }

  verifyPurchase(): void {
    if (this.isPaymentFormValid()) {
      this.showPaymentModal = false;
      this.showVerificationModal = true;
    } else {
      alert("Por favor completa todos los campos correctamente.");
    }
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.paymentForm.reset();
    this.selectedPaymentMethod = '';
    this.cardNumberError = false;
  }

  closeVerificationModal(): void {
    this.showVerificationModal = false;
    this.verificationForm.reset();
    this.verificationError = false;
  }

  confirmVerification(): void {
    this.showVerificationModal = false;
    this.showSuccessModal = true;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  getLocationOptions(): string[] {
    return Object.keys(this.locations);
  }

  getLocationPrice(location: string): string {
    return this.locations[location].toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP'
    });
  }

  getDiscountAmount(): number {
    const subtotal = this.getSubtotal();
    return subtotal * this.discountRate;
  }

  isDiscountActive(): boolean {
    return this.discountRate > 0;
  }
}