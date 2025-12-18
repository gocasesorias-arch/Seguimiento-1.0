import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || './database/seguimiento.db')

// Crear instancia de base de datos
const db = new Database(dbPath, { verbose: console.log })

// Configurar WAL mode para mejor performance
db.pragma('journal_mode = WAL')

/**
 * Inicializa las tablas de la base de datos
 */
export async function initDatabase() {
  console.log('📊 Inicializando base de datos...')

  // Tabla de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nombre TEXT NOT NULL,
      rol TEXT DEFAULT 'usuario',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tabla de cursos
  db.exec(`
    CREATE TABLE IF NOT EXISTS cursos (
      id TEXT PRIMARY KEY,
      año INTEGER,
      id_gerencia TEXT,
      estado TEXT,
      lider_proceso TEXT,
      usuario_responsable TEXT,
      responsable_otic TEXT,
      observaciones TEXT,
      vp TEXT,
      gerencia TEXT,
      tipo_plan TEXT,
      subtipo TEXT,
      nombre TEXT NOT NULL,
      objetivo TEXT,
      horas INTEGER,
      tipo_cargo TEXT,
      dirigido_a TEXT,
      valor_persona INTEGER,
      participacion_real INTEGER,
      otec_sugerido TEXT,
      modalidad TEXT,
      plan_emergente TEXT,
      interno_externo TEXT,
      abierto_cerrado TEXT,
      modulo_planificador TEXT,
      mes_inicio INTEGER,
      detalle_ejecucion TEXT,
      participantes_enero INTEGER DEFAULT 0,
      participantes_febrero INTEGER DEFAULT 0,
      participantes_marzo INTEGER DEFAULT 0,
      participantes_abril INTEGER DEFAULT 0,
      participantes_mayo INTEGER DEFAULT 0,
      participantes_junio INTEGER DEFAULT 0,
      participantes_julio INTEGER DEFAULT 0,
      participantes_agosto INTEGER DEFAULT 0,
      participantes_septiembre INTEGER DEFAULT 0,
      participantes_octubre INTEGER DEFAULT 0,
      participantes_noviembre INTEGER DEFAULT 0,
      participantes_diciembre INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Índices para mejorar búsquedas
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_cursos_vp ON cursos(vp);
    CREATE INDEX IF NOT EXISTS idx_cursos_gerencia ON cursos(gerencia);
    CREATE INDEX IF NOT EXISTS idx_cursos_estado ON cursos(estado);
    CREATE INDEX IF NOT EXISTS idx_cursos_año ON cursos(año);
  `)

  // Crear usuario admin por defecto si no existe
  const userExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@seguimiento.cl')

  if (!userExists) {
    // Password: admin123 (debe cambiarse en producción)
    const bcrypt = (await import('bcryptjs')).default
    const hashedPassword = bcrypt.hashSync('admin123', 10)

    db.prepare(`
      INSERT INTO users (email, password, nombre, rol)
      VALUES (?, ?, ?, ?)
    `).run('admin@seguimiento.cl', hashedPassword, 'Administrador', 'admin')

    console.log('✅ Usuario admin creado: admin@seguimiento.cl / admin123')
  }

  console.log('✅ Base de datos inicializada')
}

export default db
