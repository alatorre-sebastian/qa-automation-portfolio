# Documento de Requisitos

## Introducción

Este proyecto es un portafolio de QA Engineer que demuestra competencia en múltiples frameworks de testing automatizado. El proyecto ejecuta todas las suites de pruebas contra la aplicación **cypress-realworld-app** (una aplicación financiera de ejemplo con funcionalidades de transacciones, autenticación y notificaciones). La aplicación bajo prueba se incluye como un submódulo de Git y se levanta mediante Docker Compose. La estructura del proyecto organiza las suites de pruebas bajo un directorio `tests/`, con un Makefile como interfaz unificada de ejecución y workflows separados de GitHub Actions por framework.

## Glosario

- **Portafolio**: Proyecto completo que agrupa todas las suites de pruebas automatizadas organizadas por framework.
- **AUT (Application Under Test)**: La aplicación bajo prueba; en este caso, cypress-realworld-app.
- **cypress-realworld-app**: Aplicación web financiera de código abierto desarrollada por el equipo de Cypress que incluye autenticación, transacciones bancarias, notificaciones y perfiles de usuario. Se utiliza como AUT para todas las suites de pruebas.
- **Suite_Playwright**: Conjunto de pruebas end-to-end escritas en Playwright con TypeScript.
- **Suite_Cypress**: Conjunto de pruebas end-to-end escritas en Cypress.
- **Suite_Selenium**: Conjunto de pruebas end-to-end escritas en Selenium.
- **Suite_K6**: Conjunto de pruebas de rendimiento escritas en k6.
- **Pipeline_CI_CD**: Pipelines de integración continua que orquestan la ejecución de las suites de pruebas, implementados como workflows separados de GitHub Actions por framework.
- **Estructura_Proyecto**: Organización de directorios y archivos del portafolio, con la AUT en `apps/` y las suites de pruebas en `tests/`.
- **Reporte_Resultados**: Artefactos generados tras la ejecución de las pruebas que muestran resultados, métricas y evidencias.
- **Docker_Compose**: Herramienta de orquestación de contenedores utilizada para levantar la AUT y sus dependencias mediante un archivo `docker-compose.yml` en la raíz del proyecto.
- **Makefile**: Archivo de automatización en la raíz del proyecto que proporciona una interfaz unificada con targets para ejecutar todas o cada una de las suites de pruebas de forma individual.
- **Git_Submodule**: Mecanismo de Git para incluir un repositorio externo (la cypress-realworld-app) dentro del proyecto como referencia versionada en el directorio `apps/`.

## Requisitos

### Requisito 1: Estructura del Proyecto

**Historia de Usuario:** Como QA Engineer, quiero que el proyecto esté organizado con la AUT en `apps/`, las suites de pruebas en `tests/`, y herramientas de orquestación en la raíz, para que la separación de responsabilidades sea clara y el proyecto sea fácil de navegar.

#### Criterios de Aceptación

1. THE Estructura_Proyecto SHALL contener un directorio `apps/cypress-realworld-app/` que incluya la AUT como un Git_Submodule o fork del repositorio original.
2. THE Estructura_Proyecto SHALL contener un directorio `tests/` con subdirectorios independientes para cada framework: `tests/playwright/`, `tests/cypress/`, `tests/selenium/` y `tests/k6/`.
3. THE Estructura_Proyecto SHALL incluir un archivo `docker-compose.yml` en la raíz del proyecto para levantar la AUT y sus dependencias.
4. THE Estructura_Proyecto SHALL incluir un Makefile en la raíz del proyecto con targets para ejecutar todas las suites (`make test-all`) y cada suite de forma individual (`make test-playwright`, `make test-cypress`, `make test-selenium`, `make test-k6`).
5. THE Estructura_Proyecto SHALL incluir un archivo README.md en el directorio raíz que describa el propósito del portafolio, los frameworks utilizados, la estructura del proyecto, las instrucciones de instalación y las instrucciones de ejecución mediante el Makefile.
6. WHEN un usuario clone el repositorio, THE Estructura_Proyecto SHALL permitir la instalación de dependencias de cada framework de forma independiente mediante un archivo de configuración de dependencias en cada subdirectorio dentro de `tests/`.

### Requisito 2: Configuración de la Aplicación Bajo Prueba con Docker Compose

**Historia de Usuario:** Como QA Engineer, quiero que la cypress-realworld-app se levante mediante Docker Compose, para que el entorno de pruebas sea reproducible y fácil de iniciar con un solo comando.

#### Criterios de Aceptación

1. THE Docker_Compose SHALL definir los servicios necesarios para ejecutar la cypress-realworld-app y sus dependencias en contenedores.
2. WHEN se ejecute `docker-compose up`, THE AUT SHALL estar disponible en una URL base configurable para que las suites de pruebas se conecten a ella.
3. THE Estructura_Proyecto SHALL incluir variables de entorno o un archivo `.env.example` que defina la URL base de la AUT, reutilizable por todas las suites de pruebas.
4. IF la cypress-realworld-app no está disponible al ejecutar una suite de pruebas, THEN THE Suite correspondiente SHALL reportar un error descriptivo indicando que la AUT no está accesible.
5. THE Makefile SHALL incluir un target para levantar la AUT (`make start-aut`) y otro para detenerla (`make stop-aut`) utilizando Docker Compose.

### Requisito 3: Suite de Pruebas con Playwright (TypeScript)

**Historia de Usuario:** Como QA Engineer, quiero una suite de pruebas end-to-end en Playwright con TypeScript, para demostrar mi dominio de este framework moderno de automatización.

#### Criterios de Aceptación

1. THE Suite_Playwright SHALL estar escrita en TypeScript y ubicada en el directorio `tests/playwright/`.
2. THE Suite_Playwright SHALL incluir pruebas para los siguientes flujos de la AUT: inicio de sesión, registro de usuario, creación de transacciones y visualización de notificaciones.
3. WHEN se ejecute la Suite_Playwright, THE Suite_Playwright SHALL generar un reporte HTML con los resultados de las pruebas.
4. THE Suite_Playwright SHALL utilizar el patrón Page Object Model para encapsular la interacción con las páginas de la AUT.
5. THE Suite_Playwright SHALL incluir un archivo de configuración (`playwright.config.ts`) que defina la URL base de la AUT, los navegadores objetivo y los tiempos de espera.
6. IF una prueba de la Suite_Playwright falla, THEN THE Reporte_Resultados SHALL incluir una captura de pantalla del estado del navegador en el momento del fallo.

### Requisito 4: Suite de Pruebas con Cypress

**Historia de Usuario:** Como QA Engineer, quiero una suite de pruebas end-to-end en Cypress, para demostrar mi experiencia con este framework ampliamente utilizado en la industria.

#### Criterios de Aceptación

1. THE Suite_Cypress SHALL estar ubicada en el directorio `tests/cypress/` y seguir la estructura estándar de un proyecto Cypress.
2. THE Suite_Cypress SHALL incluir pruebas para los siguientes flujos de la AUT: inicio de sesión, registro de usuario, creación de transacciones y visualización de notificaciones.
3. WHEN se ejecute la Suite_Cypress, THE Suite_Cypress SHALL generar un reporte de resultados utilizando un reporter compatible (por ejemplo, mochawesome).
4. THE Suite_Cypress SHALL utilizar custom commands de Cypress para encapsular acciones reutilizables como el inicio de sesión.
5. THE Suite_Cypress SHALL incluir un archivo de configuración (`cypress.config.js` o `cypress.config.ts`) que defina la URL base de la AUT y los tiempos de espera.
6. IF una prueba de la Suite_Cypress falla, THEN THE Reporte_Resultados SHALL incluir una captura de pantalla y un video de la ejecución fallida.

### Requisito 5: Suite de Pruebas con Selenium

**Historia de Usuario:** Como QA Engineer, quiero una suite de pruebas end-to-end en Selenium, para demostrar mi conocimiento de este framework clásico de automatización web.

#### Criterios de Aceptación

1. THE Suite_Selenium SHALL estar ubicada en el directorio `tests/selenium/` con su propia configuración de dependencias.
2. THE Suite_Selenium SHALL incluir pruebas para los siguientes flujos de la AUT: inicio de sesión, registro de usuario, creación de transacciones y visualización de notificaciones.
3. THE Suite_Selenium SHALL utilizar el patrón Page Object Model para encapsular la interacción con las páginas de la AUT.
4. WHEN se ejecute la Suite_Selenium, THE Suite_Selenium SHALL generar un reporte de resultados en formato HTML o compatible con el runner de pruebas utilizado.
5. THE Suite_Selenium SHALL incluir configuración para gestionar el WebDriver de forma automática (por ejemplo, mediante un gestor de drivers).
6. IF una prueba de la Suite_Selenium falla, THEN THE Reporte_Resultados SHALL incluir una captura de pantalla del estado del navegador en el momento del fallo.

### Requisito 6: Suite de Pruebas de Rendimiento con k6

**Historia de Usuario:** Como QA Engineer, quiero una suite de pruebas de rendimiento con k6, para demostrar mi capacidad de evaluar el rendimiento de una aplicación web.

#### Criterios de Aceptación

1. THE Suite_K6 SHALL estar ubicada en el directorio `tests/k6/` con sus scripts de prueba.
2. THE Suite_K6 SHALL incluir al menos un escenario de prueba de carga que simule múltiples usuarios concurrentes realizando operaciones contra la API de la AUT.
3. THE Suite_K6 SHALL incluir al menos un escenario de prueba de estrés que incremente gradualmente la cantidad de usuarios virtuales para identificar los límites de la AUT.
4. THE Suite_K6 SHALL definir umbrales (thresholds) de rendimiento que incluyan: tiempo de respuesta del percentil 95 y tasa de errores máxima permitida.
5. WHEN se ejecute la Suite_K6, THE Suite_K6 SHALL generar un reporte con métricas de rendimiento que incluya tiempos de respuesta, throughput y tasa de errores.
6. THE Suite_K6 SHALL incluir un archivo README.md que documente los escenarios de prueba, los umbrales definidos y las instrucciones de ejecución.

### Requisito 7: Pipelines de CI/CD con GitHub Actions

**Historia de Usuario:** Como QA Engineer, quiero configurar pipelines de CI/CD separados por framework en GitHub Actions, para demostrar mi capacidad de integrar pruebas automatizadas en un flujo de integración continua y facilitar el mantenimiento independiente de cada pipeline.

#### Criterios de Aceptación

1. THE Pipeline_CI_CD SHALL incluir workflows separados de GitHub Actions para cada framework, ubicados en `.github/workflows/`: `playwright.yml`, `cypress.yml`, `selenium.yml` y `k6.yml`.
2. WHEN se ejecute un workflow del Pipeline_CI_CD, THE Pipeline_CI_CD SHALL levantar la cypress-realworld-app mediante Docker Compose como paso previo a la ejecución de la suite de pruebas correspondiente.
3. THE Pipeline_CI_CD SHALL recopilar y publicar los reportes de resultados de cada suite como artefactos del workflow correspondiente.
4. IF una suite de pruebas falla durante la ejecución de su workflow, THEN THE Pipeline_CI_CD SHALL marcar el workflow como fallido e incluir los reportes de la suite fallida en los artefactos.
5. THE Pipeline_CI_CD SHALL configurar triggers en push y pull_request a la rama `main` para cada workflow.
6. THE Pipeline_CI_CD SHALL incluir documentación sobre la estructura de los workflows, los triggers configurados y cómo interpretar los resultados, ya sea en el README.md principal o dentro de cada archivo de workflow como comentarios.

### Requisito 8: Documentación del Portafolio

**Historia de Usuario:** Como QA Engineer, quiero que el portafolio tenga documentación profesional y completa, para que reclutadores y equipos técnicos comprendan rápidamente mis habilidades.

#### Criterios de Aceptación

1. THE Portafolio SHALL incluir un archivo README.md principal con las siguientes secciones: descripción del proyecto, tecnologías utilizadas, estructura del proyecto (incluyendo el diagrama de directorios actualizado con `apps/`, `tests/`, `docker-compose.yml` y `Makefile`), instrucciones de instalación, instrucciones de ejecución mediante el Makefile y resultados esperados.
2. THE Portafolio SHALL incluir un archivo README.md dentro de cada subdirectorio de framework en `tests/` que describa las pruebas incluidas, los patrones de diseño utilizados y las instrucciones de ejecución específicas.
3. THE Portafolio SHALL incluir ejemplos de reportes de resultados o capturas de pantalla de ejecuciones exitosas en la documentación.
4. WHEN un usuario revise el portafolio, THE Portafolio SHALL presentar una estructura clara que permita identificar las competencias demostradas en cada framework en un tiempo razonable de revisión.
