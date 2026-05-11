import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service'; // Asegúrate de que la ruta sea correcta
import { UserProfile } from '../../core/models/user.model'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss' // Asegúrate de que el nombre del archivo SCSS sea correcto
})
export class HomeComponent implements OnInit {
  usuariosRanking: UserProfile[] = [];

  features = [
    { icon: '🎯', title: 'Matching Inteligente', desc: 'Nuestro algoritmo analiza tus skills e intereses y te conecta con el compañero perfecto para intercambiar conocimiento.' },
    { icon: '📅', title: 'Sesiones Organizadas', desc: 'Agenda sesiones virtuales, comparte enlaces de GitHub y mantén el historial de todo lo aprendido.' },
    { icon: '⭐', title: 'Sistema de Valoración', desc: 'Califica y deja reseñas de tus mentores. Construye tu reputación técnica dentro de la comunidad.' },
    { icon: '🔒', title: 'Acceso Seguro', desc: 'Autenticación basada en tokens JWT para garantizar un entorno privado y de confianza.' }
  ];

  stats = [
    { value: '0€', label: 'Coste de las mentorías' },
    { value: '⇄', label: 'Trueque de conocimiento' },
    { value: '∞', label: 'Tecnologías disponibles' },
  ];
user: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarRanking();
  }

  cargarRanking(): void {
    this.userService.searchUsers('').subscribe({
      next: (data) => {
        console.log('--- DATOS CRUDOS DEL BACKEND ---');
        console.table(data); // Esto sacará una tabla preciosa en la consola del navegador
        
        this.usuariosRanking = [...data]
          .sort((a, b) => (b.sesionesCompletadas || 0) - (a.sesionesCompletadas || 0))
          .slice(0, 3);
      },
      error: (err) => console.error(err)
    });
  }
}
