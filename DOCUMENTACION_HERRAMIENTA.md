# Documento funcional y manual de uso
## Sistema de Seguimiento de Capacitaciones (Seguimiento-1.0)

## 1) Descripción general de la herramienta

El **Sistema de Seguimiento de Capacitaciones** es una aplicación web para administrar y monitorear cursos de formación por VP/Gerencia, controlar avance por hitos, y planificar cursos en un calendario anual PAC.

La solución integra:
- **Frontend React + Vite** para operación diaria.
- **Backend REST (Node.js + Express + SQLite)** para persistencia centralizada y autenticación.
- **Fallback local** a `cursos.json` cuando la API no está disponible.
- **Persistencia de progreso y calendario** en `localStorage` para continuidad operativa.

### Objetivos operativos
- Controlar el estado de ejecución de cursos (Pendiente, Planificado, En Proceso, Programado, En Ejecución, Realizado, Cierre, Suspendido, Postergado, Cancelado).
- Aplicar filtros cruzados (VP, Gerencia, Estado, Curso y Mes inicio).
- Gestionar hitos por curso con trazabilidad (historial y reversa de estados).
- Programar cursos y sincronizarlos automáticamente con el calendario PAC.
- Permitir autenticación y operaciones CRUD vía API cuando existe conectividad backend.

---

## 2) Resumen de cada hoja (vista/pestaña)

La aplicación tiene 3 hojas principales:

### Hoja 1: **Dashboard**
**Propósito:** vista ejecutiva para navegar cursos, indicadores de estado y filtros de búsqueda.

**Incluye:**
- Indicadores por estado.
- Filtros avanzados.
- Listado de cursos con datos de contexto.
- Conteo de resultados y fecha de última actualización.

### Hoja 2: **Gestión de Hitos**
**Propósito:** operación táctica del avance de cada curso por hitos y estados.

**Incluye:**
- Visualización de hitos por estado.
- Marcar/desmarcar hitos.
- Avance automático de estado al completar hitos.
- Acciones especiales (Suspender, Postergar, Cancelar).
- Reversa de estado e historial.
- Programación formal del curso (fecha/hora/participantes/relator).

### Hoja 3: **Calendario PAC**
**Propósito:** planificación y control temporal de cursos programados durante 2026.

**Incluye:**
- Navegación mensual.
- Alta, edición y eliminación de cursos del calendario.
- Importar/exportar JSON.
- Limpieza total de cursos de calendario.
- Integración automática desde Gestión de Hitos cuando se programa un curso.

---

## 3) Manual de uso por hoja (con parámetros)

## 3.1 Hoja Dashboard

### Flujo recomendado
1. Ingresar a la hoja **Dashboard**.
2. Revisar tarjetas de indicadores por estado.
3. Aplicar filtros.
4. Revisar cursos listados.
5. Ajustar filtros o limpiar para nuevos análisis.

### Parámetros y controles

#### A) Filtros
1. **`vp`**
   - Tipo: selección simple.
   - Valores: `Todos` + VPs detectadas en la data.
   - Efecto: filtra cursos por vicepresidencia.
   - Regla especial: al cambiar VP, se reinicia `gerencia = "Todas"`.

2. **`gerencia`**
   - Tipo: selección simple (cascada).
   - Valores: `Todas` + gerencias según VP seleccionada.
   - Efecto: filtra cursos por gerencia.

3. **`estado`**
   - Tipo: selección simple.
   - Valores: `Todos` + estados detectados.
   - Efecto: filtra por estado actual del curso.

4. **`cursos`**
   - Tipo: multiselección.
   - Valores: nombres de cursos disponibles (deduplicados).
   - Efecto: muestra solo cursos seleccionados.

5. **`mesesInicio`**
   - Tipo: multiselección.
   - Valores: meses detectados en datos (`"1"` a `"12"`, según dataset).
   - Efecto: filtra por mes de inicio.

#### B) Acciones
- **Limpiar filtros:** reinicia filtros a estado base:
  - `vp = "Todos"`
  - `gerencia = "Todas"`
  - `estado = "Todos"`
  - `cursos = []`
  - `mesesInicio = []`

### Resultado esperado
- Listado y métricas quedan acotadas a la segmentación aplicada.

---

## 3.2 Hoja Gestión de Hitos

### Flujo recomendado
1. Aplicar filtros (compartidos con Dashboard).
2. Expandir curso.
3. Marcar hitos del estado actual.
4. Usar acciones especiales cuando corresponda.
5. Confirmar programación cuando el curso lo requiera.
6. Revisar historial y fecha de última actualización.

### Parámetros y controles

#### A) Hitos por curso
- **`hitoIndex`** (0..3): índice del hito del estado.
- **`hitos`**: arreglo booleano de 4 posiciones.
- **Regla de negocio:** al completar 4 hitos, el curso avanza al siguiente estado del flujo.

#### B) Flujo de estados
Orden de avance automático:
`Pendiente → Planificado → En Proceso → Programado → En Ejecución → Realizado → Cierre`

Estados manuales especiales:
- `Suspendido`
- `Postergado`
- `Cancelado`

#### C) Programación de curso (modal)
Se activa cuando corresponde pasar a estado programado.

Parámetros:
1. **`fecha`**
   - Tipo: date.
   - Requerido: sí.
2. **`hora`**
   - Tipo: time (`HH:mm`).
   - Requerido: sí.
3. **`participantes`**
   - Tipo: entero.
   - Restricción: `>= 1`.
4. **`relator`**
   - Tipo: texto.
   - Requerido: sí.

Resultado:
- Estado pasa a `Programado`.
- Se guarda registro en historial.
- Se sincroniza con calendario PAC en `localStorage` (clave `pac2026_courses`).

#### D) Historial y reversa
- Cada cambio puede guardar:
  - `estado` previo,
  - `fecha` del cambio,
  - `motivo`.
- **Deshacer cambio:** revierte al estado anterior disponible.

### Resultado esperado
- Trazabilidad completa del curso por hitos y estados.

---

## 3.3 Hoja Calendario PAC

### Flujo recomendado
1. Ir a **Calendario PAC**.
2. Cambiar mes con navegación o flechas del teclado.
3. Crear curso desde día específico o desde botón de nuevo curso.
4. Editar curso existente desde celda.
5. Exportar respaldo JSON o importar carga masiva.

### Parámetros y controles

#### A) Navegación
- **`mesActual`**: entero de `0` a `11`.
- Atajos:
  - `ArrowLeft`: mes anterior.
  - `ArrowRight`: mes siguiente.

#### B) Alta/edición de curso (modal)
Parámetros:
1. **`nombre`**
   - Tipo: string.
   - Requerido.
   - Mínimo: 3 caracteres.
   - Máximo: 200.
2. **`proveedor`**
   - Tipo: string.
   - Requerido.
   - Mínimo: 2 caracteres.
   - Máximo: 100.
3. **`fecha`**
   - Tipo: date.
   - Requerido.
   - Formato válido: `2026-MM-DD`.
   - Rango: `2026-01-01` a `2026-12-31`.
4. **`hora`**
   - Tipo: time.
   - Requerido.
   - Formato: `HH:mm`.
5. **`participantes`**
   - Tipo: entero.
   - Rango: 1–999.
6. **`duracion`**
   - Tipo: entero (horas).
   - Rango: 1–200.
7. **`vp`**
   - Tipo: selección.
   - Requerido.
   - Valores: catálogo `VP_OPTIONS`.
8. **`gerencia`**
   - Tipo: string.
   - Requerido.
   - Mínimo: 2 caracteres.
   - Máximo: 150.

#### C) Gestión de data del calendario
1. **Exportar JSON**
   - Genera archivo con estructura:
     - `version`
     - `year`
     - `exportedAt`
     - `courses[]`

2. **Importar JSON**
   - Formatos aceptados:
     - Array de cursos.
     - Objeto con `courses[]`.
   - Modo de importación:
     - `replace` (reemplaza todo)
     - `append` (agrega al existente)
   - Campos mínimos por curso importado:
     - `nombre`, `fecha`, `vp`.

3. **Clear All**
   - Vacía todos los cursos del calendario.

### Resultado esperado
- Plan anual editable, portable (JSON) y sincronizable con operación de hitos.

---

## 4) Parámetros de API (resumen operativo)

## 4.1 Autenticación

1. **POST `/api/auth/login`**
   - Body:
     - `email` (requerido)
     - `password` (requerido)
   - Respuesta principal: `token`, `user`.

2. **POST `/api/auth/register`**
   - Body:
     - `email` (requerido)
     - `password` (requerido)
     - `nombre` (requerido)
     - `rol` (opcional, default `usuario`)

3. **GET `/api/auth/me`**
   - Header: `Authorization: Bearer <token>`.

## 4.2 Cursos

1. **GET `/api/cursos`**
   - Query params opcionales:
     - `vp`
     - `gerencia`
     - `estado`
     - `año`

2. **GET `/api/cursos/:id`**
   - Param: `id`.

3. **GET `/api/cursos/estadisticas`**
   - Sin parámetros.

4. **POST `/api/cursos`**
   - Requiere token.
   - Body mínimo: `id`, `nombre`.
   - Body extendido: admite campos de planificación/ejecución anuales (incluyendo participantes por mes).

5. **PUT `/api/cursos/:id`**
   - Requiere token.
   - Param: `id`.
   - Body: campos editables permitidos por backend.

6. **DELETE `/api/cursos/:id`**
   - Requiere token + rol admin.

---

## 5) Mejoras implementadas (estado actual)

1. **Evolución de arquitectura**
- Separación frontend/backend.
- API REST con seguridad base (JWT, CORS, Helmet, Rate Limit).

2. **Continuidad operativa**
- Fallback automático a JSON local cuando la API no responde.

3. **Mejora de calidad de datos**
- Normalización y validación de cursos.
- Detección y depuración de duplicados por ID.

4. **Productividad de usuario**
- Filtros en cascada y multiselección.
- Indicadores por estado en tiempo real.

5. **Gobierno del proceso formativo**
- Gestión de hitos con avance automático.
- Estados especiales y reversa con historial.

6. **Planificación PAC reforzada**
- Calendario con CRUD, import/export JSON, navegación por teclado.
- Integración automática de cursos programados desde Gestión de Hitos.

7. **Experiencia de usuario**
- Vista responsive.
- Modales con validaciones.
- Mensajería de carga y error.

---

## 6) Propuesta de mejoras para nueva versión (roadmap sugerido)

## 6.1 Alta prioridad (impacto directo)
1. **Control de permisos por rol granular**
   - Roles sugeridos: Administrador, Analista, Consulta.
   - Matriz de permisos por acción (crear/editar/eliminar/aprobar).

2. **Bitácora de auditoría completa**
   - Registrar quién, qué, cuándo y por qué para cada cambio.

3. **Notificaciones automáticas**
   - Correo/Teams cuando un curso cambia de estado o queda próximo a fecha.

4. **Paginación + búsqueda global**
   - Mejorar rendimiento en datasets grandes.

5. **Panel ejecutivo con KPIs avanzados**
   - Cumplimiento mensual, tasa de finalización, desviación plan vs ejecución.

## 6.2 Prioridad media (escalabilidad)
6. **Motor de reportes exportables**
   - Excel/PDF con plantillas por VP, Gerencia, Estado y Periodo.

7. **Migración productiva a PostgreSQL**
   - Índices, backup automatizado y alta concurrencia.

8. **API versionada (`/api/v1`) y documentación OpenAPI**
   - Facilita integración y mantenimiento.

9. **Pruebas automáticas (unitarias/integración/E2E)**
   - Cobertura mínima recomendada: 70% en lógica crítica.

10. **Workflow CI/CD**
   - Build, test, seguridad y despliegue automático.

## 6.3 Potencial estratégico (innovación)
11. **Predicción de riesgo de atraso/cancelación**
   - Modelo simple con historial para priorizar seguimiento.

12. **Recomendador de proveedores y franjas horarias**
   - Basado en desempeño histórico (asistencia, satisfacción, cumplimiento).

13. **Módulo de presupuesto en tiempo real**
   - Seguimiento comprometido vs ejecutado por VP/Gerencia.

14. **Portal de participantes**
   - Confirmación de asistencia, recordatorios, encuestas y certificados.

15. **Integración con calendario corporativo (Outlook/Google)**
   - Sincronización bidireccional de eventos de capacitación.

---

## 7) Correo de presentación de la página (plantilla)

**Asunto:** Presentación plataforma de Seguimiento de Capacitaciones – Acceso y guía rápida

Estimados/as,

Junto con saludar, comparto la página del **Sistema de Seguimiento de Capacitaciones**, herramienta diseñada para controlar el avance de cursos por VP/Gerencia, gestionar hitos operativos y planificar el calendario PAC 2026.

🔗 **Acceso a la plataforma:**
`https://guillermoolivares.github.io/Seguimiento-1.0/`

### ¿Qué podrán hacer en la plataforma?
- Revisar indicadores y estado general de cursos (Dashboard).
- Aplicar filtros por VP, Gerencia, Estado, Curso y Mes de inicio.
- Gestionar hitos por curso con trazabilidad de cambios.
- Programar cursos y reflejarlos automáticamente en Calendario PAC.
- Administrar calendario con creación/edición/exportación/importación de cursos.

### Recomendación de uso inicial
1. Ingresar al Dashboard y validar filtros.
2. Ir a Gestión de Hitos para actualizar estados.
3. Confirmar en Calendario PAC la programación mensual.

Quedo atento para una demo de 30 minutos y resolver dudas funcionales o técnicas.

Saludos cordiales,

**[Tu Nombre]**  
**[Cargo / Área]**  
**[Teléfono]**  
**[Correo]**

---

## 8) Notas de adopción
- Si el backend no está disponible, la aplicación continuará en modo local (JSON), permitiendo consulta y operación básica.
- Para ambientes productivos se recomienda habilitar backend, control de acceso por rol y respaldo de base de datos.
