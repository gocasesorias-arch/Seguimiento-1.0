# Backend API - Sistema de Seguimiento de Capacitaciones

API REST construida con Node.js + Express + SQLite para gestionar cursos de capacitación.

## 🚀 Características

- **Autenticación JWT**: Sistema completo de registro y login
- **CRUD Completo**: Operaciones Create, Read, Update, Delete para cursos
- **Filtros Avanzados**: Búsqueda por VP, Gerencia, Estado, Año
- **Estadísticas**: Endpoints para métricas y dashboards
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Base de Datos**: SQLite con mejor-sqlite3 (sin dependencias externas)
- **Autorización**: Middleware de roles (admin/usuario)

## 📋 Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🛠️ Instalación

```bash
cd server
npm install
```

## ⚙️ Configuración

1. Copiar archivo de ejemplo:
```bash
cp .env.example .env
```

2. Editar `.env` con tus configuraciones:
```env
PORT=5000
JWT_SECRET=tu_secret_key_aqui
CORS_ORIGIN=http://localhost:3000
```

## 📊 Inicializar Base de Datos

Importar datos desde `cursos.json`:

```bash
npm run seed
```

Esto creará:
- Base de datos SQLite en `database/seguimiento.db`
- Usuario admin por defecto: `admin@seguimiento.cl` / `admin123`
- Importará todos los cursos del JSON

## 🚀 Ejecutar

### Desarrollo (con auto-reload)
```bash
npm run dev
```

### Producción
```bash
npm start
```

Servidor disponible en: `http://localhost:5000`

## 📡 Endpoints

### Autenticación

#### POST `/api/auth/register`
Registrar nuevo usuario

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "rol": "usuario"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan Pérez",
    "rol": "usuario"
  }
}
```

#### POST `/api/auth/login`
Iniciar sesión

**Body:**
```json
{
  "email": "admin@seguimiento.cl",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@seguimiento.cl",
      "nombre": "Administrador",
      "rol": "admin"
    }
  }
}
```

#### GET `/api/auth/me`
Obtener usuario actual (requiere autenticación)

**Headers:**
```
Authorization: Bearer <token>
```

### Cursos

#### GET `/api/cursos`
Obtener todos los cursos (con filtros opcionales)

**Query Params:**
- `vp`: Filtrar por Vicepresidencia
- `gerencia`: Filtrar por Gerencia
- `estado`: Filtrar por Estado
- `año`: Filtrar por Año

**Ejemplo:**
```
GET /api/cursos?vp=VP Recursos Humanos&estado=Realizado
```

**Response:**
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "id": "CURSO-001",
      "nombre": "Capacitación Excel Avanzado",
      "vp": "VP Recursos Humanos",
      "gerencia": "Gerencia de Capacitación",
      "estado": "Realizado",
      "horas": 40,
      ...
    }
  ]
}
```

#### GET `/api/cursos/:id`
Obtener un curso por ID

#### GET `/api/cursos/estadisticas`
Obtener estadísticas generales

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 487,
    "porEstado": [
      { "estado": "Realizado", "count": 200 },
      { "estado": "En Ejecución", "count": 150 }
    ],
    "porVP": [...],
    "porGerencia": [...],
    "totalHoras": 15000,
    "totalParticipantes": 5000
  }
}
```

#### POST `/api/cursos`
Crear nuevo curso (requiere autenticación)

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "id": "CURSO-NEW",
  "nombre": "Nuevo Curso",
  "vp": "VP Recursos Humanos",
  "gerencia": "Gerencia X",
  "estado": "En Proceso",
  "horas": 20,
  ...
}
```

#### PUT `/api/cursos/:id`
Actualizar curso (requiere autenticación)

#### DELETE `/api/cursos/:id`
Eliminar curso (requiere autenticación y rol admin)

### Health Check

#### GET `/api/health`
Verificar estado de la API

## 🔒 Autenticación

Para endpoints protegidos, incluye el token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@seguimiento.cl","password":"admin123"}'

# Obtener cursos
curl http://localhost:5000/api/cursos

# Obtener estadísticas
curl http://localhost:5000/api/cursos/estadisticas
```

## 📁 Estructura del Proyecto

```
server/
├── config/
│   ├── database.js      # Configuración SQLite
│   └── auth.js          # Configuración JWT
├── controllers/
│   ├── authController.js    # Lógica de autenticación
│   └── cursosController.js  # Lógica de cursos
├── middleware/
│   └── auth.js          # Middleware JWT
├── routes/
│   ├── auth.js          # Rutas de autenticación
│   └── cursos.js        # Rutas de cursos
├── scripts/
│   └── seedData.js      # Script para importar datos
├── database/
│   └── seguimiento.db   # Base de datos SQLite
├── index.js             # Servidor Express
├── package.json
├── .env
└── README.md
```

## 🔐 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de origen cruzado
- **Rate Limiting**: Límite de 100 requests por 15 minutos
- **JWT**: Tokens con expiración configurable
- **Bcrypt**: Hash seguro de contraseñas
- **SQL Injection**: Prevención con prepared statements

## 📝 Usuario por Defecto

Después de ejecutar el seed:

- **Email**: `admin@seguimiento.cl`
- **Password**: `admin123`
- **Rol**: `admin`

⚠️ **Importante**: Cambia estas credenciales en producción

## 🐛 Troubleshooting

### Error: "EADDRINUSE"
El puerto 5000 ya está en uso. Cambia el puerto en `.env`:
```env
PORT=5001
```

### Error: "Database locked"
SQLite está siendo accedido por otro proceso. Cierra otras conexiones.

### Error: "JWT secret not defined"
Configura `JWT_SECRET` en `.env`

## 📄 Licencia

MIT
