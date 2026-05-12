import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Actualizamos las interfaces para que coincidan con el nuevo JSON de la API
interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  text: string;             // La pregunta ahora viene aquí
  category: string;
  difficulty: string;
  explanation: string;      // ¡La API nueva te da la explicación de la respuesta!
  answers: Answer[];        // Lista de respuestas
}

@Component({
  selector: 'app-minijuegos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minijuegos.html',
  styleUrl: './minijuegos.scss',
})
export class Minijuegos implements OnInit {
  quiz: QuizQuestion | null = null; 
  loading = false;
  respondido = false;
  esCorrecto = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadQuiz();
  }

loadQuiz(): void {
    this.loading = true;
    this.respondido = false;
    
    // Le pedimos a Angular que trate la respuesta como texto para evitar errores de parseo automáticos
    this.http.get('http://localhost:8080/api/juegos/pregunta-diaria', { responseType: 'text' }).subscribe({
      next: (rawData) => {
        try {
          // 1. Convertimos el texto puro a un objeto real
          const response = JSON.parse(rawData);
          
          // 2. Imprimimos en consola para asegurarnos de que todo va bien
          console.log("Datos transformados en Angular:", response);

          // 3. Ahora sí, Angular entiende que es un objeto y puede leer 'data'
          if (response && response.data && response.data.length > 0) {
            this.quiz = response.data[0];
          } else {
            console.warn("El objeto JSON no tiene la propiedad 'data'.");
          }
        } catch (e) {
          console.error("Error al transformar el JSON:", e);
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading quiz:', err);
        this.loading = false;
      }
    });
  }

  // Ahora es mucho más fácil, el HTML nos pasará directamente si es correcta o no
  verificarRespuesta(isCorrect: boolean): void {
    if (this.respondido || !this.quiz) return;
    this.esCorrecto = isCorrect;
    this.respondido = true;
  }
}