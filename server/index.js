import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { initDatabase } from './config/database.js'

// Importar rutas
import authRoutes from './routes/auth.js'
import cursosRoutes from './routes/cursos.js'

// Configurar variables de entorno
dotenv.config()

// Inicializar base de datos
await initDatabase()

// Crear aplicación Express
const app = express()
const PORT = process.env.PORT || 5000

// Configurar CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Seguridad con Helmet
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intenta de nuevo más tarde'
  }
})

app.use('/api/', limiter)

// Middleware para parsear JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger simple de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/cursos', cursosRoutes)

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  })
})

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 ========================================')
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
  console.log(`🚀 Entorno: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🚀 API disponible en: http://localhost:${PORT}/api`)
  console.log('🚀 ========================================')
  console.log('📌 Endpoints disponibles:')
  console.log('   GET    /api/health')
  console.log('   POST   /api/auth/register')
  console.log('   POST   /api/auth/login')
  console.log('   GET    /api/auth/me')
  console.log('   GET    /api/cursos')
  console.log('   GET    /api/cursos/estadisticas')
  console.log('   GET    /api/cursos/:id')
  console.log('   POST   /api/cursos')
  console.log('   PUT    /api/cursos/:id')
  console.log('   DELETE /api/cursos/:id')
  console.log('🚀 ========================================')
})

export default app
