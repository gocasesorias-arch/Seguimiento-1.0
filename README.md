# Sistema de Seguimiento de Capacitaciones

Sistema web para gestión y seguimiento integral de capacitaciones organizadas por VP y Gerencia.

## 🚀 Cambios Implementados - Fase 1

### ✅ Completados

1. **Externalización de datos**
   - Datos movidos de HTML a `cursos.json` (518KB)
   - Archivo HTML reducido de 608KB a < 1KB
   - Carga asíncrona de datos vía fetch

2. **Build moderno con Vite**
   - Eliminado Babel Standalone
   - JSX precompilado
   - Build optimizado: 187KB total
   - Hot Module Replacement (HMR) en desarrollo

3. **Código modularizado**
   ```
   src/
   ├── components/
   │   ├── Dashboard.jsx
   │   ├── GestionHitos.jsx
   │   ├── Icons.jsx
   │   └── PanelFiltros.jsx
   ├── hooks/
   │   ├── useCursos.js
   │   ├── useFiltros.js
   │   └── useHitos.js
   ├── utils/
   │   ├── constants.js
   │   └── helpers.js
   ├── App.jsx
   ├── main.jsx
   └── index.css
   ```

4. **Custom Hooks**
   - `useCursos`: Gestión de carga de datos
   - `useFiltros`: Lógica de filtrado
   - `useHitos`: Gestión de progreso con localStorage

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

## 🛠️ Stack Tecnológico

- **React 18.3.1**
- **Vite 5.4.11**
- **TailwindCSS 3.4.17**
- **PostCSS + Autoprefixer**

## 📊 Métricas

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Tamaño HTML | 608 KB | 0.4 KB | 99.9% ↓ |
| Build total | N/A | 187 KB | - |
| Datos JSON | Inline | 518 KB archivo | Separado |
| Líneas de código | 1,184 (1 archivo) | ~1,200 (17 archivos) | Modular |
| Tiempo de carga | Lento (transpilación) | Rápido (precompilado) | ~10x ↑ |

## 🎯 Funcionalidades

- ✅ Dashboard de estados con navegación por hitos
- ✅ Gestión individual de cursos y sus hitos
- ✅ Sistema de filtros avanzados (VP, Gerencia, Mes, etc.)
- ✅ Persistencia de progreso en localStorage
- ✅ Cambio automático de estados al completar hitos
- ✅ Acciones especiales: Suspender y Postergar cursos

## 📝 Próximos Pasos (Fase 2)

1. Normalizar modelo de datos (eliminar Column1, Column2, etc.)
2. Separar curso lógico de curso-gerencia
3. Implementar backend REST API
4. Añadir validaciones y manejo de errores
5. Tests unitarios

## 📄 Archivos Importantes

- `cursos.json`: Dataset de capacitaciones
- `index.html.backup`: Archivo original (respaldo)
- `src/App.jsx`: Componente principal
- `vite.config.js`: Configuración de Vite

## 🔧 Desarrollo

El servidor de desarrollo incluye:
- Hot Module Replacement
- Puerto: 3000
- Source maps para debugging

---

**Versión:** 1.0.0
**Última actualización:** Diciembre 2024
