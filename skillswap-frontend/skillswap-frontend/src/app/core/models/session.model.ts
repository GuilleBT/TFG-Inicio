export type SessionStatus = 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';

export interface Session {
  id: number;
  solicitanteId: number;
  solicitanteNombre?: string;
  solicitanteAvatar?: string;
  receptorId: number;
  receptorNombre?: string;
  receptorAvatar?: string;
  tecnologia: {
    id: number;
    nombre: string;
  };
  titulo: string;
  descripcion?: string;
  fechaHora: string;          
  duracionMinutos: number;
  enlaceMeeting?: string;
  enlaceGithub?: string;
  estado: SessionStatus;
  notas?: string;
  creadoEn?: string;
}

export interface CreateSessionRequest {
  receptorId: number;
  tecnologiaId: number;
  titulo: string;
  descripcion?: string;
  fechaHora: string;
  duracionMinutos: number;
  enlaceMeeting?: string;
  enlaceGithub?: string;
}

export interface UpdateSessionRequest {
  titulo?: string;
  descripcion?: string;
  fechaHora?: string;
  duracionMinutos?: number;
  enlaceMeeting?: string;
  enlaceGithub?: string;
  estado?: SessionStatus;
  notas?: string;
}