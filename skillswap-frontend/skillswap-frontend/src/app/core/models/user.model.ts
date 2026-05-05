export interface Tecnologia {
  id: number;
  nombre: string;
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

// ─── LO QUE EL BACKEND DEVUELVE EN /auth/signin ───────────────────
// { token, type, id, username, email, roles[] }
export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

// ─── LO QUE EL FRONTEND ENVÍA AL HACER LOGIN ──────────────────────
// El backend espera "username", NO "email"
export interface AuthRequest {
  username: string;
  password: string;
}

// ─── LO QUE EL FRONTEND ENVÍA AL REGISTRARSE ──────────────────────
// El backend espera tecnologiasDominaIds / tecnologiasAprendeIds
export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  tecnologiasDominaIds: number[];
  tecnologiasAprendeIds: number[];
}

export interface Match {
  usuario: UserProfile;
  puntuacionMatch: number;
  habilidadesQueOfrece: Tecnologia[];
  habilidadesQueNecesita: Tecnologia[];
}