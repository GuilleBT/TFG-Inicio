# SkillSwap Frontend

## 🚀 Cómo levantar el proyecto

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Arrancar el servidor de desarrollo
npm start
```

La app se abre en: **http://localhost:4200**

## ⚙️ Configuración del backend

El frontend apunta a `http://localhost:8080/api` por defecto.
Si tu backend usa otro puerto, edita:
**`src/environments/environment.ts`** → cambia el valor de `apiUrl`

## 📂 Estructura del proyecto

```
src/app/
├── core/
│   ├── guards/       auth.guard.ts
│   ├── interceptors/ jwt.interceptor.ts
│   ├── models/       user.model.ts, session.model.ts, review.model.ts
│   └── services/     auth, user, tecnologia, matching, session, review
├── shared/
│   └── components/   navbar, user-card, skill-chip, star-rating
└── features/
    ├── home/         Landing page (pública)
    ├── auth/         login/ y register/
    ├── matching/     Lista de matches
    ├── profile/      Perfil de usuario (propio y ajeno)
    ├── sessions/     Gestión de sesiones
    └── reviews/      Reseñas
```

## 📡 Endpoints que espera el frontend

| Acción | Método | URL |
|--------|--------|-----|
| Login | POST | `/api/auth/login` |
| Register | POST | `/api/auth/register` |
| Mi perfil | GET | `/api/users/me` |
| Perfil de usuario | GET | `/api/users/{id}` |
| Actualizar perfil | PUT | `/api/users/me` |
| Tecnologías | GET | `/api/tecnologias` |
| Matches | GET | `/api/matching` |
| Mis sesiones | GET | `/api/sessions` |
| Crear sesión | POST | `/api/sessions` |
| Confirmar sesión | PATCH | `/api/sessions/{id}/confirm` |
| Completar sesión | PATCH | `/api/sessions/{id}/complete` |
| Cancelar sesión | PATCH | `/api/sessions/{id}/cancel` |
| Reseñas de usuario | GET | `/api/reviews/user/{id}` |
| Mis reseñas | GET | `/api/reviews/mine` |
| Crear reseña | POST | `/api/reviews` |
| Eliminar reseña | DELETE | `/api/reviews/{id}` |

## Tecnologías
- Angular 17 (Standalone Components)
- Angular Material
- RxJS
- JWT Authentication
