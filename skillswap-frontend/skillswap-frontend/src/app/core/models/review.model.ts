export interface Review {
  id: number;
  autorId: number;
  autorNombre?: string;
  autorAvatar?: string;
  receptorId: number;
  sesionId?: number;
  puntuacion: number;      
  comentario: string;
  tecnologia?: {
    id: number;
    nombre: string;
  };
  creadoEn: string;
}

export interface CreateReviewRequest {
  receptorId: number;
  sesionId?: number;
  puntuacion: number;
  comentario: string;
  tecnologiaId?: number;
}