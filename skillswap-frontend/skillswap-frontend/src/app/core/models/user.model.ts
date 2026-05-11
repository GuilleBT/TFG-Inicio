export interface Tecnologia {
  id: number;
  nombre: string;
  categoria?: string;
  icono?: string;
  iconoUrl?: string; // Fusionado
}

export interface UserProfile {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  email?: string;
  experiencia_breve?: string;
  bio?: string;
  ubicacion?: string;
  github?: string;
  linkedin?: string;
  imagen_perfil?: string;
  avatarUrl?: string; 
  valoracionMedia?: number;
  totalResenas?: number;
  sesionesCompletadas?: number;
  habilidades: Tecnologia[];
  intereses: Tecnologia[];
}

export interface Match {
  usuario: UserProfile;
  habilidadesQueOfrece: Tecnologia[];
  habilidadesQueNecesita: Tecnologia[];
  puntuacionMatch: number;
}

// ─── REQUESTS Y RESPONSES PARA REGISTRO Y LOGIN ───

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