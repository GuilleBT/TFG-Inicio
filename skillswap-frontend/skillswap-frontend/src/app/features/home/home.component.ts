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
  topLanguages: { nombre: string; count: number }[] = [];

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarRanking();
  }

  cargarRanking(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        console.log('--- DATOS CRUDOS DEL BACKEND ---');
        console.table(data);

        this.usuariosRanking = [...data]
          .sort((a, b) => (b.sesionesCompletadas || 0) - (a.sesionesCompletadas || 0))
          .slice(0, 3);

        const languageCounts = new Map<string, number>();
        data.forEach(user => {
          user.intereses?.forEach(tecnologia => {
            if (!tecnologia?.nombre) return;
            const current = languageCounts.get(tecnologia.nombre) ?? 0;
            languageCounts.set(tecnologia.nombre, current + 1);
          });
        });

        const defaultLanguages = ['Java', 'Angular', 'HTML'];
        defaultLanguages.forEach(lang => {
          if (!languageCounts.has(lang)) {
            languageCounts.set(lang, 0);
          }
        });

        this.topLanguages = Array.from(languageCounts.entries())
          .map(([nombre, count]) => ({ nombre, count }))
          .sort((a, b) => b.count - a.count || a.nombre.localeCompare(b.nombre))
          .slice(0, 5);
      },
      error: (err) => console.error(err)
    });
  }
}
