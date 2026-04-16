# Plan de Implementación: qa-portfolio

## Resumen

Este plan convierte el diseño del portafolio de QA en tareas de codificación incrementales. Cada tarea construye sobre las anteriores, comenzando por la estructura base del proyecto con el submódulo de Git, Docker Compose y Makefile, luego cada suite de pruebas bajo `tests/`, seguido por los workflows separados de CI/CD, y finalmente la documentación. Todas las suites se ejecutan contra la cypress-realworld-app levantada mediante Docker Compose.

## Tareas

- [x] 1. Crear la estructura raíz del proyecto, submódulo de Git y archivos de configuración base
  - [x] 1.1 Inicializar la estructura de directorios y el submódulo de la AUT
    - Crear los directorios: `apps/`, `tests/playwright/`, `tests/cypress/`, `tests/selenium/`, `tests/k6/`, `.github/workflows/`
    - Agregar `cypress-realworld-app` como submódulo de Git en `apps/cypress-realworld-app/` (esto genera el archivo `.gitmodules`)
    - _Requisitos: 1.1, 1.2_

  - [x] 1.2 Crear archivos de configuración compartida
    - Crear `.env.example` con las variables `BASE_URL=http://localhost:3000` y `API_URL=http://localhost:3001/api`
    - Crear `.gitignore` con exclusiones para `node_modules/`, `__pycache__/`, reportes generados, screenshots, videos y archivos temporales
    - _Requisitos: 1.2, 2.3_

  - [x] 1.3 Crear el archivo `docker-compose.yml` en la raíz del proyecto
    - Definir el servicio `realworld-app` que construya la imagen desde `./apps/cypress-realworld-app`
    - Exponer los puertos `3000` (frontend) y `3001` (API)
    - Configurar variables de entorno (`NODE_ENV=development`)
    - Agregar healthcheck para verificar que la AUT está disponible
    - _Requisitos: 2.1, 2.2, 2.3_

  - [x] 1.4 Crear el `Makefile` en la raíz del proyecto
    - Implementar target `start-aut` que ejecute `docker-compose up -d` y espere a que la AUT esté disponible
    - Implementar target `stop-aut` que ejecute `docker-compose down`
    - Implementar targets individuales: `test-playwright`, `test-cypress`, `test-selenium`, `test-k6` que ejecuten cada suite desde su directorio en `tests/`
    - Implementar target `test-all` que ejecute todas las suites secuencialmente
    - _Requisitos: 1.4, 2.5_

- [x] 2. Checkpoint - Verificar estructura base
  - Asegurar que el submódulo está correctamente configurado y que `apps/cypress-realworld-app/` contiene el código de la AUT
  - Verificar que `docker-compose.yml` y `Makefile` están en la raíz con la sintaxis correcta
  - Asegurar que todos los directorios bajo `tests/` existen
  - Preguntar al usuario si hay dudas o ajustes necesarios

- [x] 3. Implementar la suite de pruebas Playwright (TypeScript)
  - [x] 3.1 Configurar el proyecto Playwright
    - Crear `tests/playwright/package.json` con dependencias: `@playwright/test`, `typescript`
    - Crear `tests/playwright/tsconfig.json` con configuración TypeScript estricta
    - Crear `tests/playwright/playwright.config.ts` definiendo `baseURL` desde variable de entorno, navegadores (`chromium`, `firefox`), timeouts, reporter HTML, captura de pantalla en fallo (`screenshot: 'only-on-failure'`) y trace en primer reintento
    - _Requisitos: 3.1, 3.3, 3.5, 3.6_

  - [x] 3.2 Crear los Page Objects de Playwright
    - Crear `tests/playwright/pages/LoginPage.ts` con métodos: `navigate()`, `fillUsername()`, `fillPassword()`, `submit()`, `getErrorMessage()`
    - Crear `tests/playwright/pages/SignUpPage.ts` con métodos para el flujo de registro
    - Crear `tests/playwright/pages/TransactionPage.ts` con métodos para crear y visualizar transacciones
    - Crear `tests/playwright/pages/NotificationPage.ts` con métodos para visualizar notificaciones
    - Cada Page Object debe encapsular selectores y acciones de la página correspondiente de la AUT
    - _Requisitos: 3.4_

  - [x] 3.3 Escribir los tests E2E de Playwright
    - Crear `tests/playwright/tests/login.spec.ts` con pruebas de inicio de sesión (login exitoso, credenciales inválidas)
    - Crear `tests/playwright/tests/signup.spec.ts` con pruebas de registro de usuario
    - Crear `tests/playwright/tests/transaction.spec.ts` con pruebas de creación de transacciones
    - Crear `tests/playwright/tests/notification.spec.ts` con pruebas de visualización de notificaciones
    - Todos los tests deben usar los Page Objects creados en 3.2
    - _Requisitos: 3.2, 3.4_

- [x] 4. Checkpoint - Verificar suite Playwright
  - Instalar dependencias con `npm install` en `tests/playwright/`
  - Asegurar que todos los tests pasan contra la AUT ejecutando `npx playwright test` desde `tests/playwright/`
  - Verificar que se genera el reporte HTML en `tests/playwright/playwright-report/`
  - Preguntar al usuario si hay dudas o ajustes necesarios

- [x] 5. Implementar la suite de pruebas Cypress (JavaScript)
  - [x] 5.1 Configurar el proyecto Cypress
    - Crear `tests/cypress/package.json` con dependencias: `cypress`, `mochawesome`, `mochawesome-merge`, `mochawesome-report-generator`
    - Crear `tests/cypress/cypress.config.js` definiendo `baseUrl` desde variable de entorno, `defaultCommandTimeout`, video habilitado, screenshots en fallo, y reporter mochawesome con opciones de reporte en directorio `reports/`
    - Crear `tests/cypress/support/e2e.js` como archivo de soporte principal
    - _Requisitos: 4.1, 4.3, 4.5, 4.6_

  - [x] 5.2 Crear los custom commands y fixtures de Cypress
    - Crear `tests/cypress/support/commands.js` con el custom command `cy.login(username, password)` que encapsula el flujo de inicio de sesión
    - Crear `tests/cypress/fixtures/users.json` con datos de prueba (usuario `Katharina_Bernier` / `s3cret`)
    - _Requisitos: 4.4_

  - [x] 5.3 Escribir los tests E2E de Cypress
    - Crear `tests/cypress/e2e/login.cy.js` con pruebas de inicio de sesión usando el custom command `cy.login()`
    - Crear `tests/cypress/e2e/signup.cy.js` con pruebas de registro de usuario
    - Crear `tests/cypress/e2e/transaction.cy.js` con pruebas de creación de transacciones
    - Crear `tests/cypress/e2e/notification.cy.js` con pruebas de visualización de notificaciones
    - _Requisitos: 4.2_

- [x] 6. Checkpoint - Verificar suite Cypress
  - Instalar dependencias con `npm install` en `tests/cypress/`
  - Asegurar que todos los tests pasan contra la AUT ejecutando `npx cypress run` desde `tests/cypress/`
  - Verificar que se genera el reporte mochawesome en `tests/cypress/reports/`
  - Preguntar al usuario si hay dudas o ajustes necesarios

- [x] 7. Implementar la suite de pruebas Selenium (Python)
  - [x] 7.1 Configurar el proyecto Selenium
    - Crear `tests/selenium/requirements.txt` con dependencias: `selenium`, `pytest`, `pytest-html`, `webdriver-manager`
    - Crear `tests/selenium/pytest.ini` con configuración de pytest (directorio de tests, opciones de reporte)
    - Crear `tests/selenium/conftest.py` con fixture `driver` que inicializa Chrome WebDriver en modo headless usando `webdriver-manager`, configura la URL base desde variable de entorno, y cierra el driver al finalizar
    - Agregar hook `pytest_runtest_makereport` en `tests/selenium/conftest.py` para captura de pantalla automática en fallos
    - _Requisitos: 5.1, 5.4, 5.5, 5.6_
 
  - [x] 7.2 Crear los Page Objects de Selenium
    - Crear `tests/selenium/pages/base_page.py` con clase `BasePage` que incluya métodos: `navigate()`, `find_element()`, `take_screenshot()` y uso de `WebDriverWait` con esperas explícitas
    - Crear `tests/selenium/pages/login_page.py` con clase `LoginPage` que herede de `BasePage`
    - Crear `tests/selenium/pages/signup_page.py` con clase `SignUpPage` que herede de `BasePage`
    - Crear `tests/selenium/pages/transaction_page.py` con clase `TransactionPage` que herede de `BasePage`
    - Crear `tests/selenium/pages/notification_page.py` con clase `NotificationPage` que herede de `BasePage`
    - _Requisitos: 5.3_

  - [x] 7.3 Escribir los tests E2E de Selenium
    - Crear `tests/selenium/tests/test_login.py` con pruebas de inicio de sesión usando `LoginPage`
    - Crear `tests/selenium/tests/test_signup.py` con pruebas de registro de usuario usando `SignUpPage`
    - Crear `tests/selenium/tests/test_transaction.py` con pruebas de creación de transacciones usando `TransactionPage`
    - Crear `tests/selenium/tests/test_notification.py` con pruebas de visualización de notificaciones usando `NotificationPage`
    - _Requisitos: 5.2_

- [x] 8. Checkpoint - Verificar suite Selenium
  - Instalar dependencias con `pip install -r requirements.txt` en `tests/selenium/`
  - Asegurar que todos los tests pasan contra la AUT ejecutando `python -m pytest tests/ --html=reports/report.html` desde `tests/selenium/`
  - Verificar que se genera el reporte HTML de pytest en `tests/selenium/reports/`
  - Preguntar al usuario si hay dudas o ajustes necesarios

- [x] 9. Implementar la suite de pruebas de rendimiento k6
  - [x] 9.1 Crear la configuración y helpers de k6
    - Crear `tests/k6/helpers/config.js` exportando la URL base de la API (`API_URL`) y credenciales de prueba
    - _Requisitos: 6.1_

  - [x] 9.2 Crear el script de prueba de carga
    - Crear `tests/k6/scripts/load-test.js` con escenario de carga: ramp-up a 20 usuarios virtuales, estado estable durante 3 minutos, ramp-down
    - Definir thresholds: `http_req_duration` p(95) < 500ms, `http_req_failed` rate < 0.05
    - Incluir checks de respuesta HTTP (status 200)
    - Importar configuración desde `helpers/config.js`
    - _Requisitos: 6.2, 6.4, 6.5_

  - [x] 9.3 Crear el script de prueba de estrés
    - Crear `tests/k6/scripts/stress-test.js` con escenario de estrés: incremento gradual de usuarios virtuales (10 → 50 → 100 → 200) para identificar límites
    - Definir thresholds de rendimiento
    - Incluir checks de respuesta HTTP
    - _Requisitos: 6.3, 6.4, 6.5_

- [x] 10. Checkpoint - Verificar suite k6
  - Asegurar que los scripts de k6 se ejecutan correctamente contra la API de la AUT
  - Verificar que los thresholds se evalúan y el reporte de métricas se genera
  - Preguntar al usuario si hay dudas o ajustes necesarios

- [x] 11. Implementar los workflows separados de CI/CD con GitHub Actions
  - [x] 11.1 Crear el workflow de Playwright (`.github/workflows/playwright.yml`)
    - Configurar triggers en push y pull_request a la rama `main`
    - Agregar step de checkout con `submodules: true` para clonar el submódulo de la AUT
    - Agregar step para levantar la AUT con `docker-compose up -d --wait`
    - Agregar steps para instalar dependencias de Playwright y ejecutar la suite desde `tests/playwright/`
    - Publicar el reporte HTML como artefacto con `actions/upload-artifact@v4`
    - Agregar step para detener la AUT con `docker-compose down` usando `if: always()`
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 11.2 Crear el workflow de Cypress (`.github/workflows/cypress.yml`)
    - Configurar triggers en push y pull_request a la rama `main`
    - Agregar step de checkout con `submodules: true`
    - Agregar step para levantar la AUT con Docker Compose
    - Agregar steps para instalar dependencias de Cypress y ejecutar la suite desde `tests/cypress/`
    - Publicar el reporte mochawesome como artefacto
    - Agregar step para detener la AUT con `if: always()`
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 11.3 Crear el workflow de Selenium (`.github/workflows/selenium.yml`)
    - Configurar triggers en push y pull_request a la rama `main`
    - Agregar step de checkout con `submodules: true`
    - Agregar step para levantar la AUT con Docker Compose
    - Agregar steps para instalar dependencias de Selenium (pip install) y ejecutar la suite desde `tests/selenium/`
    - Publicar el reporte HTML de pytest como artefacto
    - Agregar step para detener la AUT con `if: always()`
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 11.4 Crear el workflow de k6 (`.github/workflows/k6.yml`)
    - Configurar triggers en push y pull_request a la rama `main`
    - Agregar step de checkout con `submodules: true`
    - Agregar step para instalar k6
    - Agregar step para levantar la AUT con Docker Compose
    - Agregar step para ejecutar la suite k6 desde `tests/k6/` con exportación de resumen a JSON
    - Publicar el reporte de k6 como artefacto
    - Agregar step para detener la AUT con `if: always()`
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 12. Checkpoint - Verificar workflows de CI/CD
  - Revisar que cada archivo YAML de workflow es válido y tiene la estructura correcta
  - Verificar que cada workflow tiene checkout con submódulos, levanta la AUT, ejecuta su suite y publica artefactos
  - Verificar que los triggers están configurados en push y pull_request a `main`
  - Preguntar al usuario si hay dudas o ajustes necesarios

- [x] 13. Crear la documentación del portafolio
  - [x] 13.1 Crear el README.md principal del proyecto
    - Escribir secciones: descripción del proyecto, tecnologías utilizadas, estructura del proyecto (diagrama de directorios con `apps/`, `tests/`, `docker-compose.yml` y `Makefile`), instrucciones de instalación (incluyendo `git submodule update --init`), instrucciones de ejecución mediante el Makefile (`make start-aut`, `make test-all`, etc.), y resultados esperados
    - Incluir ejemplos de reportes o capturas de pantalla de ejecuciones exitosas
    - Documentar la estructura de los workflows de CI/CD, los triggers configurados y cómo interpretar los resultados
    - _Requisitos: 1.5, 8.1, 8.3, 8.4, 7.6_

  - [x] 13.2 Crear los README.md de cada subdirectorio de framework
    - Crear `tests/playwright/README.md` describiendo las pruebas incluidas, el patrón POM utilizado, instrucciones de instalación y ejecución
    - Crear `tests/cypress/README.md` describiendo las pruebas incluidas, los custom commands, instrucciones de instalación y ejecución
    - Crear `tests/selenium/README.md` describiendo las pruebas incluidas, el patrón POM utilizado, instrucciones de instalación y ejecución
    - Crear `tests/k6/README.md` documentando los escenarios de prueba, los umbrales definidos e instrucciones de ejecución
    - _Requisitos: 6.6, 8.2_

- [x] 14. Checkpoint final - Verificar completitud del portafolio
  - Asegurar que todos los archivos están creados y la estructura de directorios es correcta (`apps/cypress-realworld-app/`, `tests/playwright/`, `tests/cypress/`, `tests/selenium/`, `tests/k6/`, `docker-compose.yml`, `Makefile`)
  - Verificar que todos los requisitos (1 a 8) están cubiertos por las tareas implementadas
  - Preguntar al usuario si hay dudas o ajustes finales

## Notas

- Cada tarea construye sobre las anteriores de forma incremental
- Los checkpoints permiten validar el progreso antes de continuar con la siguiente suite
- No se incluyen property-based tests ya que el diseño determina que no son apropiados para este proyecto (las suites son pruebas E2E con efectos secundarios, no funciones puras)
- Cada tarea referencia los requisitos específicos que cubre para trazabilidad
- La AUT (cypress-realworld-app) debe estar ejecutándose mediante Docker Compose (`make start-aut`) antes de correr cualquier suite de pruebas
- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido (en este proyecto no hay tareas opcionales ya que no se aplican property-based tests)
- Los workflows de CI/CD son archivos separados por framework (no un pipeline monolítico) para facilitar el mantenimiento independiente
- No existe directorio `ci-cd/`; los workflows residen directamente en `.github/workflows/`
