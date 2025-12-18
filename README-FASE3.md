# Fase 3: Backend REST API - Sistema de Seguimiento de Capacitaciones

## 🚀 Novedades de Fase 3

La Fase 3 introduce un backend completo con API REST, autenticación JWT, y base de datos SQLite.

### ✨ Nuevas Características

**Backend Completo:**
- **API REST** con Node.js + Express
- **Base de Datos SQLite** con 487 cursos importados
- **Autenticación JWT** con login/logout
- **CRUD Completo** para gestión de cursos
- **Endpoints de Estadísticas** para dashboards
- **Seguridad** con Helmet, CORS, Rate Limiting

**Frontend Mejorado:**
- **Integración con API** (fallback a JSON local)
- **Sistema de Autenticación** con context React
- **Login Modal** con formulario de autenticación
- **Indicador de Modo** (API vs JSON Local)
- **Gestión de Sesión** con localStorage

## 📁 Estructura del Proyecto

```
Seguimiento-1.0/
├── server/                    # Backend API
│   ├── config/
│   │   ├── database.js       # Configuración SQLite
│   │   └── auth.js           # Configuración JWT
│   ├── controllers/
│   │   ├── authController.js # Lógica de autenticación
│   │   └── cursosController.js # Lógica de cursos
│   ├── middleware/
│   │   └── auth.js           # Middleware JWT
│   ├── routes/
│   │   ├── auth.js           # Rutas de autenticación
│   │   └── cursos.js         # Rutas de cursos
│   ├── scripts/
│   │   └── seedData.js       # Import de datos
│   ├── database/
│   │   └── seguimiento.db    # Base de datos (300KB)
│   ├── index.js              # Servidor Express
│   ├── package.json
│   └── README.md             # Documentación del backend
│
├── src/                       # Frontend React
│   ├── components/
│   │   ├── FiltrosCursos.jsx
│   │   ├── TarjetaCurso.jsx
│   │   └── LoginForm.jsx     # ✨ NUEVO
│   ├── context/
│   │   └── AuthContext.jsx   # ✨ NUEVO
│   ├── services/
│   │   └── apiService.js     # ✨ NUEVO
│   ├── config/
│   │   └── api.js            # ✨ NUEVO
│   ├── utils/
│   │   └── cursoHelpers.js
│   ├── App.jsx               # ✨ ACTUALIZADO con auth
│   └── main.jsx              # ✨ ACTUALIZADO con AuthProvider
│
├── cursos.json               # Datos originales (518KB)
├── .env.development          # ✨ NUEVO
├── .env.example              # ✨ NUEVO
└── README-FASE3.md           # Este archivo
```

## 🛠️ Instalación y Ejecución

### 1. Backend (Puerto 5000)

```bash
cd server
npm install
npm run seed     # Importar datos a la base de datos
npm run dev      # Desarrollo con auto-reload
```

El servidor estará disponible en `http://localhost:5000`

### 2. Frontend (Puerto 3000)

```bash
npm install
npm run dev      # Desarrollo
```

La aplicación estará disponible en `http://localhost:3000`

## 🔑 Credenciales de Acceso

### Usuario Admin
- **Email**: `admin@seguimiento.cl`
- **Password**: `admin123`
- **Rol**: `admin` (puede eliminar cursos)

### Usuario Regular
Puedes registrar nuevos usuarios desde la API o crear un endpoint de registro.

## 📡 Endpoints de la API

### Autenticación

#### `POST /api/auth/login`
Login de usuario

**Request:**
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

#### `POST /api/auth/register`
Registrar nuevo usuario

#### `GET /api/auth/me`
Obtener usuario actual (requiere token)

### Cursos

#### `GET /api/cursos`
Obtener todos los cursos

**Query Params:**
- `vp`: Filtrar por VP
- `gerencia`: Filtrar por Gerencia
- `estado`: Filtrar por Estado
- `año`: Filtrar por Año

**Ejemplo:**
```bash
curl http://localhost:5000/api/cursos?estado=Realizado
```

#### `GET /api/cursos/:id`
Obtener un curso por ID

#### `GET /api/cursos/estadisticas`
Obtener estadísticas generales

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 487,
    "porEstado": [...],
    "porVP": [...],
    "porGerencia": [...],
    "totalHoras": 15000,
    "totalParticipantes": 5000
  }
}
```

#### `POST /api/cursos`
Crear nuevo curso (requiere autenticación)

#### `PUT /api/cursos/:id`
Actualizar curso (requiere autenticación)

#### `DELETE /api/cursos/:id`
Eliminar curso (requiere autenticación y rol admin)

### Health Check

#### `GET /api/health`
Verificar estado de la API

## 🔄 Flujo de Trabajo

### Modo API (Backend conectado)

1. Usuario abre la aplicación
2. Frontend intenta cargar datos desde API
3. Si API está disponible:
   - Datos se cargan desde la base de datos
   - Badge muestra "🟢 API Backend"
   - Usuario puede iniciar sesión para editar cursos
4. Si API no está disponible:
   - Fallback automático a JSON local
   - Badge muestra "📁 JSON Local"
   - Modo solo lectura

### Autenticación

1. Usuario hace clic en "Iniciar Sesión"
2. Modal de login se muestra
3. Usuario ingresa credenciales
4. Token JWT se guarda en localStorage
5. Header muestra nombre del usuario
6. Botón cambia a "Cerrar Sesión"

## 🎯 Características Implementadas

### ✅ Fase 1 (Completada)
- [x] Externalización de datos a JSON
- [x] Vite + React modernos
- [x] Código modularizado
- [x] TailwindCSS

### ✅ Fase 2 (Completada)
- [x] Normalización del modelo de datos
- [x] Filtros en cascada (VP → Gerencia)
- [x] Validación de datos
- [x] Componentes modulares
- [x] Manejo de errores

### ✅ Fase 3 (Completada) - **NUEVO**
- [x] Backend Node.js + Express
- [x] Base de datos SQLite
- [x] API REST completa
- [x] Autenticación JWT
- [x] Middleware de autorización
- [x] Frontend integrado con API
- [x] Sistema de login/logout
- [x] Fallback a JSON local
- [x] Seguridad (Helmet, CORS, Rate Limiting)
- [x] Documentación de API

## 🔒 Seguridad

- **JWT Tokens**: Expiración configurable (7 días por defecto)
- **Bcrypt**: Hash seguro de contraseñas (10 rounds)
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de origen cruzado
- **Rate Limiting**: 100 requests por 15 minutos
- **SQL Injection**: Prevención con prepared statements
- **Validación**: Inputs validados en backend

## 🧪 Testing

### Pruebas Manuales

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

# Crear curso (con autenticación)
curl -X POST http://localhost:5000/api/cursos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"id":"TEST-001","nombre":"Curso de Prueba","vp":"VP Test",...}'
```

## 📊 Estadísticas

- **487 cursos** importados a la base de datos
- **Base de datos**: 300KB (SQLite)
- **Frontend build**: 171KB (gzipped: ~51KB)
- **Backend dependencies**: 151 packages
- **API endpoints**: 10+ endpoints

## 🚀 Próximas Fases

### Fase 4: Mejoras Avanzadas
- [ ] Tests unitarios (Jest/Vitest)
- [ ] Tests de integración
- [ ] Normalización de base de datos (separar curso-gerencia)
- [ ] Paginación de resultados
- [ ] Exportación de datos (Excel, PDF)
- [ ] Gráficos y dashboards avanzados

### Fase 5: Producción
- [ ] Docker containers
- [ ] CI/CD con GitHub Actions
- [ ] Deploy a producción (Heroku, Railway, etc.)
- [ ] Base de datos PostgreSQL
- [ ] Monitoreo y logging
- [ ] Backups automáticos

## 💡 Notas Técnicas

- **SQLite vs PostgreSQL**: SQLite es usado para desarrollo. En producción se recomienda PostgreSQL.
- **JWT Storage**: Tokens se guardan en localStorage. Para mayor seguridad, considerar cookies HttpOnly.
- **CORS**: Configurado para `localhost:3000`. Actualizar en producción.
- **Rate Limiting**: 100 requests/15min. Ajustar según necesidades.

## 🐛 Troubleshooting

### Error: "API no disponible"
- Verifica que el backend esté corriendo en `http://localhost:5000`
- Revisa la consola del servidor para errores
- Verifica que el seed se haya ejecutado correctamente

### Error: "Token inválido"
- El token puede haber expirado (7 días por defecto)
- Cierra sesión e inicia sesión nuevamente
- Verifica que `JWT_SECRET` esté configurado en `.env`

### Error: "Database locked"
- SQLite está siendo accedido por otro proceso
- Cierra otras conexiones a la base de datos
- Reinicia el servidor

## 📝 Licencia

MIT

## 👥 Contribución

Para contribuir al proyecto:
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**Fase 3 completada**: ✅ Backend REST API con autenticación JWT
