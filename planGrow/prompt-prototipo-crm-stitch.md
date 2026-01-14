# Prompt para Prototipo de Interfaz CRM - Stitch by Google

## Contexto del Proyecto

Diseña una interfaz prototipo para un **Panel Administrativo CRM (Customer Relationship Management)** para la marca **+COLOR**, una empresa especializada en pinturas y revestimientos de alta calidad. El CRM gestiona leads (clientes potenciales) que provienen de formularios de contacto y mensajes de WhatsApp, con integración de automatización y respuestas con voz mediante IA.

**Stack Tecnológico:**
- Next.js 15 con App Router
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- Paleta de colores: Cardinal Pink (#870064) como color primario
- Diseño moderno, limpio y profesional

## Paleta de Colores y Estilo Visual

**Colores Principales:**
- **Primario/Acento**: Cardinal Pink #870064 (púrpura/magenta oscuro)
- **Fondo**: Blanco (#FFFFFF) en modo claro, gris oscuro (#212121) en modo oscuro
- **Texto**: Gris oscuro (#212121) / Blanco (#FFFFFF)
- **Bordes**: Gris claro (#E0E0E0)
- **Éxito**: Verde
- **Advertencia**: Amarillo
- **Error**: Rojo
- **Información**: Azul

**Estilo de Diseño:**
- Diseño limpio y moderno
- Bordes redondeados (border-radius: 0.5rem)
- Sombras sutiles para profundidad
- Espaciado generoso (padding/margin)
- Tipografía: Poppins (principal) e Inter (secundaria)
- Iconos: Material Icons o Lucide React

## Estructura Principal del Panel Admin

El panel administrativo debe tener las siguientes secciones principales:

### 1. Layout Base (Estructura General)

**Sidebar de Navegación (Izquierda):**
- Logo de +COLOR en la parte superior
- Menú de navegación vertical con iconos:
  - 📊 Dashboard (página principal)
  - 👥 Leads (gestión de clientes potenciales)
  - 👤 Usuarios (gestión de agentes/usuarios)
  - ⚙️ Configuración (ajustes e integraciones)
  - 📤 Salir (logout)
- Indicador visual de la sección activa
- Colapsable para pantallas pequeñas

**Header Superior:**
- Barra horizontal superior
- Título de la sección actual
- Búsqueda global (opcional)
- Notificaciones (badge con contador)
- Avatar del usuario con menú desplegable (nombre, email, perfil, logout)

**Área de Contenido Principal:**
- Fondo blanco/gris claro
- Padding generoso
- Máximo ancho para contenido (1280px)
- Scrollable

### 2. Dashboard (Página Principal)

**Métricas Principales (Cards en Grid):**
- 4 tarjetas grandes en la parte superior:
  1. **Total de Leads** (número grande, icono de usuarios)
  2. **Leads Nuevos (Hoy)** (número, tendencia, porcentaje)
  3. **Tasa de Conversión** (porcentaje, gráfico pequeño)
  4. **Tiempo Promedio de Respuesta** (tiempo, icono de reloj)

**Gráficos y Analytics (2 columnas):**
- **Gráfico de Leads por Fuente** (pie chart o bar chart):
  - Formulario de contacto
  - WhatsApp
  - Website
- **Gráfico de Leads por Estado** (bar chart):
  - Nuevo
  - Contactado
  - Calificado
  - Propuesta
  - Ganado
  - Perdido
- **Gráfico de Tendencias** (line chart):
  - Evolución de leads en el tiempo (últimos 30 días)

**Leads Recientes (Tabla Compacta):**
- Lista de últimos 10 leads
- Columnas: Nombre, Email/Teléfono, Estado, Fecha, Acciones
- Enlace "Ver todos" que lleva a la página de Leads

### 3. Página de Leads (Lista de Leads)

**Barra de Filtros y Búsqueda (Parte Superior):**
- Campo de búsqueda (nombre, email, teléfono)
- Filtros desplegables:
  - Estado (Nuevo, Contactado, Calificado, Propuesta, Ganado, Perdido)
  - Fuente (Formulario, WhatsApp, Website)
  - Asignado a (agente específico o "Sin asignar")
  - Rango de fechas
- Botón "Nuevo Lead" (flotante o en la barra)
- Vista de tabla/lista (toggle)

**Tabla de Leads:**
- Columnas:
  - Checkbox (selección múltiple)
  - Nombre
  - Email
  - Teléfono
  - Fuente (badge con color)
  - Estado (badge con color)
  - Asignado a (avatar + nombre)
  - Última actividad (fecha relativa)
  - Acciones (menú de 3 puntos: Ver, Editar, Eliminar)
- Filas ordenables y clickeables (llevan al detalle)
- Paginación en la parte inferior
- Acciones en masa (barra que aparece cuando hay selección):
  - Cambiar estado
  - Asignar a agente
  - Exportar
  - Eliminar

**Estados con Badges de Color:**
- Nuevo: Azul
- Contactado: Amarillo
- Calificado: Púrpura (color primario)
- Propuesta: Naranja
- Ganado: Verde
- Perdido: Rojo/Gris

### 4. Detalle de Lead (Vista Individual)

**Layout de 2 Columnas:**

**Columna Izquierda (Principal - 2/3 del ancho):**
- **Header del Lead:**
  - Nombre (título grande)
  - Badge de estado (editable)
  - Botón "Editar"
- **Pestañas (Tabs):**
  1. **Conversaciones** (activa por defecto)
  2. **Información**
  3. **Historial**
  4. **Notas**

- **Pestaña Conversaciones:**
  - Thread de conversaciones (estilo chat/mensajería)
  - Mensajes de WhatsApp (con iconos y timestamps)
  - Notas internas (diferentes estilos)
  - Formulario para enviar mensaje (parte inferior):
    - Campo de texto (textarea)
    - Opciones: Enviar por WhatsApp, Agregar nota interna
    - Botón de envío
    - Opción para generar respuesta con voz (ElevenLabs)

- **Pestaña Información:**
  - Formulario editable con campos:
    - Nombre
    - Email
    - Teléfono
    - Fuente (read-only)
    - Estado (dropdown)
    - Asignado a (dropdown con lista de agentes)
    - Fecha de creación
    - Última actualización
  - Botón "Guardar Cambios"

- **Pestaña Historial:**
  - Timeline vertical de eventos:
    - Creación del lead
    - Cambios de estado
    - Asignaciones
    - Mensajes enviados/recibidos
    - Notas agregadas
  - Cada evento con fecha, hora y usuario

- **Pestaña Notas:**
  - Lista de notas internas
  - Formulario para agregar nueva nota
  - Cada nota con autor, fecha y contenido

**Columna Derecha (Sidebar - 1/3 del ancho):**
- **Resumen Rápido (Card):**
  - Estado actual
  - Fuente
  - Asignado a (con avatar)
  - Tiempo desde creación
  - Última actividad
- **Acciones Rápidas (Card):**
  - Botón "Enviar Mensaje WhatsApp"
  - Botón "Llamar" (si hay teléfono)
  - Botón "Enviar Email" (si hay email)
  - Botón "Cambiar Estado"
  - Botón "Reasignar"
- **Automatizaciones (Card):**
  - Lista de reglas activas para este lead
  - Toggle para pausar/reanudar automatización
- **Metadatos (Card):**
  - Información adicional (JSON o campos personalizados)

### 5. Página de Usuarios (Gestión de Usuarios/Agentes)

**Header:**
- Título "Gestión de Usuarios"
- Botón "Agregar Usuario"

**Lista de Usuarios:**
- Cards o tabla con usuarios:
  - Avatar
  - Nombre
  - Email
  - Rol (Admin, Agente, Manager) - badge
  - Estado (Activo/Inactivo) - toggle
  - Leads asignados (número)
  - Acciones (Editar, Eliminar)
- Formulario modal para agregar/editar usuario:
  - Nombre
  - Email
  - Rol (dropdown)
  - Contraseña (solo en creación)
  - Estado activo/inactivo

### 6. Página de Configuración

**Pestañas de Configuración:**
1. **Integraciones**
   - Sección UChat (WhatsApp API):
     - Campo API Key
     - Campo Webhook Secret
     - Campo Phone Number ID
     - Estado de conexión (conectado/desconectado)
     - Botón "Probar Conexión"
   - Sección ElevenLabs (Voz IA):
     - Campo API Key
     - Campo Voice ID (dropdown con voces disponibles)
     - Estado de conexión
     - Botón "Probar Conexión"
   - Botón "Guardar Cambios" para cada sección

2. **Automatizaciones**
   - Lista de reglas de automatización
   - Card para cada regla:
     - Nombre
     - Tipo de trigger (Nuevo lead, Cambio de estado, Tiempo)
     - Condiciones
     - Acciones
     - Estado (Activo/Inactivo) - toggle
     - Acciones (Editar, Eliminar, Duplicar)
   - Botón "Nueva Regla"
   - Modal para crear/editar regla:
     - Formulario con campos para configuración de la regla

3. **General**
   - Configuraciones generales del sistema
   - Preferencias de usuario
   - Notificaciones

## Componentes UI Específicos

### Cards (Tarjetas)
- Fondo blanco
- Sombra sutil
- Bordes redondeados
- Padding interno generoso
- Header con título opcional
- Footer con acciones opcionales

### Tablas
- Filas alternadas (hover effect)
- Headers con iconos de ordenamiento
- Paginación en la parte inferior
- Acciones en cada fila (menú de 3 puntos)

### Formularios
- Labels claros
- Campos de entrada con bordes
- Estados de validación (error, éxito)
- Mensajes de ayuda/error
- Botones de acción (primario, secundario)

### Badges/Etiquetas
- Diferentes colores según estado
- Tamaño pequeño
- Bordes redondeados
- Texto en blanco para contraste

### Modales/Dialogs
- Overlay oscuro semitransparente
- Contenido centrado
- Fondo blanco
- Header con título y botón de cerrar
- Footer con acciones (Cancelar, Guardar)
- Animación de entrada/salida

### Dropdowns/Selects
- Estilo moderno
- Búsqueda interna (opcional)
- Iconos para opciones
- Grupos de opciones

### Inputs de Búsqueda
- Icono de búsqueda
- Placeholder descriptivo
- Borde cuando está activo
- Botón de limpiar (X)

## Flujos de Usuario Principales

### Flujo 1: Ver y Gestionar Leads
1. Usuario entra al Dashboard
2. Ve métricas generales
3. Hace clic en "Leads" en el sidebar
4. Ve lista de leads con filtros
5. Hace clic en un lead
6. Ve detalle del lead con conversaciones
7. Envía mensaje o cambia estado

### Flujo 2: Agregar y Asignar Lead
1. Usuario hace clic en "Nuevo Lead"
2. Se abre modal con formulario
3. Completa información (nombre, email, teléfono, fuente)
4. Guarda el lead
5. Lead aparece en la lista con estado "Nuevo"
6. Usuario asigna el lead a un agente
7. Lead cambia de estado a "Contactado"

### Flujo 3: Configurar Integraciones
1. Usuario va a Configuración > Integraciones
2. Ve sección de UChat
3. Ingresa API Key y credenciales
4. Hace clic en "Probar Conexión"
5. Ve estado de conexión (conectado/desconectado)
6. Guarda cambios

## Consideraciones de Diseño

- **Responsive**: El diseño debe funcionar en desktop (1280px+), tablet (768px-1279px) y móvil (320px-767px)
- **Accesibilidad**: Contraste adecuado, navegación por teclado, labels descriptivos
- **Performance**: Carga rápida, lazy loading para listas largas
- **Feedback Visual**: Loading states, estados de éxito/error, confirmaciones para acciones destructivas
- **Consistencia**: Mismo estilo visual en todas las pantallas, componentes reutilizables

## Detalles Técnicos Adicionales

- **Estados de Carga**: Skeletons o spinners mientras cargan datos
- **Mensajes Vacíos**: Ilustraciones o mensajes cuando no hay datos
- **Confirmaciones**: Modales de confirmación para acciones destructivas (eliminar, cambiar estado crítico)
- **Notificaciones**: Toast notifications para acciones exitosas o errores
- **Breadcrumbs**: Navegación de breadcrumbs en páginas profundas
- **Shortcuts de Teclado**: Atajos para acciones comunes (Ctrl+K para búsqueda, etc.)

## Ejemplo de Vista Esperada

El diseño debe transmitir:
- **Profesionalismo**: Interfaz seria y confiable
- **Modernidad**: Diseño actual y limpio
- **Eficiencia**: Fácil de usar, acciones rápidas
- **Claridad**: Información organizada y fácil de encontrar
- **Coherencia**: Estilo visual alineado con la marca +COLOR

---

**Nota para Stitch by Google**: Este prompt describe un sistema CRM completo para gestión de leads con integración de WhatsApp y voz IA. El diseño debe ser profesional, moderno y eficiente, usando la paleta de colores Cardinal Pink (#870064) como elemento principal. Las pantallas deben ser funcionales, claras y fáciles de usar para agentes y administradores que gestionan clientes potenciales.
