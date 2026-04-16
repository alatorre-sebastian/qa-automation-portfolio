# Suite de Pruebas E2E — Cypress (JavaScript)

Suite de pruebas end-to-end escrita en **Cypress** con **JavaScript** que valida los flujos principales de la cypress-realworld-app utilizando **Custom Commands** para encapsular acciones reutilizables.

## Pruebas Incluidas

| Archivo | Flujo | Descripción |
|---|---|---|
| `e2e/login.cy.js` | Inicio de sesión | Login exitoso, credenciales inválidas |
| `e2e/signup.cy.js` | Registro de usuario | Registro con datos válidos |
| `e2e/transaction.cy.js` | Transacciones | Creación y visualización de transacciones |
| `e2e/notification.cy.js` | Notificaciones | Visualización de notificaciones del usuario |

## Custom Commands

Los custom commands están definidos en `support/commands.js` y se cargan automáticamente a través de `support/e2e.js`.

### `cy.login(username, password)`

Inicia sesión en la AUT a través de la UI:

1. Navega a `/signin`
2. Completa los campos de usuario y contraseña
3. Hace clic en el botón de submit
4. Espera a que la URL cambie y el dashboard sea visible

**Ejemplo de uso:**

```javascript
cy.login('Katharina_Bernier', 's3cret');
```

## Fixtures (Datos de Prueba)

El archivo `fixtures/users.json` contiene las credenciales de los usuarios de prueba pre-cargados en la AUT:

- `defaultUser` — Usuario principal para la mayoría de los tests
- `loginUser` — Usuario alternativo para tests de login

## Configuración

El archivo `cypress.config.js` define:

- **URL base**: `http://localhost:3000` (configurable vía variable de entorno `BASE_URL`)
- **Timeout de comandos**: 10 segundos
- **Video**: Habilitado (se graba cada ejecución)
- **Screenshots**: Captura automática en fallos
- **Reporter**: Mochawesome (genera reportes HTML y JSON)
- **Directorio de reportes**: `reports/`

## Estructura del Directorio

```
tests/cypress/
├── package.json          # Dependencias del proyecto
├── cypress.config.js     # Configuración de Cypress
├── e2e/
│   ├── login.cy.js       # Tests de inicio de sesión
│   ├── signup.cy.js      # Tests de registro
│   ├── transaction.cy.js # Tests de transacciones
│   └── notification.cy.js# Tests de notificaciones
├── support/
│   ├── commands.js       # Custom commands (cy.login)
│   └── e2e.js            # Archivo de soporte principal
├── fixtures/
│   └── users.json        # Datos de prueba
├── reports/              # Reportes Mochawesome generados
└── cypress/
    └── videos/           # Videos de ejecución
```

## Instalación

```bash
cd tests/cypress
npm install
```

## Ejecución

```bash
# Ejecutar todas las pruebas en modo headless
npx cypress run

# Ejecutar un archivo de test específico
npx cypress run --spec "e2e/login.cy.js"

# Abrir Cypress en modo interactivo
npx cypress open

# Ejecutar desde la raíz del proyecto con Makefile
make test-cypress
```

## Reportes

Tras la ejecución, los reportes Mochawesome se generan en `reports/`:

- `mochawesome.html` — Reporte HTML navegable
- `mochawesome.json` — Datos del reporte en formato JSON

En caso de fallo, se capturan automáticamente:
- **Screenshots** del estado del navegador en el momento del fallo
- **Videos** de la ejecución completa de cada spec
