# 🚀 AI Ticket Workspace — Sysdatec Technical Assessment

Sistema corporativo de gestión y clasificación inteligente de tickets impulsado por **Google Gemini AI**, construido bajo **Arquitectura Hexagonal (Clean Architecture)** con backend en **Node.js / TypeScript**, API en **GraphQL**, base de datos nativa en **PostgreSQL (sin ORMs)** y frontend SPA reactivo en **React + Vite + Tailwind CSS**.

Totalmente preparado para demostración funcional y orquestado con **Docker Compose**:
```bash
docker compose up --build
```

---

## 📑 Tabla de Contenidos
1. [Descripción General y Funcionalidades](#-descripción-general)
2. [Entregables y Documentos de Soporte](#-entregables-y-documentos-de-soporte)
3. [Arquitectura del Sistema (Enfoque Multi-Agente)](#-arquitectura-del-sistema)
4. [Stack Tecnológico](#-stack-tecnológico)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Guía de Instalación y Despliegue](#-guía-de-instalación-y-despliegue)
   - [Opción A: Docker Compose (Recomendada para la evaluación)](#opción-a-con-docker-compose-recomendada-para-la-evaluación)
   - [Opción B: Entorno Local de Desarrollo (Sin Docker)](#opción-b-ejecución-local-sin-docker)
7. [🎬 Guión Paso a Paso para la Presentación Demo (5 Minutos)](#-guión-paso-a-paso-para-la-presentación-demo-5-minutos)
8. [Integración de Inteligencia Artificial (Prompting y Resiliencia)](#-integración-de-ia)
9. [Seguridad y Políticas DevSecOps (OWASP)](#-seguridad-y-devsecops)
10. [Pruebas Automatizadas](#-pruebas-automatizadas)

---

## 🎯 Descripción General

La aplicación resuelve de forma ágil y automatizada la recepción, análisis, clasificación y seguimiento de requerimientos operativos empresariales:

- **1. Creación de Tickets:** Formulario intuitivo con nombre de cliente, texto del requerimiento y URL de adjunto opcional (Google Drive / enlace web). Incluye **plantillas rápidas preconfiguradas** para cargar casos reales de prueba en 1 solo clic.
- **2. Clasificación por IA en Tiempo Real:** Integración con **Google Gemini AI** (`gemini-flash-latest`) que analiza el requerimiento y genera:
  - **Categoría:** *Finance*, *Legal*, *Procurement*, *Operations* u *Other*.
  - **Prioridad:** *High*, *Medium* o *Low*.
  - **Resumen Ejecutivo:** Síntesis concisa en una sola oración.
  - **Logging en Backend:** Imprime en terminal el prompt exacto enviado al LLM y la respuesta JSON devuelta para total transparencia.
- **3. Dashboard Interactivo:** Panel de control con métricas KPI en vivo (Total, Abiertos, En Progreso, Resueltos, Alta Prioridad), filtros reactivos multicriterio y búsqueda instantánea.
- **4. Vista de Detalle del Ticket:**
  - **● Actualizar Estado (Update Status):** Botones directos de 1 clic (*Abierto*, *En Progreso*, *Resuelto*, *Cerrado*) con persistencia inmediata en PostgreSQL.
  - **● Asignar Responsable (Assign Owner):** Sugerencias rápidas de equipo y campo libre para asignar a cualquier persona.
  - **● Agregar Comentarios (Add Comments):** Hilo cronológico de seguimiento con autor, fechas y caja de texto para redactar notas operativas.
  - **● Re-clasificación bajo demanda:** Botón *"Re-clasificar con IA"* para volver a consultar a Gemini si el ticket cambia.
- **5. Trazabilidad Inmutable (Audit Trail):** Registro forense en base de datos (`audit_logs`) con IP, usuario, acción (`CREATE`, `UPDATE`, `AI_CLASSIFY`) y metadatos JSON para cumplimiento normativo.

---

## 📂 Entregables y Documentos de Soporte

Además del código fuente, este repositorio incluye toda la documentación requerida para la presentación ejecutiva:

| Archivo | Formato | Descripción |
| :--- | :--- | :--- |
| **`Diseno_y_Arquitectura_AI_Ticket.docx`** | Word (DOCX) | Documento detallado de diseño técnico, patrones de arquitectura hexagonal, decisiones de DBA, seguridad y flujos de datos. |
| **`Manual_de_Usuario_AI_Ticket.docx`** | Word (DOCX) | Manual funcional paso a paso para usuarios finales y operadores del sistema. |
| **`Presentacion_Demo_AI_Ticket.pptx`** | PowerPoint (PPTX) | Diapositivas profesionales listas para la sesión de sustentación técnica de 5 minutos. |
| **`README.md`** | Markdown | Guía de instalación, comandos, arquitectura y guión de la demo. |
| **`docker-compose.yml`** | YAML | Orquestación completa de PostgreSQL, Backend GraphQL y Frontend React. |
| **`.env.example`** | Config | Plantilla de configuración de variables de entorno. |

---

## 🏛️ Arquitectura del Sistema

Diseñado aplicando los principios de Clean Architecture y la perspectiva multidisciplinaria del panel de 5 expertos:

```
                        ┌──────────────────────────────────────────────┐
                        │      Cliente Web React (Apollo Client)       │
                        └──────────────────────┬───────────────────────┘
                                               │ GraphQL (HTTP / Cookies HttpOnly)
                                               ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ BACKEND (Arquitectura Hexagonal / Clean Architecture)                                       │
│                                                                                             │
│  [Capa 3: Infraestructura - Adaptadores de Entrada]                                         │
│    ├── Express Framework + Apollo Server                                                    │
│    ├── Middlewares: Helmet, Strict CORS con credenciales, Cookies de Sesión Segura          │
│    └── GraphQL TypeDefs & Resolvers (Input/Payload Mutations)                               │
│                                      │                                                      │
│                                      ▼                                                      │
│  [Capa 2: Aplicación - Casos de Uso]                                                        │
│    ├── CreateTicketUseCase           ├── UpdateTicketUseCase                                │
│    ├── GetTicketsUseCase             ├── AddCommentUseCase                                  │
│    ├── GetTicketByIdUseCase          └── ClassifyTicketUseCase                              │
│                                      │                                                      │
│                                      ▼                                                      │
│  [Capa 1: Dominio - Entidades y Reglas de Negocio Puras]                                    │
│    ├── Ticket (Entidad)              ├── Comment (Entidad)                                  │
│    ├── AuditLog (Entidad)            └── ITicketRepository / IAIService (Puertos)          │
│                                      ▲                                                      │
│                                      │ Implementa Puertos                                   │
│  [Capa 3: Infraestructura - Adaptadores de Salida]                                          │
│    ├── PostgreSQL Nativo con pg.Pool y Prepared Statements (¡Cero ORMs!)                    │
│    │    ├── ticket.queries.ts, comment.queries.ts, audit.queries.ts                         │
│    │    └── PostgresTicketRepository.ts, PostgresAuditLogRepository.ts                     │
│    └── GeminiAIService (Google Gemini API con Resilient Heuristic Fallback)                 │
└──────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
    ┌─────────────────────────┐                  ┌────────────────────────┐
    │  PostgreSQL (tickets)   │                  │  Google Gemini API     │
    │  - tickets              │                  │  (LLM en la Nube)      │
    │  - comments             │                  └────────────────────────┘
    │  - audit_logs           │
    └─────────────────────────┘
```

### Justificación Técnica: ¿Por qué NO usamos ORMs (Prisma / TypeORM / Sequelize)?
1. **Rendimiento SQL Puro:** Consultas optimizadas con índices nativos creados en `db.sql` (`idx_tickets_status`, `idx_tickets_category`, `idx_tickets_priority`).
2. **Cero N+1:** Se eliminan las sobrecargas de consultas automáticas de los ORMs mediante consultas explícitas y controladas.
3. **Inmunidad contra Inyección SQL (OWASP A03):** Uso exclusivo de *Prepared Statements* parametrizados (`$1, $2, ...`) en la capa `infrastructure/database/postgres/queries/`.

---

## 💻 Stack Tecnológico

| Capa | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + TypeScript | SPA de alto rendimiento, tipado estricto y renderizado reactivo |
| **Estilos UI** | Tailwind CSS + Lucide Icons | Interfaz moderna, accesible, responsiva y profesional |
| **Cliente API** | Apollo Client | Conexión GraphQL con caché en memoria y transporte de cookies HttpOnly |
| **Backend** | Node.js 20+ / TypeScript | Servidor asíncrono con arquitectura modular desacoplada |
| **API Web** | GraphQL (Apollo Server + Express) | Tipado estricto, mutaciones con patrón Input/Payload, cero over-fetching |
| **Base de Datos**| PostgreSQL 16+ (Nativo `pg`) | Robustez ACID, índices optimizados y consultas preparadas |
| **IA / LLM** | Google Gemini (`gemini-flash-latest`) | Clasificación de lenguaje natural en milisegundos con salidas JSON |
| **Contenedores**| Docker & Docker Compose | Inicialización limpia de infraestructura en un solo paso |

---

## 📁 Estructura del Proyecto

```text
AI-Ticket/
├── docker-compose.yml              # Orquestación de db, backend y frontend
├── .env.example                    # Plantilla de variables de entorno
├── .env                            # Variables de configuración con API Key de Gemini
├── README.md                       # Documentación maestra y guión demo
├── Diseno_y_Arquitectura_AI_Ticket.docx  # Documento técnico formal de arquitectura
├── Manual_de_Usuario_AI_Ticket.docx     # Manual funcional de usuario
├── Presentacion_Demo_AI_Ticket.pptx     # Presentación en diapositivas para la sustentación
│
├── backend/
│   ├── Dockerfile                  # Multi-stage build para Node.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── src/
│       ├── config/                 # Validación de variables con Zod
│       ├── domain/                 # Entidades, Puertos e Invariantes
│       ├── application/            # Casos de Uso y Pruebas Unitarias (.spec.ts)
│       ├── infrastructure/         # Adaptadores (PostgreSQL Nativo, Gemini AI, GraphQL)
│       └── server.ts               # Composition Root
│
└── frontend/
    ├── Dockerfile                  # Multi-stage build con Nginx
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── core/                   # Apollo Client con credenciales HttpOnly
        ├── features/               # Dashboard, Creación con plantillas y Detalle con IA
        └── App.tsx                 # Aplicación principal
```

---

## 🚀 Guía de Instalación y Despliegue

### Opción A: Con Docker Compose (Recomendada para la evaluación)

1. Clonar el repositorio y ubicarse en la carpeta del proyecto:
   ```bash
   cd AI-Ticket
   ```

2. Verificar que el archivo `.env` contenga las claves (ya viene preconfigurado con Gemini).

3. Levantar los 3 contenedores (PostgreSQL, Backend GraphQL y Frontend React):
   ```bash
   docker compose up --build
   ```

4. Acceder en el navegador:
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **GraphQL Playground:** [http://localhost:4000/graphql](http://localhost:4000/graphql)
   - **Healthcheck:** [http://localhost:4000/health](http://localhost:4000/health)

---

### Opción B: Ejecución Local (Sin Docker)

Si se prefiere ejecutar directamente en la máquina host:

#### 1. Configurar Base de Datos PostgreSQL
Verificar que el servicio PostgreSQL esté activo en el puerto 5432 y cargar el esquema y semillas:
```powershell
$env:PGPASSWORD="tu_password"; psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE tickets;"
$env:PGPASSWORD="tu_password"; psql -U postgres -h localhost -p 5432 -d tickets -f "backend\src\infrastructure\database\postgres\db.sql"
$env:PGPASSWORD="tu_password"; psql -U postgres -h localhost -p 5432 -d tickets -f "backend\src\infrastructure\database\postgres\db.seed.sql"
```

#### 2. Iniciar el Backend (Terminal 1)
```bash
cd backend
npm install
npm run dev
```
*Backend activo en `http://localhost:4000/graphql`.*

#### 3. Iniciar el Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
*Frontend activo en `http://localhost:5173`.*

---

## 🎬 Guión Paso a Paso para la Presentación Demo (5 Minutos)

Sigue este guión exacto durante la sesión de sustentación técnica para deslumbrar al evaluador:

### ⏱️ Minuto 1: Introducción y Arquitectura (60 seg)
- **Qué decir:** *"Buenos días/tardes. Para el reto técnico de Sysdatec Corp, construimos un AI Ticket Workspace basado en Clean Architecture y principios Hexagonales. El backend está desarrollado en Node.js con TypeScript y expone una API GraphQL fuertemente tipada. Para la persistencia utilizamos PostgreSQL nativo sin ORMs, garantizando cero riesgo de N+1 y máximo rendimiento. El frontend es una SPA en React con Apollo Client y Tailwind CSS, y el motor de IA está conectado directamente a Google Gemini."*
- **Qué mostrar:** Mostrar los contenedores activos o los comandos de inicio, y destacar en pantalla el dashboard principal.

### ⏱️ Minuto 2: Creación de Ticket y Clasificación por IA en Vivo (60 seg)
- **Qué decir:** *"Vamos a registrar una solicitud en vivo. Contamos con un formulario completo y plantillas de 1 clic con casos empresariales reales."*
- **Acción:**
  1. Haz clic en el botón **"+ Nuevo Ticket"**.
  2. Haz clic en la plantilla rápida **"🚨 Operaciones (Incidente)"** o **"💳 Finanzas (ACH)"**.
  3. Muestra cómo se rellena el cliente, el requerimiento y la URL opcional de Google Drive.
  4. Deja marcado *"Clasificar automáticamente con IA"* y haz clic en **"Crear Ticket"**.
- **Qué mostrar:** Señala la terminal del backend donde se ve el **prompt enviado a Gemini** y la **respuesta JSON recibida**, y luego muestra la primera fila de la tabla en el frontend con su Categoría (*Operations/Finance*), Prioridad (*High*) y Resumen Ejecutivo.

### ⏱️ Minuto 3: Verificación de Persistencia en PostgreSQL (60 seg)
- **Qué decir:** *"Comprobemos que el ticket, su clasificación de IA y sus metadatos se guardaron en las tablas nativas de PostgreSQL."*
- **Acción:** Ejecuta en la terminal o cliente SQL:
  ```sql
  SELECT id, customer_name, category, priority, status, summary, created_at 
  FROM tickets 
  ORDER BY id DESC LIMIT 1;
  ```
- **Qué destacar:** Señala que los valores fueron persistidos con consultas parametrizadas protegiendo la base de datos contra inyecciones SQL.

### ⏱️ Minuto 4: Vista de Detalle, Actualización de Estado y Comentarios (60 seg)
- **Qué decir:** *"En la vista de detalle gestionamos el ciclo de vida del ticket conforme a los requerimientos del assessment."*
- **Acción:**
  1. Haz clic en el ticket recién creado para abrir el modal de detalle.
  2. **Actualizar Estado:** Haz clic en el botón de estado **"En Progreso"** o **"Resuelto"**; muestra la confirmación visual en verde inmediata.
  3. **Asignar Responsable:** Haz clic en una sugerencia rápida (ej. `Martín Vásquez`) o escribe un nombre y haz clic en **"Asignar"**.
  4. **Agregar Comentarios:** En la caja de comentarios escribe *"Incidente atendido y mitigado en clúster"* y haz clic en **"Enviar"**. Muestra cómo aparece en el hilo cronológico.
  5. **Re-clasificar con IA:** Haz clic en el botón **"Re-clasificar con IA"** en la tarjeta de Gemini para demostrar que puede re-analizarse bajo demanda.

### ⏱️ Minuto 5: Auditoría Inmutable (Audit Trail) y Cierre (60 seg)
- **Qué decir:** *"Por requerimientos de DevSecOps, cada operación crítica queda registrada en una tabla inmutable de auditoría."*
- **Acción:**
  1. Despliega la sección **"Trazabilidad de Auditoría en Base de Datos"** en el mismo modal.
  2. Muestra los eventos: `CREATE`, `AI_CLASSIFY`, `UPDATE` y `COMMENT` con fecha, IP y metadatos.
  3. Prueba rápidamente los filtros del Dashboard (filtrar por *Operaciones*, por *Alta Prioridad* o búsqueda por texto).
- **Cierre:** *"La solución cumple al 100% con los requerimientos técnicos, es modular, extensible y está lista para despliegue productivo."*

---

## 🤖 Integración de IA

### Prompt Engineering Estructurado
El servicio `GeminiAIService` invoca el endpoint `generateContent` del modelo `gemini-flash-latest` con formato estricto:

```json
{
  "category": "Finance | Legal | Procurement | Operations | Other",
  "priority": "High | Medium | Low",
  "summary": "Resumen ejecutivo conciso en una sola oración"
}
```

### Resiliencia y Garantía de Demo (Fallback Heurístico)
En caso de fallo de red, cuotas agotadas o falta de internet en la sala de presentación, el sistema cuenta con un clasificador heurístico de respaldo que analiza las palabras clave del dominio para que **la aplicación jamás falle ni arroje un error 500**, garantizando una presentación fluida bajo cualquier circunstancia.

---

## 🛡️ Seguridad y DevSecOps

1. **Inyección SQL (OWASP A03):** 100% de consultas parametrizadas nativas en `infrastructure/database/postgres/queries/`.
2. **Cookies de Sesión Segura:** Emisión de cookie `ai_ticket_session` con atributos `HttpOnly`, `SameSite=Lax` y `Secure` en producción.
3. **Cabeceras de Protección:** Middleware de **Helmet** activo para mitigación de XSS y Clickjacking.
4. **CORS Restrictivo:** Solo permite llamadas desde el origen configurado (`FRONTEND_URL`) con credenciales habilitadas.
5. **Auditoría Inmutable:** Registro de cada transacción crítica en la tabla `audit_logs`.

---

## 🧪 Pruebas Automatizadas

El proyecto incluye pruebas unitarias con **Jest** para los casos de uso:

```bash
cd backend
npm test
```

Resultado:
```text
PASS src/application/use-cases/ClassifyTicketUseCase.spec.ts
PASS src/application/use-cases/CreateTicketUseCase.spec.ts

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
```