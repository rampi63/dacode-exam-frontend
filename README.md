## DaCode Exam – Frontend

Este es el frontend de **DaCode Exam**, desarrollado en **Next.js 15 (App Router)** con **Apollo Client**, **React Hook Form** y **TailwindCSS**. Desplegado en **Railway**.

## 🚀 Tecnologías

- Next.js App Router
- Apollo Client + GraphQL
- React Hook Form + Zod
- TailwindCSS
- Context API para autenticación
- Cookies seguras con credenciales

---

## 🔐 Variables de entorno

Crea un archivo `.env.local` con el siguiente contenido:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000/graphql
```

## 📂 Estructura

src/
├── app/              // Rutas (pages)
│   └── tasks/        // Página protegida de tareas
├── lib/              // GraphQL queries/mutations
├── components/       // Formulario, modales, layouts
├── context/          // AuthContext
└── styles/           // Tailwind (si aplica)

## 🔐 Autenticación

Login y logout usando JWT en cookies HttpOnly

Manejo automático de refreshToken en Apollo

Rutas protegidas con redirección si no hay sesión

## 🚀 Despliegue

El frontend está desplegado en Railway o Vercel en:

https://dacode-exam-frontend-production.up.railway.app/

## Desarrollo

npm run dev

## Build y producción

npm run build && npm start

## ✨ Funcionalidad implementada

Login / Registro

Logout limpio con invalidación de token

CRUD completo de tareas

Edición en modal

Paginación de tareas

Refetch automático después de cada cambio

---