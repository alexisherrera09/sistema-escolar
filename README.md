# 🏫 Sistema Escolar Primaria Privada

Sistema completo de gestión escolar para primarias privadas en México. Desarrollado con Vue 3, TypeScript, Pinia y Tailwind CSS.

## 🚀 Características

- ✅ Gestión completa de alumnos con expediente médico
- ✅ Control de asistencia optimizado para móvil
- ✅ Captura de calificaciones y generación de boletas
- ✅ Sistema de pagos y colegiaturas con semáforo de estados
- ✅ Generación de CFDI (facturación electrónica)
- ✅ Portal de padres de familia
- ✅ Control de entrada/salida
- ✅ Comedor escolar
- ✅ Agenda y comunicados
- ✅ Sistema de becas y descuentos
- ✅ Reportes financieros y académicos

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:

   **IMPORTANTE:** Debes crear FÍSICAMENTE los 4 archivos `.env` en la raíz del proyecto.

   El proyecto usa diferentes archivos `.env` para diferentes ambientes:

   - **`.env`** - Ambiente por defecto (usado para desarrollo local)
   - **`.env.local`** - Overrides locales (tiene precedencia sobre `.env`, opcional)
   - **`.env.qa`** - Configuración de ambiente QA
   - **`.env.production`** - Configuración de ambiente producción

   Cada archivo debe contener:
   ```
   VITE_API_BASE=<api_url>
   VITE_APP_VERSION=<version>
   ```

   Ejemplo `.env` para desarrollo local:
   ```
   VITE_API_BASE=http://localhost:5000
   VITE_APP_VERSION=v1.0.0
   ```

   Ejemplo `.env.qa`:
   ```
   VITE_API_BASE=https://api-qa.colegiovx.edu.mx
   VITE_APP_VERSION=v1.0.0
   ```

   Ejemplo `.env.production`:
   ```
   VITE_API_BASE=https://api.colegiovx.edu.mx
   VITE_APP_VERSION=v1.0.0
   ```

3. Iniciar servidor de desarrollo:
```bash
npm run serve
# o
npm run dev
```

   Ambos comandos:
   - Cargarán variables de entorno desde `.env` y `.env.local`
   - Iniciarán el servidor de desarrollo Vite
   - Harán la aplicación disponible en `http://localhost:5173`

   **Nota:** El servidor de desarrollo siempre usa archivos de entorno locales (`.env` y `.env.local`) independientemente del modo.

4. Abrir en el navegador:
```
http://localhost:5173
```

## 📦 Build para Producción

El proceso de build requiere especificar un ambiente. Debes proporcionar el ambiente como argumento.

### Build para Ambiente QA

```bash
npm run build qa
```

Este comando:
- Cargará variables de entorno desde `.env.qa`
- Construirá la aplicación para ambiente QA
- Usará la URL base de API configurada en `.env.qa`
- Generará archivos en el directorio `dist/`

### Build para Ambiente Producción

```bash
npm run build production
```

Este comando:
- Cargará variables de entorno desde `.env.production`
- Construirá la aplicación para ambiente producción
- Usará la URL base de API configurada en `.env.production`
- Generará archivos en el directorio `dist/`

**Ambientes válidos:**
- `qa` - Para builds de ambiente QA
- `production` - Para builds de ambiente producción

**Nota:** Si `npm run build production` no funciona en tu versión de npm, puedes usar el separador `--`:
```bash
npm run build -- production
npm run build -- qa
```

## 👤 Credenciales de Prueba

| Usuario | Contraseña | Rol | Acceso |
|---------|------------|-----|--------|
| `director` | `director123` | Director | Sistema completo |
| `coordinador` | `coord123` | Coordinador | Módulos académicos |
| `cajero` | `cajero123` | Cajero | Pagos, CFDI, inscripciones |
| `maestro3a` | `maestro123` | Maestro | Su grupo, asistencia, calificaciones |
| `maestro1a` | `maestro123` | Maestro | Su grupo, asistencia, calificaciones |
| `padre001` | `padre123` | Padre | Portal de padres |

## 📁 Estructura del Proyecto

```
sistema-escolar/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── views/         # Vistas principales
│   ├── stores/        # Stores de Pinia
│   ├── composables/   # Composables de Vue
│   ├── types/         # Tipos TypeScript
│   ├── utils/         # Utilidades
│   ├── data/          # Datos semilla
│   └── router/        # Configuración de rutas
```

## 🎨 Stack Tecnológico

- **Vue 3.4+** (Composition API)
- **TypeScript** (strict mode)
- **Pinia** (gestión de estado)
- **Vue Router 4** (ruteo)
- **Tailwind CSS 3.4+** (estilos)
- **Lucide Vue Next** (iconos)
- **Chart.js** (gráficas)
- **date-fns** (manejo de fechas)
- **vue-toastification** (notificaciones)

## 📝 Notas

- Los datos se almacenan en LocalStorage
- El sistema está preparado para migrar a una API REST
- Los CFDI se generan como PDF simulado (listo para integrar con PAC)
- El sistema funciona completamente sin backend

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Previsualiza build de producción

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

Copyright (c) 2026 Ing. Alexis Salvador Herrera Garcia, DTM

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia
de este software y archivos de documentación asociados, para usar, copiar, modificar,
fusionar, publicar, distribuir, sublicenciar y/o vender copias del software, y para
permitir a las personas a quienes se les proporcione el software hacer lo mismo,
sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas
las copias o partes sustanciales del software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO.
