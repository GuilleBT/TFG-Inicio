import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  features = [
    {
      icon: '🎯',
      title: 'Matching Inteligente',
      desc: 'Nuestro algoritmo analiza tus skills e intereses y te conecta con el compañero perfecto para intercambiar conocimiento.'
    },
    {
      icon: '📅',
      title: 'Sesiones Organizadas',
      desc: 'Agenda sesiones virtuales, comparte enlaces de GitHub y mantén el historial de todo lo aprendido.'
    },
    {
      icon: '⭐',
      title: 'Sistema de Valoración',
      desc: 'Califica y deja reseñas de tus mentores. Construye tu reputación técnica dentro de la comunidad.'
    },
    {
      icon: '🔒',
      title: 'Acceso Seguro',
      desc: 'Autenticación basada en tokens JWT para garantizar un entorno privado y de confianza.'
    }
  ];

  stats = [
    { value: '0€', label: 'Coste de las mentorías' },
    { value: '⇄', label: 'Trueque de conocimiento' },
    { value: '∞', label: 'Tecnologías disponibles' },
  ];
}