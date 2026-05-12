export interface Tecnologia {
  id: number;
  nombre: string;
  iconoUrl?: string;
  categoria?: string;
  icono?: string;
}

export interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  ubicacion?: string;
  github?: string;
  linkedin?: string;
  habilidades: Tecnologia[];
  intereses: Tecnologia[];
  valoracionMedia?: number;
  totalResenas?: number;
  sesionesCompletadas?: number;
  fechaRegistro?: string;
  activo?: boolean;
}

export interface TecnologiaDetalleRequest {
  tecnologiaId: number;
  nivel: string;
  aniosExperiencia: number;
  puntosFuertes: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  experienciaBreve?: string;
  imagenPerfil?: string;
  tecnologiasDomina: TecnologiaDetalleRequest[];
  tecnologiasAprendeIds: number[];
}

export interface Match {
  usuario: UserProfile;
  puntuacionMatch: number;
  matchPerfecto: boolean;
  habilidadesQueOfrece: Tecnologia[];
  habilidadesQueNecesita: Tecnologia[];
  todasLasHabilidades: Tecnologia[];
  todosLosIntereses: Tecnologia[];
}
