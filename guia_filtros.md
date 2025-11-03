# Guía de Filtros del Sistema de Seguimiento

## 🔍 Sistema de Filtros Avanzado

El sistema ahora cuenta con **5 filtros** que te permiten segmentar y analizar tus cursos de capacitación de manera precisa.

---

## 📋 Filtros Disponibles

### 1. **Vicepresidencia (VP)**
- **Columna de datos:** VP (Column9)
- **Opciones:** 11 vicepresidencias diferentes
- **Ejemplos:**
  - VP Ejecutiva Operaciones
  - VP Procesos
  - VP Mina
  - VP Proyecto
  - VP Recursos Humanos
  - Y más...

**¿Cuándo usar?** Para ver el avance de capacitaciones por cada área de la organización.

---

### 2. **Gerencia**
- **Columna de datos:** Gerencia (Column10)
- **Opciones:** 45 gerencias únicas
- **Ejemplos:**
  - GERENCIA CARGUIO Y TRANSPORTE
  - GERENCIA OPERACIONES PLANTAS
  - GERENCIA SEGURIDAD Y SALUD OCUPACIONAL
  - GCIA. GESTION ACTIVOS Y CONFIABILIDAD
  - Y más...

**¿Cuándo usar?** Para enfocarte en una gerencia específica dentro de una VP.

---

### 3. **Tipo de Plan**
- **Columna de datos:** Tipo de Plan (Column11)
- **Opciones:** 3 tipos
  - ✅ **Certificaciones** - Cursos de certificación obligatoria
  - 🏢 **Corporativo** - Capacitaciones corporativas
  - 🔧 **Técnico** - Capacitaciones técnicas especializadas

**¿Cuándo usar?** Para analizar el avance por tipo de capacitación.

---

### 4. **Año**
- **Columna de datos:** Año (Column2)
- **Opciones:** 3 años
  - 2024
  - 2025
  - 2026

**¿Cuándo usar?** Para ver capacitaciones de un año específico o comparar entre años.

---

### 5. **PDC Responsable OTIC**
- **Columna de datos:** PDC Responsable OTIC (Column7)
- **Opciones:** 6 responsables únicos
- **Ejemplos:**
  - Guillermo Olivares
  - Rossana Perez
  - Walter Aedo
  - Jaime Diaz
  - Sorayvi Gonzalez
  - Y más...

**¿Cuándo usar?** Para ver las capacitaciones bajo la responsabilidad de cada coordinador OTIC.

---

## 🎯 Cómo Usar los Filtros

### Ubicación
Los filtros están disponibles en **ambas vistas**:
- 📊 **Vista Dashboard** - En la parte superior, después del header
- ✅ **Vista Gestión de Hitos** - En la parte superior, antes de la lista de cursos

### Pasos para Filtrar

1. **Abrir panel de filtros**
   - Por defecto, los filtros están visibles
   - Puedes ocultarlos con el botón "Ocultar" si necesitas más espacio

2. **Seleccionar valores**
   - Cada filtro tiene un menú desplegable (dropdown)
   - La opción "Todos/Todas" muestra todos los registros (sin filtrar)
   - Selecciona el valor específico que deseas filtrar

3. **Ver resultados inmediatos**
   - Los filtros se aplican automáticamente
   - Verás el contador actualizado en tiempo real
   - Ejemplo: "142 cursos" después de aplicar filtros

4. **Combinar múltiples filtros**
   - Puedes usar varios filtros a la vez
   - Los filtros se aplican con lógica AND (todos deben cumplirse)
   - Ejemplo: VP="VP Procesos" + Tipo="Certificaciones" + Año="2025"

5. **Limpiar filtros**
   - Usa el botón rojo "🗑️ Limpiar Filtros"
   - Todos los filtros volverán a "Todos/Todas"
   - Verás todos los cursos nuevamente

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Ver certificaciones de una VP específica
```
1. Filtro VP: "VP Ejecutiva Operaciones"
2. Filtro Tipo de Plan: "Certificaciones"
3. Resultado: Solo certificaciones de esa VP
```

### Ejemplo 2: Revisar trabajo de un responsable
```
1. Filtro PDC Responsable OTIC: "Guillermo Olivares"
2. Filtro Año: "2025"
3. Resultado: Todas las capacitaciones a cargo de Guillermo en 2025
```

### Ejemplo 3: Análisis por gerencia y tipo
```
1. Filtro Gerencia: "GERENCIA OPERACIONES PLANTAS"
2. Filtro Tipo de Plan: "Técnico"
3. Filtro Año: "2025"
4. Resultado: Cursos técnicos de esa gerencia en 2025
```

### Ejemplo 4: Seguimiento de área completa
```
1. Filtro VP: "VP Procesos"
2. Dejar otros filtros en "Todos"
3. Resultado: Todos los cursos de VP Procesos
```

---

## 📊 Interpretación de Resultados Filtrados

### En el Dashboard

Cuando aplicas filtros en el Dashboard:

1. **Barra de progreso de estados**
   - Los números en cada estado se actualizan
   - Solo muestra cursos que cumplen los filtros

2. **Estados especiales**
   - Suspendidos y Postergados también se filtran
   - Puedes ver rápidamente problemas en tu área

3. **Lista de cursos**
   - Solo muestra cursos del estado actual Y que cumplen filtros
   - Útil para revisión detallada

4. **Estadísticas generales**
   - Todas las métricas se recalculan con filtros
   - El porcentaje de completitud es específico del filtro

### En Gestión de Hitos

Cuando aplicas filtros en Gestión:

1. **Lista de cursos**
   - Solo aparecen cursos que cumplen todos los filtros
   - Facilita la gestión de áreas específicas

2. **Contador de resultados**
   - Muestra cuántos cursos cumplen los filtros
   - Ejemplo: "42 cursos"

3. **Mensaje sin resultados**
   - Si no hay cursos que cumplan los filtros
   - Botón para limpiar filtros rápidamente

---

## 🎨 Indicadores Visuales

### Panel de Filtros

- **📊 Icono de filtro** en el título
- **Botón Ocultar/Mostrar** para ahorrar espacio
- **Contador de filtros activos** muestra cuántos filtros no están en "Todos"
- **Contador de resultados** en azul grande y destacado

### Ejemplo de contador:
```
Filtros activos: 3
          ↓
    142 cursos
```

Esto significa que tienes 3 filtros configurados (no en "Todos/Todas") y hay 142 cursos que cumplen esos criterios.

---

## 🔄 Flujo de Trabajo Recomendado con Filtros

### Para Coordinadores de VP

**Lunes - Revisión Semanal:**
```
1. Filtrar por tu VP
2. Ver Dashboard para estado general
3. Identificar cursos en "En Ejecución" que necesitan seguimiento
```

**Diario - Gestión Operativa:**
```
1. Filtrar por VP + Responsable OTIC (si delegas)
2. Ir a Gestión de Hitos
3. Actualizar hitos de cursos activos
```

### Para Responsables OTIC

**Inicio de día:**
```
1. Filtrar por tu nombre en "PDC Responsable OTIC"
2. Revisar cursos en "Programado" y "En Ejecución"
3. Marcar hitos completados
```

**Fin de semana:**
```
1. Mismo filtro de tu nombre
2. Revisar cursos "Realizados"
3. Completar documentación en Clikma
```

### Para Análisis por Gerencia

**Mensual:**
```
1. Filtrar por Gerencia específica
2. Filtrar por Año actual
3. Ver estadísticas de completitud
4. Comparar con metas del mes
```

### Para Reportes Ejecutivos

**Trimestral:**
```
1. Filtrar por VP (una por una)
2. Filtrar por Tipo de Plan
3. Exportar o capturar estadísticas
4. Comparar entre VPs
```

---

## 💾 Persistencia de Filtros

### ⚠️ Importante

Los filtros **NO se guardan** entre sesiones. Cuando cierres el navegador:
- Todos los filtros volverán a "Todos/Todas"
- Deberás configurarlos nuevamente

### ✅ Lo que SÍ se guarda

- El progreso de hitos marcados
- El estado actual de cada curso
- Los cambios de estado automáticos

---

## 🚀 Tips y Mejores Prácticas

### ✅ DO (Hacer)

1. **Usa filtros combinados** para análisis específicos
2. **Limpia filtros** antes de cambiar de análisis
3. **Revisa el contador** de resultados para validar
4. **Oculta el panel** si necesitas más espacio de visualización
5. **Usa filtro de año** para separar planes multianuales

### ❌ DON'T (No hacer)

1. **No confíes en que los filtros persisten** - configúralos cada sesión
2. **No uses demasiados filtros** si quieres vista general
3. **No olvides limpiar** después de análisis específicos
4. **No uses filtros** para tareas que requieren ver todo el plan

---

## 🔧 Solución de Problemas

### "No veo ningún curso"

**Posibles causas:**
1. Filtros muy restrictivos
2. No hay cursos que cumplan todos los criterios

**Solución:**
- Haz clic en "🗑️ Limpiar Filtros"
- Ve quitando filtros uno por uno para encontrar el conflicto

### "Los números no cuadran"

**Posibles causas:**
1. Filtros aplicados que no notaste
2. Confusión entre vista Dashboard y Gestión

**Solución:**
- Verifica el panel de filtros
- Revisa "Filtros activos: X"
- Limpia filtros para ver el total

### "El filtro no hace nada"

**Posibles causas:**
1. Ya estaba seleccionado ese valor
2. No hay cambios porque todos los cursos ya cumplían

**Solución:**
- Verifica el contador de resultados
- Prueba con otro valor para comparar

---

## 📈 Casos de Uso Avanzados

### Análisis de Carga de Trabajo

**Objetivo:** Ver cuántos cursos maneja cada responsable

```
1. Filtrar por cada "PDC Responsable OTIC" uno por uno
2. Anotar el contador de cursos
3. Comparar cargas de trabajo
4. Redistribuir si es necesario
```

### Evaluación de Tipo de Plan

**Objetivo:** Comparar avance entre tipos de capacitación

```
1. Filtrar "Certificaciones" → Ver % completitud
2. Filtrar "Corporativo" → Ver % completitud
3. Filtrar "Técnico" → Ver % completitud
4. Identificar cuál tipo va más atrasado
```

### Seguimiento Multianual

**Objetivo:** Ver plan completo vs año específico

```
1. Sin filtros → Ver total de cursos
2. Filtrar "2025" → Ver cursos del año
3. Comparar diferencia
4. Planificar recursos según carga anual
```

### Análisis Cruzado VP-Gerencia

**Objetivo:** Profundizar en áreas específicas

```
1. Filtrar VP → Ver carga general
2. Agregar filtro Gerencia → Ver detalle específico
3. Revisar cursos individuales
4. Hacer gestión focalizada
```

---

## 🎯 Resumen de Filtros

| Filtro | Opciones | Uso Principal | Vista |
|--------|----------|---------------|-------|
| **VP** | 11 VPs | Segmentar por área organizacional | Ambas |
| **Gerencia** | 45 Gerencias | Detalle dentro de VP | Ambas |
| **Tipo Plan** | 3 tipos | Analizar por tipo de capacitación | Ambas |
| **Año** | 3 años | Separar planes anuales | Ambas |
| **Responsable** | 6 nombres | Seguimiento por coordinador | Ambas |

---

## ✨ Funcionalidades Clave

1. ✅ **Aplicación inmediata** - Sin botón "Aplicar"
2. ✅ **Combinación libre** - Usa los que necesites
3. ✅ **Contador en tiempo real** - Siempre visible
4. ✅ **Limpieza rápida** - Un solo clic
5. ✅ **Panel colapsable** - Más espacio cuando lo necesitas
6. ✅ **Disponible en ambas vistas** - Dashboard y Gestión

---

**¿Necesitas más ayuda?**

Los filtros están diseñados para hacer tu trabajo más eficiente. Experimenta con diferentes combinaciones para encontrar los análisis más útiles para tu rol.

**Última actualización:** Octubre 2025
**Versión:** 3.0 con Sistema de Filtros Avanzado
