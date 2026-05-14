import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-banned',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon],
  templateUrl: './banned.component.html',
  styleUrls: ['./banned.component.scss']
})
export class BannedComponent implements OnInit, OnDestroy {
  motivo: string = '';
  fechaFin: Date | null = null;
  countdown: string = '';
  intervalId: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Recogemos el motivo y la fecha que nos mandó el login
    this.route.queryParams.subscribe(params => {
      if (params['hasta']) {
        this.motivo = params['motivo'] || 'Incumplimiento de las normas de la comunidad.';
        this.fechaFin = new Date(params['hasta']);
        this.iniciarReloj();
      } else {
        // Si alguien intenta entrar aquí sin estar baneado, lo echamos al login
        this.router.navigate(['/login']);
      }
    });
  }

  iniciarReloj() {
    this.calcularTiempo(); // Calculamos el primer segundo
    this.intervalId = setInterval(() => this.calcularTiempo(), 1000); // Y luego cada segundo
  }

  calcularTiempo() {
    if (!this.fechaFin) return;
    
    const ahora = new Date().getTime();
    const distancia = this.fechaFin.getTime() - ahora;

    // Si el tiempo ya ha pasado
    if (distancia < 0) {
      this.countdown = '¡Tu condena ha terminado! Ya puedes volver a iniciar sesión.';
      clearInterval(this.intervalId);
      return;
    }

    // Matemáticas para sacar días, horas, minutos y segundos
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // Lo formateamos bonito
    this.countdown = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
  }

  ngOnDestroy() {
    // Limpiamos el reloj si sale de la pantalla para que no consuma memoria
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}