# 🧪 QA Automation Portfolio

Portafolio profesional de QA Engineer que demuestra competencia en múltiples frameworks de testing automatizado. Todas las suites de pruebas se ejecutan contra la [cypress-realworld-app](https://github.com/cypress-io/cypress-realworld-app), una aplicación financiera tipo Venmo con autenticación, transacciones bancarias, notificaciones y perfiles de usuario.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#-ejecución)
- [Suites de Pruebas](#-suites-de-pruebas)
- [CI/CD con GitHub Actions](#-cicd-con-github-actions)
- [Resultados Esperados](#-resultados-esperados)
- [Datos de Prueba](#-datos-de-prueba)

---

## 🎯 Descripción del Proyecto

Este portafolio integra cuatro suites de pruebas automatizadas independientes, cada una implementada con un framework distinto, ejecutándose contra una misma aplicación bajo prueba (AUT):

| Framework | Lenguaje | Tipo de Pruebas | Patrón de Diseño |
|-----------|----------|-----------------|------------------|
| **Playwright** | TypeScript | E2E (UI) | Page Object Model |
| **Cypress** | JavaScript | E2E (UI) | Custom Commands |
| **Selenium** | Python | E2E (UI) | Page Object Model |
| **k6** | JavaScript | Rendimiento (API) | Scripts modulares |

La **cypress-realworld-app** se incluye como submódulo de Git y se levanta mediante Docker Compose, proporcionando un entorno reproducible con un solo comando. Un `Makefile` en la raíz del proyecto ofrece una interfaz unificada para ejecutar cualquier suite de forma individual o todas en conjunto.

---

## 🛠 Tecnologías Utilizadas

### Frameworks de Testing
- **[Playwright](https://playwright.dev/)** — Framework moderno de automatización E2E con soporte multi-navegador
- **[Cypress](https://www.cypress.io/)** — Framework de testing E2E ampliamente adoptado en la industria
- **[Selenium WebDriver](https://www.selenium.dev/)** — Framework clásico de automatización web con Python y pytest
- **[k6](https://k6.io/)** — Herramienta de pruebas de rendimiento y carga

### Infraestructura y Orquestación
- **[Docker Compose](https://docs.docker.com/compose/)** — Orquestación de contenedores para la AUT
- **[GitHub Actions](https://github.com/features/actions)** — CI/CD con workflows separados por framework
- **[GNU Make](https://www.gnu.org/software/make/)** — Interfaz unificada de ejecución

### Lenguajes
- TypeScript (Playwright)
- JavaScript (Cypress, k6)
- Python (Selenium)

### Reportes
- Playwright HTML Reporter
- Mochawesome (Cypress)
- pytest-html (Selenium)
- k6 JSON Summary

---

## 📁 Estructura del Proyecto

```
qa-portfolio/
├── apps/
│   └── cypress-realworld-app/       # AUT (Git submodule)
│       ├── src/                     # Frontend React
│       ├── backend/                 # API REST + SQLite
│       └── ...
├── tests/
│   ├── playwright/                  # Suite E2E — TypeScript
│   │   ├── pages/                   # Page Objects (LoginPage, SignUpPage, etc.)
│   │   ├── tests/                   # Specs (login, signup, transaction, notification)
│   │   ├── playwright.config.ts     # Configuración Playwright
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── cypress/                     # Suite E2E — JavaScript
│   │   ├── e2e/                     # Specs (login, signup, transaction, notification)
│   │   ├── support/                 # Custom commands (cy.login)
│   │   ├── fixtures/                # Datos de prueba (users.json)
│   │   ├── cypress.config.js        # Configuración Cypress
│   │   └── package.json
│   ├── selenium/                    # Suite E2E — Python
│   │   ├── pages/                   # Page Objects (BasePage, LoginPage, etc.)
│   │   ├── tests/                   # Tests (test_login, test_signup, etc.)
│   │   ├── conftest.py              # Fixtures pytest + WebDriver setup
│   │   ├── pytest.ini               # Configuración pytest
│   │   └── requirements.txt
│   └── k6/                          # Suite de Rendimiento — JavaScript
│       ├── scripts/
│       │   ├── load-test.js         # Prueba de carga (20 VUs, 3 min)
│       │   └── stress-test.js       # Prueba de estrés (hasta 200 VUs)
│       └── helpers/
│           └── config.js            # Configuración compartida
├── .github/
│   └── workflows/
│       ├── playwright.yml           # CI: Suite Playwright
│       ├── cypress.yml              # CI: Suite Cypress
│       ├── selenium.yml             # CI: Suite Selenium
│       └── k6.yml                   # CI: Suite k6
├── docker-compose.yml               # Orquestación de la AUT
├── Makefile                         # Interfaz unificada de ejecución
├── .env.example                     # Variables de entorno de referencia
├── .gitmodules                      # Configuración del submódulo
├── .gitignore
└── README.md                        # Este archivo
```

---

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Herramienta | Versión mínima | Verificar instalación |
|-------------|---------------|----------------------|
| **Git** | 2.x | `git --version` |
| **Docker** | 20.x | `docker --version` |
| **Docker Compose** | 2.x | `docker-compose --version` |
| **Node.js** | 18.x | `node --version` |
| **npm** | 9.x | `npm --version` |
| **Python** | 3.9+ | `python --version` |
| **pip** | 21.x | `pip --version` |
| **k6** | 0.45+ | `k6 version` |
| **Make** | 3.x | `make --version` |

---

## 🚀 Instalación

### 1. Clonar el repositorio con submódulos

```bash
git clone --recurse-submodules https://github.com/<tu-usuario>/qa-portfolio.git
cd qa-portfolio
```

Si ya clonaste el repositorio sin submódulos, inicialízalos manualmente:

```bash
git submodule update --init --recursive
```

### 2. Verificar que la AUT está presente

```bash
ls apps/cypress-realworld-app/package.json
```

Si el archivo no existe, el submódulo no se inicializó correctamente. Ejecuta `git submodule update --init`.

### 3. Instalar dependencias de cada suite

**Playwright (TypeScript):**
```bash
cd tests/playwright
npm install
npx playwright install --with-deps
```

**Cypress (JavaScript):**
```bash
cd tests/cypress
npm install
```

**Selenium (Python):**
```bash
cd tests/selenium
pip install -r requirements.txt
```

**k6:** No requiere instalación de dependencias adicionales. Solo necesitas tener [k6 instalado](https://grafana.com/docs/k6/latest/set-up/install-k6/) en tu sistema.

### 4. Configurar variables de entorno (opcional)

Copia el archivo de ejemplo y ajusta los valores si es necesario:

```bash
cp .env.example .env
```

Contenido de `.env.example`:
```env
# URL base de la aplicación bajo prueba (frontend)
BASE_URL=http://localhost:3000

# URL base de la API de la aplicación bajo prueba
API_URL=http://localhost:3001/api
```

> Los valores por defecto funcionan correctamente con la configuración de Docker Compose incluida.

---

## ▶️ Ejecución

El `Makefile` proporciona una interfaz unificada para todas las operaciones. Todos los comandos se ejecutan desde la raíz del proyecto.

### Levantar la Aplicación Bajo Prueba

```bash
make start-aut
```

Este comando:
1. Ejecuta `docker-compose up -d` para construir e iniciar la AUT en segundo plano
2. Espera a que la aplicación esté disponible en `http://localhost:3000`
3. Confirma que la AUT está lista para recibir pruebas

> **Puertos expuestos:**
> - `3000` — Frontend (React)
> - `3001` — API REST

### Ejecutar Todas las Suites

```bash
make test-all
```

Ejecuta secuencialmente: Playwright → Cypress → Selenium → k6.

### Ejecutar Suites Individuales

```bash
make test-playwright    # Suite Playwright (TypeScript E2E)
make test-cypress       # Suite Cypress (JavaScript E2E)
make test-selenium      # Suite Selenium (Python E2E)
make test-k6            # Suite k6 (Rendimiento)
```

### Detener la AUT

```bash
make stop-aut
```

### Flujo Completo de Ejecución

```bash
# 1. Levantar la AUT
make start-aut

# 2. Ejecutar todas las suites (o una individual)
make test-all

# 3. Detener la AUT al finalizar
make stop-aut
```

---

## 🔬 Suites de Pruebas

### Playwright (TypeScript) — `tests/playwright/`

Suite E2E que utiliza el patrón **Page Object Model** con TypeScript. Ejecuta pruebas en Chromium y Firefox.

**Flujos cubiertos:**
- Inicio de sesión (credenciales válidas e inválidas)
- Registro de nuevo usuario
- Creación de transacciones financieras
- Visualización de notificaciones

**Page Objects:** `LoginPage`, `SignUpPage`, `TransactionPage`, `NotificationPage`

**Reporte:** HTML generado en `tests/playwright/playwright-report/`

**Características:**
- Captura de pantalla automática en fallos (`screenshot: 'only-on-failure'`)
- Trace en primer reintento para depuración
- Configuración multi-navegador (Chromium, Firefox)

---

### Cypress (JavaScript) — `tests/cypress/`

Suite E2E con **custom commands** reutilizables y reporter Mochawesome.

**Flujos cubiertos:**
- Inicio de sesión mediante custom command `cy.login()`
- Registro de nuevo usuario
- Creación de transacciones financieras
- Visualización de notificaciones

**Reporte:** Mochawesome HTML/JSON en `tests/cypress/reports/`

**Características:**
- Custom command `cy.login(username, password)` para encapsular el flujo de autenticación
- Video de ejecución habilitado
- Captura de pantalla automática en fallos
- Datos de prueba externalizados en `fixtures/users.json`

---

### Selenium (Python) — `tests/selenium/`

Suite E2E con **Page Object Model**, pytest y gestión automática de WebDriver.

**Flujos cubiertos:**
- Inicio de sesión con validaciones
- Registro de nuevo usuario
- Creación de transacciones financieras
- Visualización de notificaciones

**Page Objects:** `BasePage`, `LoginPage`, `SignUpPage`, `TransactionPage`, `NotificationPage`

**Reporte:** pytest-html en `tests/selenium/reports/report.html`

**Características:**
- Chrome WebDriver en modo headless
- Gestión automática de drivers con `webdriver-manager`
- Esperas explícitas con `WebDriverWait`
- Captura de pantalla automática en fallos

---

### k6 (JavaScript) — `tests/k6/`

Suite de pruebas de rendimiento contra la API REST de la AUT.

**Escenarios:**

| Script | Tipo | Usuarios Virtuales | Duración |
|--------|------|-------------------|----------|
| `load-test.js` | Carga | Ramp-up a 20 VUs | ~5 min (1m ramp-up, 3m estable, 1m ramp-down) |
| `stress-test.js` | Estrés | Incremento gradual 10→50→100→200 VUs | Variable |

**Umbrales (Thresholds):**
- `http_req_duration`: p(95) < 500ms
- `http_req_failed`: rate < 0.05 (5%)

**Reporte:** Resumen JSON exportado a `tests/k6/reports/summary.json`

---

## 🔄 CI/CD con GitHub Actions

El proyecto incluye **4 workflows independientes** de GitHub Actions, uno por cada framework. Esta separación permite:

- Ejecución paralela de todas las suites
- Mantenimiento independiente de cada pipeline
- Aislamiento de fallos por framework
- Historial de ejecución específico por suite

### Estructura de Workflows

```
.github/workflows/
├── playwright.yml     # Suite Playwright
├── cypress.yml        # Suite Cypress
├── selenium.yml       # Suite Selenium
└── k6.yml             # Suite k6
```

### Triggers

Todos los workflows se ejecutan automáticamente en:

| Evento | Rama | Descripción |
|--------|------|-------------|
| `push` | `main` | Cada push directo a la rama principal |
| `pull_request` | `main` | Cada Pull Request dirigido a la rama principal |

### Flujo de Cada Workflow

Cada workflow sigue el mismo patrón:

```
1. Checkout del repositorio (con submódulos)
       ↓
2. Levantar la AUT con Docker Compose
       ↓
3. Instalar dependencias del framework
       ↓
4. Ejecutar la suite de pruebas
       ↓
5. Publicar reportes como artefactos
       ↓
6. Detener la AUT (siempre, incluso si hay fallos)
```

### Detalle por Workflow

| Workflow | Archivo | Artefacto | Contenido del Artefacto |
|----------|---------|-----------|------------------------|
| **Playwright Tests** | `playwright.yml` | `playwright-report` | Reporte HTML de Playwright |
| **Cypress Tests** | `cypress.yml` | `cypress-report` | Reporte Mochawesome (HTML + JSON) |
| **Selenium Tests** | `selenium.yml` | `selenium-report` | Reporte pytest-html |
| **k6 Performance Tests** | `k6.yml` | `k6-report` | Resumen JSON de métricas |

### Cómo Interpretar los Resultados

1. **Navega a la pestaña "Actions"** en el repositorio de GitHub
2. **Selecciona el workflow** que deseas revisar (Playwright, Cypress, Selenium o k6)
3. **Revisa el estado del job:**
   - ✅ **Verde (Success):** Todas las pruebas pasaron y los umbrales se cumplieron
   - ❌ **Rojo (Failure):** Una o más pruebas fallaron o un umbral no se cumplió
4. **Descarga los artefactos** desde la sección "Artifacts" del run para ver los reportes detallados
5. **Revisa los logs** de cada step para ver la salida de la ejecución en tiempo real

> **Nota:** Los steps de publicación de artefactos y detención de la AUT se ejecutan siempre (`if: always()`), incluso cuando las pruebas fallan, asegurando que los reportes estén disponibles y los recursos se liberen.

---

## 📊 Resultados Esperados

### Playwright

Al ejecutar `make test-playwright`, se genera un reporte HTML interactivo:

```
tests/playwright/playwright-report/index.html
```

Ejemplo de salida en consola:
```
Running 8 tests using 2 workers

  ✓ [chromium] login.spec.ts:  Login exitoso con credenciales válidas (3.2s)
  ✓ [chromium] login.spec.ts:  Muestra error con credenciales inválidas (1.8s)
  ✓ [chromium] signup.spec.ts: Registro de nuevo usuario (4.1s)
  ✓ [chromium] transaction.spec.ts: Crear nueva transacción (5.3s)
  ✓ [firefox]  login.spec.ts:  Login exitoso con credenciales válidas (4.0s)
  ...

  8 passed (25.4s)
```

### Cypress

Al ejecutar `make test-cypress`, se genera un reporte Mochawesome:

```
tests/cypress/reports/
```

Ejemplo de salida en consola:
```
  (Run Starting)

  ┌──────────────────────────────────────────────────────────┐
  │ Cypress:        13.x                                     │
  │ Browser:        Electron                                 │
  │ Specs:          4 found (login, signup, transaction,     │
  │                 notification)                             │
  └──────────────────────────────────────────────────────────┘

    Running: login.cy.js
      ✓ Inicia sesión con credenciales válidas (2145ms)
      ✓ Muestra error con credenciales inválidas (1023ms)

    Running: transaction.cy.js
      ✓ Crea una nueva transacción (3521ms)
    ...

  All specs passed!
```

### Selenium

Al ejecutar `make test-selenium`, se genera un reporte pytest-html:

```
tests/selenium/reports/report.html
```

Ejemplo de salida en consola:
```
========================= test session starts ==========================
collected 8 items

tests/test_login.py::test_login_success PASSED                   [ 12%]
tests/test_login.py::test_login_invalid_credentials PASSED        [ 25%]
tests/test_signup.py::test_signup_new_user PASSED                 [ 37%]
tests/test_transaction.py::test_create_transaction PASSED         [ 50%]
...

========================= 8 passed in 32.15s ===========================
```

### k6

Al ejecutar `make test-k6`, se muestra un resumen de métricas en consola:

```
          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: scripts/load-test.js
     output: -

  scenarios: (100.00%) 1 scenario, 20 max VUs, 5m30s max duration

     ✓ status is 200

     checks.....................: 100.00% ✓ 1842  ✗ 0
     http_req_duration..........: avg=45ms  min=12ms  max=312ms  p(95)=125ms
     http_req_failed............: 0.00%   ✓ 0     ✗ 1842
     http_reqs..................: 1842    6.14/s
     vus........................: 20      min=0   max=20

  ✓ http_req_duration..........: p(95) < 500ms
  ✓ http_req_failed............: rate < 0.05
```

---

## 🔑 Datos de Prueba

Las suites E2E utilizan datos de prueba predefinidos que provienen del seeding automático de la AUT:

| Dato | Valor |
|------|-------|
| **Usuario** | `Katharina_Bernier` |
| **Contraseña** | `s3cret` |
| **URL Frontend** | `http://localhost:3000` |
| **URL API** | `http://localhost:3001/api` |

> Estos datos se cargan automáticamente al iniciar la AUT con Docker Compose. No es necesario configurar una base de datos manualmente.

---

## 📄 Licencia

Este proyecto es un portafolio educativo y de demostración. La cypress-realworld-app incluida como submódulo mantiene su propia licencia MIT.
