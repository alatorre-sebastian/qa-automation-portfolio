# Suite de Pruebas E2E — Playwright (TypeScript)

Suite de pruebas end-to-end escrita en **Playwright** con **TypeScript** que valida los flujos principales de la cypress-realworld-app utilizando el patrón **Page Object Model (POM)**.

## Pruebas Incluidas

| Archivo | Flujo | Descripción |
|---|---|---|
| `tests/login.spec.ts` | Inicio de sesión | Login exitoso, credenciales inválidas |
| `tests/signup.spec.ts` | Registro de usuario | Registro con datos válidos |
| `tests/transaction.spec.ts` | Transacciones | Creación y visualización de transacciones |
| `tests/notification.spec.ts` | Notificaciones | Visualización de notificaciones del usuario |

## Patrón de Diseño: Page Object Model

Cada página de la AUT está encapsulada en una clase dentro del directorio `pages/`. Los Page Objects exponen métodos que representan acciones del usuario, manteniendo los selectores aislados de los tests.

**Page Objects disponibles:**

- `LoginPage.ts` — Métodos: `navigate()`, `fillUsername()`, `fillPassword()`, `submit()`, `getErrorMessage()`
- `SignUpPage.ts` — Métodos para el flujo completo de registro
- `TransactionPage.ts` — Métodos para crear y visualizar transacciones
- `NotificationPage.ts` — Métodos para visualizar notificaciones

Adicionalmente, `helpers/auth.ts` proporciona una función utilitaria `login()` reutilizable en los tests.

## Configuración

El archivo `playwright.config.ts` define:

- **URL base**: `http://localhost:3000` (configurable vía variable de entorno `BASE_URL`)
- **Navegadores**: Chromium y Firefox
- **Timeout**: 30 segundos por test
- **Reintentos**: 1 reintento por test
- **Screenshots**: Solo en fallos (`only-on-failure`)
- **Traces**: En el primer reintento (`on-first-retry`)
- **Reporter**: HTML (se genera automáticamente)

## Estructura del Directorio

```
tests/playwright/
├── package.json              # Dependencias del proyecto
├── playwright.config.ts      # Configuración de Playwright
├── tsconfig.json             # Configuración de TypeScript
├── helpers/
│   └── auth.ts               # Función utilitaria de login
├── pages/
│   ├── LoginPage.ts          # Page Object - Login
│   ├── SignUpPage.ts         # Page Object - Registro
│   ├── TransactionPage.ts   # Page Object - Transacciones
│   └── NotificationPage.ts  # Page Object - Notificaciones
├── tests/
│   ├── login.spec.ts         # Tests de inicio de sesión
│   ├── signup.spec.ts        # Tests de registro
│   ├── transaction.spec.ts   # Tests de transacciones
│   └── notification.spec.ts  # Tests de notificaciones
├── playwright-report/        # Reporte HTML generado
└── test-results/             # Resultados y artefactos de ejecución
```

## Instalación

```bash
cd tests/playwright
npm install
npx playwright install --with-deps
```

## Ejecución

```bash
# Ejecutar todas las pruebas
npx playwright test

# Ejecutar en modo headed (con navegador visible)
npx playwright test --headed

# Ejecutar un archivo de test específico
npx playwright test tests/login.spec.ts

# Ejecutar desde la raíz del proyecto con Makefile
make test-playwright
```

## Reportes

Tras la ejecución, el reporte HTML se genera en `playwright-report/`.

Para visualizar el reporte:

```bash
npx playwright show-report
```

En caso de fallo, se capturan automáticamente:
- **Screenshots** del estado del navegador en el momento del fallo
- **Traces** en el primer reintento (navegables con el Trace Viewer de Playwright)
