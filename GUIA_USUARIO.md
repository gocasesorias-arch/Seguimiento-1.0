# Guía de Usuario - Sistema de Seguimiento de Capacitaciones

## OTIC CCHC - Proyecto Collahuasi

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Interfaz Principal](#3-interfaz-principal)
4. [Dashboard de Estadísticas](#4-dashboard-de-estadísticas)
5. [Sistema de Filtros](#5-sistema-de-filtros)
6. [Tarjetas de Cursos](#6-tarjetas-de-cursos)
7. [Gestión de Hitos](#7-gestión-de-hitos)
8. [Estados de los Cursos](#8-estados-de-los-cursos)
9. [Preguntas Frecuentes](#9-preguntas-frecuentes)
10. [Solución de Problemas](#10-solución-de-problemas)

---

## 1. Introducción

### ¿Qué es el Sistema de Seguimiento?

El Sistema de Seguimiento de Capacitaciones es una aplicación web diseñada para gestionar y monitorear el progreso de las capacitaciones de la OTIC CCHC en el Proyecto Collahuasi.

### Características Principales

- **Dashboard interactivo** con estadísticas en tiempo real
- **Filtros avanzados** para encontrar cursos específicos
- **Gestión de hitos** para seguimiento del progreso
- **Sistema de estados** automatizado
- **Acceso seguro** con autenticación

### Requisitos del Sistema

| Requisito | Especificación |
|-----------|----------------|
| Navegador | Chrome, Firefox, Safari, Edge (versiones recientes) |
| Conexión | Internet (para modo API) o funcionamiento offline (modo JSON) |
| Resolución | Mínimo 1024x768 (recomendado 1920x1080) |

---

## 2. Acceso al Sistema

### 2.1 Iniciar Sesión

1. Abra el navegador y acceda a la URL del sistema
2. Haga clic en el botón **"Iniciar Sesión"** ubicado en la esquina superior derecha
3. Ingrese sus credenciales:
   - **Email**: Su correo electrónico registrado
   - **Contraseña**: Su contraseña asignada
4. Haga clic en **"Entrar"**

```
Credenciales de prueba:
Email: admin@seguimiento.cl
Contraseña: admin123
```

### 2.2 Cerrar Sesión

1. Localice su nombre de usuario en la parte superior derecha
2. Haga clic en el botón **"Cerrar Sesión"**
3. Confirme la acción

### 2.3 Indicador de Modo

El sistema muestra un indicador que señala el modo de operación actual:

| Indicador | Significado |
|-----------|-------------|
| 🟢 **API** | Conectado al servidor, datos en tiempo real |
| 🟡 **JSON** | Modo offline, usando datos locales |

---

## 3. Interfaz Principal

### 3.1 Estructura de la Pantalla

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Logo + Título + Usuario + Cerrar Sesión           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         DASHBOARD DE ESTADÍSTICAS                     │  │
│  │   [Pendiente] [Planificado] [Programado] [En Ejec.]  │  │
│  │   [Realizado] [Cierre] [Cancelado]                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              BARRA DE NAVEGACIÓN                      │  │
│  │         [Dashboard]     [Gestión de Hitos]           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   FILTROS                             │  │
│  │  [VP] [Gerencia] [Estado] [Cursos] [Mes]             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               ÁREA DE CONTENIDO                       │  │
│  │         (Tarjetas de Cursos o Gestión de Hitos)      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Navegación Principal

El sistema tiene dos vistas principales:

| Vista | Descripción | Uso Principal |
|-------|-------------|---------------|
| **Dashboard** | Vista general de todos los cursos en tarjetas | Consulta y visualización |
| **Gestión de Hitos** | Seguimiento detallado del progreso | Actualizar avances |

Para cambiar entre vistas, use los botones de navegación ubicados debajo del dashboard de estadísticas.

---

## 4. Dashboard de Estadísticas

### 4.1 Descripción

El dashboard muestra un resumen visual del estado de todos los cursos mediante tarjetas con contadores.

### 4.2 Tarjetas de Estado

Cada tarjeta muestra:
- **Nombre del estado** (ej: "Pendiente", "En Ejecución")
- **Cantidad de cursos** en ese estado
- **Color distintivo** para fácil identificación

### 4.3 Colores de Estado

| Estado | Color | Descripción |
|--------|-------|-------------|
| Pendiente | Gris | Cursos sin iniciar |
| Planificado | Azul | Cursos en fase de planificación |
| Programado | Índigo | Cursos con fecha definida |
| En Proceso | Amarillo | Cursos en preparación activa |
| En Ejecución | Verde | Cursos actualmente en curso |
| Realizado | Verde Oscuro | Cursos completados |
| Cierre | Púrpura | Cursos en proceso de cierre |
| Suspendido | Naranja | Cursos temporalmente detenidos |
| Postergado | Rosa | Cursos reprogramados |
| Cancelado | Rojo | Cursos cancelados |

### 4.4 Interacción

- **Hacer clic** en una tarjeta de estado filtra automáticamente los cursos de ese estado
- Los contadores se actualizan en tiempo real al aplicar filtros

---

## 5. Sistema de Filtros

### 5.1 Panel de Filtros

El panel de filtros permite buscar cursos específicos usando múltiples criterios.

### 5.2 Filtros Disponibles

#### Vicepresidencia (VP)
- Desplegable con todas las VPs disponibles
- Seleccione una VP para filtrar cursos de esa área
- Al seleccionar una VP, el filtro de Gerencia se actualiza automáticamente

#### Gerencia
- Desplegable que muestra gerencias según la VP seleccionada
- **Importante**: Primero seleccione una VP para ver las gerencias disponibles
- Sistema de cascada: las opciones dependen de la VP elegida

#### Estado
- Filtra cursos por su estado actual
- Opciones: Pendiente, Planificado, Programado, En Ejecución, etc.

#### Cursos
- Selector múltiple para elegir cursos específicos
- Puede seleccionar varios cursos a la vez
- Búsqueda por nombre del curso

#### Mes de Inicio
- Selector múltiple para filtrar por mes de inicio
- Puede seleccionar varios meses
- Formato: Enero, Febrero, Marzo, etc.

### 5.3 Cómo Usar los Filtros

1. **Aplicar un filtro**: Seleccione una opción del desplegable deseado
2. **Combinar filtros**: Puede aplicar múltiples filtros simultáneamente
3. **Ver resultados**: Los cursos se filtran automáticamente
4. **Limpiar filtros**: Use el botón "Limpiar Filtros" para reiniciar

### 5.4 Ejemplo de Uso

```
Caso: Encontrar cursos de Operaciones que están En Ejecución en Marzo

1. Seleccione VP: "OPERACIONES"
2. Seleccione Gerencia: (la gerencia deseada)
3. Seleccione Estado: "En Ejecución"
4. Seleccione Mes: "Marzo"

Resultado: Se muestran solo los cursos que cumplen todos los criterios
```

---

## 6. Tarjetas de Cursos

### 6.1 Información Mostrada

Cada tarjeta de curso contiene:

```
┌────────────────────────────────────────────┐
│  #1  NOMBRE DEL CURSO                      │
│────────────────────────────────────────────│
│  Objetivo: [Descripción del objetivo]      │
│                                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐  │
│  │  VP  │ │ Ger. │ │Horas │ │Particip. │  │
│  └──────┘ └──────┘ └──────┘ └──────────┘  │
│                                            │
│  ┌──────────┐    ┌────────────────────┐   │
│  │Mes Inicio│    │ ESTADO DEL CURSO   │   │
│  └──────────┘    └────────────────────┘   │
└────────────────────────────────────────────┘
```

### 6.2 Elementos de la Tarjeta

| Elemento | Descripción |
|----------|-------------|
| **Número** | Identificador secuencial del curso |
| **Nombre** | Título oficial del curso |
| **Objetivo** | Propósito y meta del curso |
| **VP** | Vicepresidencia a la que pertenece |
| **Gerencia** | Gerencia específica |
| **Horas** | Duración total en horas |
| **Participantes** | Cantidad de participantes programados |
| **Mes Inicio** | Mes de inicio programado |
| **Estado** | Estado actual del curso (con color) |

### 6.3 Visualización

- Las tarjetas se organizan en una cuadrícula responsive
- Adaptación automática según el tamaño de pantalla:
  - **Escritorio**: 3-4 tarjetas por fila
  - **Tablet**: 2 tarjetas por fila
  - **Móvil**: 1 tarjeta por fila

---

## 7. Gestión de Hitos

### 7.1 Acceso

1. Haga clic en el botón **"Gestión de Hitos"** en la barra de navegación
2. Se mostrará la vista de gestión con gráficos y acordeón de cursos

### 7.2 Gráfico de Avance

En la parte superior se muestra un gráfico de barras que representa:
- **Eje horizontal**: Meses del año
- **Barras**: Progreso de hitos completados por mes
- **Colores**: Indican el nivel de avance

### 7.3 Acordeón de Cursos

Cada curso aparece como un elemento expandible:

```
┌─────────────────────────────────────────────────────────┐
│ ▶ Curso: NOMBRE DEL CURSO                    [Estado]  │
└─────────────────────────────────────────────────────────┘
          │
          ▼ (al hacer clic se expande)
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  HITOS DE PROGRESO:                                     │
│                                                         │
│  ☐ Hito 1: Planificación completada                    │
│  ☐ Hito 2: Recursos asignados                          │
│  ☐ Hito 3: Ejecución iniciada                          │
│  ☐ Hito 4: Evaluación finalizada                       │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ACCIONES ESPECIALES:                                   │
│  [Suspender] [Postergar] [Cancelar]                    │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  HISTORIAL DE CAMBIOS:                                  │
│  • 15/01/2024 - Cambio de Pendiente a Planificado      │
│  • 20/01/2024 - Hito 1 completado                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.4 Sistema de 4 Hitos

Cada curso tiene 4 hitos que representan las etapas de progreso:

| Hito | Nombre | Descripción |
|------|--------|-------------|
| 1 | Planificación | Definición de contenidos y recursos |
| 2 | Preparación | Coordinación de logística y materiales |
| 3 | Ejecución | Desarrollo del curso |
| 4 | Cierre | Evaluación y documentación final |

### 7.5 Marcar Hitos

1. **Expandir** el curso haciendo clic en su nombre
2. **Localizar** el hito que desea marcar
3. **Hacer clic** en el checkbox del hito
4. El hito se marca como completado (✓)

### 7.6 Transición Automática de Estado

**Regla importante**: Cuando se completan los 4 hitos de un curso, el sistema automáticamente avanza el curso al siguiente estado.

```
Flujo de estados:
Pendiente → Planificado → En Proceso → Programado → En Ejecución → Realizado → Cierre
```

### 7.7 Acciones Especiales

Además de los hitos, puede cambiar el estado manualmente:

| Acción | Resultado | Cuándo Usar |
|--------|-----------|-------------|
| **Suspender** | Estado → Suspendido | Detención temporal por causa externa |
| **Postergar** | Estado → Postergado | Reprogramación a fecha futura |
| **Cancelar** | Estado → Cancelado | Cancelación definitiva del curso |

### 7.8 Historial de Cambios

Cada curso mantiene un registro de:
- Fecha y hora del cambio
- Estado anterior y nuevo
- Hitos completados
- Usuario que realizó el cambio (si está autenticado)

---

## 8. Estados de los Cursos

### 8.1 Estados Regulares

| Estado | Descripción | Siguiente Estado |
|--------|-------------|------------------|
| **Pendiente** | Curso registrado, sin iniciar | Planificado |
| **Planificado** | En fase de planificación | En Proceso |
| **En Proceso** | Preparación activa | Programado |
| **Programado** | Fecha y recursos confirmados | En Ejecución |
| **En Ejecución** | Curso en desarrollo | Realizado |
| **Realizado** | Curso completado | Cierre |
| **Cierre** | Documentación final | (Estado final) |

### 8.2 Estados Especiales

| Estado | Descripción | Puede Volver a |
|--------|-------------|----------------|
| **Suspendido** | Detenido temporalmente | Estado anterior |
| **Postergado** | Reprogramado | Planificado |
| **Cancelado** | Cancelado definitivamente | No aplica |

### 8.3 Diagrama de Estados

```
                    ┌───────────┐
                    │ Pendiente │
                    └─────┬─────┘
                          │
                    ┌─────▼─────┐
                    │Planificado│◄──────┐
                    └─────┬─────┘       │
                          │             │
                    ┌─────▼─────┐       │
           ┌───────►│En Proceso │       │
           │        └─────┬─────┘       │
           │              │             │
           │        ┌─────▼─────┐       │
           │        │Programado │       │
           │        └─────┬─────┘       │
           │              │             │
┌──────────┴──┐     ┌─────▼─────┐  ┌────┴─────┐
│ Suspendido  │     │En Ejecución│  │Postergado│
└─────────────┘     └─────┬─────┘  └──────────┘
                          │
                    ┌─────▼─────┐
                    │ Realizado │
                    └─────┬─────┘
                          │
                    ┌─────▼─────┐
                    │   Cierre  │
                    └───────────┘

┌───────────┐
│ Cancelado │ (desde cualquier estado)
└───────────┘
```

---

## 9. Preguntas Frecuentes

### ¿Cómo encuentro un curso específico?

Use los filtros disponibles:
1. Si conoce la VP, filtre por VP primero
2. Use el filtro de búsqueda de cursos para buscar por nombre
3. Combine múltiples filtros para resultados más precisos

### ¿Puedo desmarcar un hito ya completado?

Sí, haga clic nuevamente en el checkbox del hito para desmarcarlo. Tenga en cuenta que esto puede afectar el estado del curso si ya había avanzado automáticamente.

### ¿Qué pasa si cierro el navegador?

- **Con sesión iniciada**: Sus datos se guardan automáticamente
- **Sin sesión**: Los cambios en hitos se guardan localmente en su navegador
- **Recomendación**: Siempre inicie sesión para garantizar la persistencia de datos

### ¿Puedo usar el sistema sin conexión a internet?

Sí, el sistema tiene modo offline (JSON):
- Los datos se cargan desde un archivo local
- Puede consultar información
- Los cambios se guardarán localmente
- Al reconectarse, sincronice con el servidor

### ¿Cómo veo el historial de un curso?

1. Vaya a "Gestión de Hitos"
2. Expanda el curso deseado
3. Desplácese hacia abajo hasta la sección "Historial de Cambios"

### ¿Puedo exportar los datos?

Actualmente el sistema no tiene función de exportación directa. Contacte al administrador para solicitar reportes.

### ¿Qué hago si olvidé mi contraseña?

Contacte al administrador del sistema para restablecer sus credenciales.

---

## 10. Solución de Problemas

### Problema: No puedo iniciar sesión

**Posibles causas y soluciones:**

| Causa | Solución |
|-------|----------|
| Credenciales incorrectas | Verifique email y contraseña |
| Bloqueo por intentos | Espere 15 minutos e intente nuevamente |
| Servidor no disponible | El sistema cambiará a modo JSON |

### Problema: Los filtros no funcionan

**Soluciones:**
1. Haga clic en "Limpiar Filtros" y vuelva a intentar
2. Verifique que los datos estén cargados (espere unos segundos)
3. Recargue la página (F5)

### Problema: Los cambios no se guardan

**Soluciones:**
1. Verifique que esté autenticado
2. Compruebe el indicador de modo (API vs JSON)
3. En modo JSON, los cambios solo se guardan localmente

### Problema: La página carga lentamente

**Soluciones:**
1. Verifique su conexión a internet
2. Limpie la caché del navegador
3. Cierre otras pestañas/aplicaciones

### Problema: No veo todos los cursos

**Posibles causas:**
1. Tiene filtros activos - use "Limpiar Filtros"
2. Está viendo una vista específica (estado)
3. Los datos aún se están cargando

### Problema: El gráfico de hitos no se muestra

**Soluciones:**
1. Asegúrese de estar en la vista "Gestión de Hitos"
2. Verifique que hay cursos con hitos registrados
3. Recargue la página

---

## Contacto y Soporte

### Soporte Técnico

Para problemas técnicos o consultas sobre el sistema:

- **Administrador del Sistema**: Contacte a través de los canales oficiales de OTIC CCHC
- **Reportar errores**: Documente el problema con capturas de pantalla

### Sugerencias de Mejora

Sus sugerencias son bienvenidas para mejorar el sistema:
1. Describa la funcionalidad deseada
2. Explique cómo beneficiaría su trabajo
3. Envíe al equipo de desarrollo

---

## Glosario

| Término | Definición |
|---------|------------|
| **VP** | Vicepresidencia - División organizacional principal |
| **Gerencia** | Subdivisión dentro de una VP |
| **Hito** | Punto de control que marca el progreso de un curso |
| **Estado** | Situación actual del curso en su ciclo de vida |
| **OTIC** | Organismo Técnico Intermedio de Capacitación |
| **API** | Conexión en tiempo real con el servidor |
| **JSON** | Modo offline con datos locales |
| **Dashboard** | Panel de control con estadísticas resumidas |

---

## Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2024 | Versión inicial del sistema |
| 2.0 | 2024 | Mejoras de normalización y filtros |
| 3.0 | 2024 | Backend, API y autenticación |

---

*Documento creado para el Sistema de Seguimiento de Capacitaciones OTIC CCHC - Proyecto Collahuasi*

*Última actualización: Enero 2026*
