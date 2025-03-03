import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent {
  searchTerm: string = '';
  selectedType: string = '';
  selectedCity: string = '';

  eventTypes = ['Concierto', 'Teatro', 'Otro'];
  cities = ['Armenia', 'Bogotá', 'Cali', 'Medellín'];

  events = [
    {
      title: 'Concierto de Rock',
      subtitle: 'Banda Cura',
      date: '15 de Septiembre',
      location: 'Armenia',
      imageUrl: 'cura.png',
      available: true,
      type: 'Concierto'
    },
    {
      title: 'Festival de Jazz',
      subtitle: 'Evocando a Louis Armstrong',
      date: '19 de Septiembre',
      location: 'Bogotá',
      imageUrl: 'jazz.jpg',
      available: true,
      type: 'Concierto'
    },
    {
      title: 'COMIC-CON',
      subtitle: 'Invitados Sorpresa',
      date: '20 octubre',
      location: 'Armenia',
      imageUrl: 'comic-con.jpg',
      available: true,
      type: 'Otro'
    },
    {
      title: 'Regocijo Espiritual',
      subtitle: 'Meditando en el Akash',
      date: '15 de Septiembre',
      location: 'Armenia',
      imageUrl: 'espiritual.png',
      available: true,
      type: 'Otro'
    },
    {
      title: 'Circo del Sol',
      subtitle: 'Los mejores Malabaristas',
      date: '19 de Septiembre',
      location: 'Bogotá',
      imageUrl: 'circo.jpg',
      available: true,
      type: 'Otro'
    },
    {
      title: 'Superacion personal',
      subtitle: 'Invitados Sorpresa',
      date: '20 octubre',
      location: 'Armenia',
      imageUrl: 'elnegro.jpg',
      available: true,
      type: 'Otro'
    }
  ];

  currentSlide = 0;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.events.length;
  }

  previousSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.events.length) % this.events.length;
  }

  filteredEvents() {
    return this.events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.selectedType || event.type === this.selectedType;
      const matchesCity = !this.selectedCity || event.location === this.selectedCity;
      return matchesSearch && matchesType && matchesCity;
    });
  }

}
