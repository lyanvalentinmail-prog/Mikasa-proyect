# 🤖 Mikasa - Plataforma SaaS para Sub-bots de WhatsApp

Mikasa es una plataforma web completa, modular y escalable para crear, configurar y administrar sub-bots de WhatsApp desde un panel de control web profesional.

---

## 🏗️ Arquitectura del Monorepo

```
/
├── apps/
│   ├── web/                     # Frontend Next.js 14, React 18, Tailwind CSS, Lucide
│   │   ├── src/app/             # Rutas App Router (Landing, Dashboard, Bot Builder, Editor)
│   │   ├── src/components/      # UI components, Simulador interactivo, Preview de WhatsApp
│   │   ├── src/context/         # AuthContext y SocketContext (Tiempo Real)
│   │   └── src/lib/             # Cliente API tipado y utilidades
│   │
│   ├── api/                     # Backend REST API + Socket.IO Server (Node.js, Express, TypeScript)
│   │   ├── src/controllers/     # Auth, Bots, Conexión, Comandos, Menú, Plugins, Logs, Stats
│   │   ├── src/middleware/      # Auth JWT, Bot Owner authorization guard, Zod Validator
│   │   ├── src/services/        # SocketService (Streaming en tiempo real de QR, logs, pairing)
│   │   └── src/routes/          # Enrutadores REST
│   │
│   └── bot/                     # Motor y Gestor Multi-instancia de WhatsApp
│       ├── src/connection/      # Abstracción IConnection y Baileys WhatsApp Multi-Device
│       ├── src/manager/         # BotManager y BotInstance (Gestión independiente por bot)
│       ├── src/commands/        # CommandDispatcher (Mapeo dinámico de prefijos, permisos)
│       ├── src/events/          # Event handlers (mensajes entrantes, reconexión)
│       └── src/plugins/         # Arquitectura modular de plugins (AI, Anime, Stickers, Moderación, Juegos)
│
├── packages/
│   ├── database/                # Base de datos SQLite / PostgreSQL, repositorios y seeders
│   ├── types/                   # Tipos compartidos e interfaces de TypeScript
│   ├── commands/                # Parser de mensajes y ejecutor con resolución de variables
│   ├── config/                  # Constantes, plantillas estéticas por defecto y Zod env
│   └── shared/                  # Formateador de tipografía estética, generador de menú, logger
│
├── .env.example                 # Variables de entorno de ejemplo
├── package.json                 # Configuración de workspaces npm
└── README.md
```

---

## 🚀 Características Principales

1. **Constructor de Bots (Bot Builder)**:
   - Registro de bots con Nombre, Tipo, Prefijo personalizado (`.`, `#`, `!`, etc.), Developer, Website, Avatar y Banner.
   - Aislamiento completo de sesiones y credenciales multi-inquilino.

2. **Conexión de WhatsApp**:
   - **Código QR**: Generación dinámica y streaming en vivo vía WebSocket.
   - **Pairing Code**: Solicitud de código de 8 caracteres (ej: `A7K9-2PQM`) introduciendo el número internacional (`+598...`).
   - Estados reales y precisos: 🟢 `Conectado`, 🟡 `Conectando`, 🟠 `Esperando QR`, 🟠 `Esperando Pairing Code`, 🔴 `Desconectado`, ⚠️ `Error`.

3. **Menú Automático con Estética Personalizada**:
   - El comando `.menu` se construye dinámicamente a partir de las categorías y comandos activos.
   - Soporta tipografía estilizada Small Caps, caracteres unicode bold serif y bordes visuales exactos.
   - Vista previa en tiempo real dentro de un mockup de smartphone de WhatsApp sin recargar la página.

4. **Sistema de Variables Seguras**:
   - `{{bot.name}}`, `{{bot.type}}`, `{{bot.prefix}}`, `{{bot.developer}}`, `{{bot.website}}`, `{{user.name}}`, `{{user.number}}`, `{{args}}`, `{{mention}}`, `{{date}}`, `{{time}}`, `{{command.count}}`, `{{category.count}}`.

5. **Simulador de WhatsApp en el Navegador**:
   - Prueba cualquier comando en vivo desde el panel web sin gastar mensajes de tu teléfono.

6. **Plugins Modulares**:
   - 🤖 **IA**: ChatGPT, Gemini, Imagine AI.
   - ✨ **Anime**: Reacciones estilizadas (`.peek`, `.kiss`, `.hug`, `.pat`, `.slap`, `.waifu`).
   - 🖼️ **Stickers**: Conversión y personalización de metadatos.
   - 🛡️ **Moderación**: Expulsión, avisos y mención general (`.tagall`, `.kick`, `.hidetag`).
   - 🎮 **Juegos**: Dados, Cara o Cruz, Piedra Papel o Tijera.
   - 📥 **Descargas**: Descargas multimedia.
   - 🛠️ **Herramientas**: Ping, Uptime, Calculadora, Clima, Códigos QR.

7. **Logs & Estadísticas en Tiempo Real**:
   - Streaming en vivo filtrado por `INFO`, `WARN`, `ERROR`, `COMMAND`.
   - Métricas de mensajes, comandos, usuarios únicos, uptime y horas pico.

---

## 🛠️ Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js >= 18
- npm >= 9

### Pasos de Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/lyanvalentinmail-prog/Mikasa-proyect.git
cd Mikasa-proyect
```

2. Instalar dependencias del monorepo:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Compilar todos los paquetes y aplicaciones:
```bash
npm run build
```

5. Iniciar en modo desarrollo (API + Web Frontend):
```bash
npm run dev
```

La plataforma estará disponible en:
- **Web Dashboard**: `http://localhost:3000`
- **Backend API & WebSockets**: `http://localhost:4000`

---

## 👤 Cuenta Demo de Prueba

Para probar inmediatamente todas las funcionalidades:
- **Email**: `demo@mikasa.com`
- **Contraseña**: `password123`

---

## 🛡️ Scripts Disponibles

- `npm run dev`: Inicia la API y el Web Frontend concurrentemente.
- `npm run build`: Compila todos los workspaces de TypeScript y Next.js.
- `npm run start`: Inicia los servicios en modo producción.
- `npm run lint`: Ejecuta el linter.
- `npm run typecheck`: Comprobación de tipos en todos los paquetes.
- `npm run db:seed`: Puebla la base de datos con datos y plugins iniciales.
