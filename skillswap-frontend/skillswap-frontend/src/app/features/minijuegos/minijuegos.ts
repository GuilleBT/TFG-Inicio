import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from  '../../core/services/auth.service';

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

  // Inyectamos el AuthService y el Router para controlar el acceso
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

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
            // ¡MAGIA DE TRADUCCIÓN! En lugar de mostrarlo directo, lo mandamos traducir
            this.traducirQuizCompleto(response.data[0]);
          } else {
            console.warn("El objeto JSON no tiene la propiedad 'data'.");
            this.loading = false;
          }
        } catch (e) {
          console.error("Error al transformar el JSON:", e);
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading quiz:', err);
        this.loading = false;
      }
    });
  }

  // 4. Función que traduce el objeto entero pieza por pieza
  async traducirQuizCompleto(quizOriginal: QuizQuestion) {
    try {
      // Traducimos los campos principales
      quizOriginal.category = await this.traducirTexto(quizOriginal.category);
      quizOriginal.difficulty = await this.traducirTexto(quizOriginal.difficulty);
      quizOriginal.text = await this.traducirTexto(quizOriginal.text);
      quizOriginal.explanation = await this.traducirTexto(quizOriginal.explanation);

      // Traducimos cada una de las respuestas iterando sobre el array
      for (let answer of quizOriginal.answers) {
        answer.text = await this.traducirTexto(answer.text);
      }

      // Cuando todo está traducido, lo pasamos a la variable principal y quitamos el loading
      this.quiz = quizOriginal;
      this.loading = false; 

    } catch (error) {
      console.error("Error al traducir el quiz:", error);
      // Si falla la traducción (ej: se cae la API de MyMemory), lo mostramos en inglés para que no se rompa la app
      this.quiz = quizOriginal;
      this.loading = false;
    }
  }

  // 5. Función que llama a la API gratuita de traducción (MyMemory)
  async traducirTexto(texto: string): Promise<string> {
    if (!texto) return '';
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|es`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Si la API devuelve la traducción, la usamos. Si no, devolvemos el texto original.
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
    return texto;
  }

  // LA TRAMPA: Controlamos si está logueado al intentar responder
  verificarRespuesta(isCorrect: boolean): void {
    // 1. Si NO está autenticado, le mandamos al login inmediatamente
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Si SÍ está autenticado, comprobamos la respuesta con normalidad
    if (this.respondido || !this.quiz) return;
    this.esCorrecto = isCorrect;
    this.respondido = true;
  }
}