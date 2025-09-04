# Propagación de Errores App

Una aplicación educativa interactiva para el aprendizaje de métodos de propagación de errores en Análisis Numérico.

## 🚀 Instalación y Uso

\`\`\`bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## 📚 Características

### 🏠 Página Principal
- Introducción al tema de propagación de errores
- Navegación clara hacia todas las secciones
- Diseño responsivo con tema claro/oscuro

### 📖 Teoría
- **Glosario** completo con términos clave
- **Fórmulas generales** de propagación de errores
- **Método Directo** con recetario paso a paso
- **Método Inverso** con hipótesis H1, H2, H3
- **Recetario** de fórmulas comunes
- **Trampas** y errores frecuentes

### 🧮 Práctica
- **Calculadora Método Directo**:
  - Presets: R=V/I, V=πr²h, ρ=m/V, A=½bh
  - Expresiones personalizadas
  - Validador por extremos (2^n o muestreo 128)
  - Gráfico "¿Quién manda?" de sensibilidad
  
- **Calculadora Método Inverso**:
  - Objetivos absolutos o relativos
  - Hipótesis H1/H2/H3 con explicaciones
  - Distribución visual de efectos
  - Texto pedagógico dinámico

### 📝 Ejercicios
- **6 ejercicios autoevaluables** (3 directos, 3 inversos)
- Generación aleatoria de parámetros
- Verificación con tolerancia configurable
- Soluciones paso a paso con LaTeX
- **Exportación CSV** de resultados
- Contador de intentos y feedback detallado

### 🛠️ Tecnologías
- Documentación completa del stack tecnológico
- Ejemplos de código para cada biblioteca
- Explicación de la arquitectura

## 🎯 Ejercicios Incluidos

### Método Directo
1. **Resistencia R=V/I** con V=12.0±0.1, I=2.00±0.02
2. **Área A=½bh** con b=47.3±0.1, h=12.5±0.1  
3. **Densidad ρ=m/V** con m=250.0±0.5, V=100.0±0.1

### Método Inverso
4. **R=V/I** objetivo Δ*(R)≤0.20 con hipótesis H1/H2/H3
5. **V=πr²h** objetivo ε*(V)≤1% con hipótesis H1/H2/H3
6. **Producto u=ab** objetivo Δ*(u)≤0.5 con hipótesis H1/H2/H3

## ⚙️ Configuración

### Agregar Nuevos Presets
Editar `lib/math-engine.ts`:

\`\`\`typescript
export const PRESET_FUNCTIONS = {
  "Nueva Función": {
    formula: "x^2 + y",
    latex: "f(x,y) = x^2 + y",
    variables: ["x", "y"],
    description: "Descripción de la función"
  }
}
\`\`\`

### Agregar Nuevos Ejercicios
Editar `lib/exercises.ts` en el array `BASE_EXERCISES`:

\`\`\`typescript
{
  statement: "Enunciado del ejercicio...",
  answer: 0.123,
  tolerance: 0.005,
  solution: ["Paso 1: ...", "\\Delta^*(f) = ..."],
  type: "direct" | "inverse",
  difficulty: "easy" | "medium" | "hard"
}
\`\`\`

### Cambiar Colores
Editar `app/globals.css`:

\`\`\`css
@theme inline {
  --color-key-lime: #C0F000;        /* Color principal */
  --color-blue-accent: #3B82F6;     /* Color secundario */
  --color-chart-3: #F59E0B;         /* Color terciario */
}
\`\`\`

### Activar Exportación PDF
Instalar dependencias opcionales:

\`\`\`bash
npm install jspdf html2canvas
\`\`\`

Descomentar las importaciones en `components/export-panel.tsx`.

## 🌐 Características de Accesibilidad

- **Soporte completo de teclado** con atajos:
  - `R`: Recalcular en calculadoras
  - `E`: Toggle validador por extremos
  - `1/2/3`: Seleccionar hipótesis H1/H2/H3
- **Soporte decimal localizado** (ES: coma, EN: punto)
- **Modo oscuro/claro** con persistencia
- **Componentes accesibles** con ARIA labels
- **Diseño responsivo** móvil/desktop
- **Tooltips explicativos** para símbolos matemáticos

## 🎨 Diseño

- **Tipografía**: Inter con line-height optimizado
- **Paleta**: Neutros + Key Lime (#C0F000) como acento
- **Componentes**: Rounded corners, sombras suaves
- **Animaciones**: Transiciones sutiles y naturales

## 👥 Equipo Key Lime Pie

- Nicolás Perez
- Agustina Egüen  
- Santiago Talavera
- Tomás Bellizzi

## 📄 Licencia

Proyecto educativo para el curso de Análisis Numérico.
Código fuente disponible bajo licencia educativa.

---

**Nota**: Esta aplicación funciona completamente en el navegador sin necesidad de servidor backend, ideal para uso offline en aulas sin conexión a internet.
