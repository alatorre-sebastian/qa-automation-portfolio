# 🧪 QA Automation Portfolio

![Playwright](https://img.shields.io/badge/-Playwright-%232EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Cypress](https://img.shields.io/badge/-Cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)
![Selenium](https://img.shields.io/badge/-Selenium-%2343B02A?style=for-the-badge&logo=selenium&logoColor=white)
![k6](https://img.shields.io/badge/-k6-%237D64FF?style=for-the-badge&logo=k6&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/-GitHub%20Actions-%232088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-%232496ED?style=for-the-badge&logo=docker&logoColor=white)

Portafolio de QA Automation Engineer que demuestra competencia en **4 frameworks de testing** ejecutándose contra una misma aplicación real. Cada suite tiene su propio pipeline de CI/CD independiente en GitHub Actions.

[![Playwright Tests](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/playwright.yml)
[![Cypress Tests](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/cypress.yml/badge.svg)](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/cypress.yml)
[![Selenium Tests](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/selenium.yml/badge.svg)](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/selenium.yml)
[![k6 Tests](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/k6.yml/badge.svg)](https://github.com/alatorre-sebastian/qa-automation-portfolio/actions/workflows/k6.yml)

---

## Qué demuestra este proyecto

| Competencia | Cómo se demuestra |
|---|---|
| **Multi-framework** | 4 suites independientes: Playwright, Cypress, Selenium, k6 |
| **Multi-lenguaje** | TypeScript, JavaScript, Python |
| **Patrones de diseño** | Page Object Model (Playwright, Selenium), Custom Commands (Cypress) |
| **Performance testing** | Pruebas de carga y estrés con k6 contra la API REST |
| **CI/CD** | 4 pipelines independientes en GitHub Actions con artefactos |
| **Infraestructura** | Docker Compose para la AUT, Makefile como interfaz unificada |
| **Documentación** | README por framework, reportes HTML, estructura clara |

---

## Suites de Pruebas

Todas las suites se ejecutan contra la [cypress-realworld-app](https://github.com/cypress-io/cypress-realworld-app), una aplicación financiera tipo Venmo con autenticación, transacciones, notificaciones y perfiles de usuario.

### 🎭 Playwright — TypeScript E2E

**Patrón**: Page Object Model | **Navegadores**: Chromium, Firefox

```
tests/playwright/
├── pages/          → LoginPage, SignUpPage, TransactionPage, NotificationPage
├── tests/          → login, signup, transaction, notification specs
└── playwright.config.ts
```

**Tests**: Login exitoso/fallido · Registro de usuario · Creación de transacciones · Notificaciones
**Reporte**: HTML interactivo con screenshots en fallos y traces para debugging

📂 [Ver código](tests/playwright/) · 📄 [Ver README](tests/playwright/README.md)

---

### 🌲 Cypress — JavaScript E2E

**Patrón**: Custom Commands | **Reporter**: Mochawesome

```
tests/cypress/
├── e2e/            → login, signup, transaction, notification specs
├── support/        → cy.login() custom command
├── fixtures/       → datos de prueba (users.json)
└── cypress.config.js
```

**Tests**: Login con custom command · Registro · Transacciones · Notificaciones
**Reporte**: Mochawesome HTML/JSON con video de cada ejecución

📂 [Ver código](tests/cypress/) · 📄 [Ver README](tests/cypress/README.md)

---

### 🔬 Selenium — Python E2E

**Patrón**: Page Object Model + pytest | **Driver**: Chrome headless (webdriver-manager)

```
tests/selenium/
├── pages/          → BasePage, LoginPage, SignUpPage, TransactionPage, NotificationPage
├── tests/          → test_login, test_signup, test_transaction, test_notification
└── conftest.py     → fixtures + screenshot automático en fallos
```

**Tests**: Login con validaciones · Registro · Transacciones · Notificaciones
**Reporte**: pytest-html autocontenido con screenshots en fallos

📂 [Ver código](tests/selenium/) · 📄 [Ver README](tests/selenium/README.md)

---

### ⚡ k6 — Performance Testing

**Tipo**: Carga y Estrés contra la API REST

```
tests/k6/
├── scripts/        → load-test.js (20 VUs), stress-test.js (hasta 200 VUs)
└── helpers/        → config.js (URLs, credenciales)
```

| Escenario | Usuarios Virtuales | Duración | Thresholds |
|---|---|---|---|
| **Carga** | Ramp-up a 20 VUs | ~5 min | p(95) < 2s, errores < 5% |
| **Estrés** | 10 → 50 → 100 → 200 VUs | ~14 min | p(95) < 3s, errores < 10% |

**Endpoints**: POST /login · GET /transactions/public · GET /users · GET /notifications

📂 [Ver código](tests/k6/) · 📄 [Ver README](tests/k6/README.md)

---

## CI/CD

Cada framework tiene su propio workflow de GitHub Actions. Se ejecutan en paralelo en cada push/PR a `main`.

```
.github/workflows/
├── playwright.yml    → Build Docker → Playwright tests → Publicar reporte HTML
├── cypress.yml       → Build Docker → Cypress tests    → Publicar reporte Mochawesome
├── selenium.yml      → Build Docker → Selenium tests   → Publicar reporte pytest-html
└── k6.yml            → Build Docker → k6 load test     → Publicar resumen JSON
```

Cada workflow:
1. Clona el repo con el submódulo de la AUT
2. Construye y levanta la app con Docker Compose
3. Ejecuta la suite de pruebas
4. Publica los reportes como artefactos (descargables desde la pestaña Actions)
5. Destruye el contenedor

---

## Estructura del Proyecto

```
qa-automation-portfolio/
├── apps/
│   └── cypress-realworld-app/    # AUT (Git submodule)
├── tests/
│   ├── playwright/               # TypeScript E2E
│   ├── cypress/                  # JavaScript E2E
│   ├── selenium/                 # Python E2E
│   └── k6/                       # Performance
├── .github/workflows/            # 4 pipelines CI/CD
├── docker-compose.yml            # Orquestación de la AUT
├── Dockerfile.aut                # Imagen Docker de la AUT
├── Makefile                      # Interfaz unificada
└── .env.example                  # Variables de entorno
```

---

## Ejecución Local

<details>
<summary><strong>Requisitos previos</strong></summary>

| Herramienta | Verificar |
|---|---|
| Git | `git --version` |
| Docker + Docker Compose | `docker compose version` |
| Node.js 18+ | `node --version` |
| Python 3.9+ | `python --version` |
| k6 | `k6 version` |

</details>

<details>
<summary><strong>Instalación</strong></summary>

```bash
# Clonar con submódulos
git clone --recurse-submodules https://github.com/alatorre-sebastian/qa-automation-portfolio.git
cd qa-automation-portfolio

# Si ya clonaste sin submódulos
git submodule update --init --recursive

# Instalar dependencias por framework
cd tests/playwright && npm install && npx playwright install --with-deps && cd ../..
cd tests/cypress && npm install && cd ../..
cd tests/selenium && pip install -r requirements.txt && cd ../..
```

</details>

<details>
<summary><strong>Ejecutar tests</strong></summary>

```bash
# Levantar la app
make start-aut

# Ejecutar todas las suites
make test-all

# O ejecutar una suite individual
make test-playwright
make test-cypress
make test-selenium
make test-k6

# Detener la app
make stop-aut
```

</details>

---

## Tecnologías

| Categoría | Tecnologías |
|---|---|
| **E2E Testing** | Playwright, Cypress, Selenium WebDriver |
| **Performance** | k6 (Grafana) |
| **Lenguajes** | TypeScript, JavaScript, Python |
| **Test Runners** | Playwright Test, Cypress, pytest |
| **CI/CD** | GitHub Actions (4 workflows independientes) |
| **Infraestructura** | Docker Compose, Makefile |
| **Reportes** | Playwright HTML, Mochawesome, pytest-html, k6 JSON |
