# Suite de Pruebas E2E — Selenium (Python)

Suite de pruebas end-to-end escrita en **Selenium WebDriver** con **Python** y **pytest** que valida los flujos principales de la cypress-realworld-app utilizando el patrón **Page Object Model (POM)**.

## Pruebas Incluidas

| Archivo | Flujo | Descripción |
|---|---|---|
| `tests/test_login.py` | Inicio de sesión | Login exitoso, credenciales inválidas |
| `tests/test_signup.py` | Registro de usuario | Registro con datos válidos |
| `tests/test_transaction.py` | Transacciones | Creación y visualización de transacciones |
| `tests/test_notification.py` | Notificaciones | Visualización de notificaciones del usuario |

## Patrón de Diseño: Page Object Model

Cada página de la AUT está encapsulada en una clase dentro del directorio `pages/`. Todas las clases heredan de `BasePage`, que proporciona métodos comunes para navegación, búsqueda de elementos y capturas de pantalla.

**Page Objects disponibles:**

- `BasePage` — Clase base con métodos: `navigate()`, `find_element()`, `take_screenshot()` y esperas explícitas con `WebDriverWait`
- `LoginPage` — Hereda de `BasePage`. Encapsula el formulario de login
- `SignUpPage` — Hereda de `BasePage`. Encapsula el formulario de registro
- `TransactionPage` — Hereda de `BasePage`. Encapsula la creación y visualización de transacciones
- `NotificationPage` — Hereda de `BasePage`. Encapsula la visualización de notificaciones

## Configuración

### `conftest.py`

Define los fixtures de pytest:

- **`driver`** — Inicializa Chrome WebDriver en modo headless usando `webdriver-manager` para gestión automática del driver. Configura ventana de 1920x1080 y espera implícita de 10 segundos.
- **`base_url`** — Retorna la URL base de la AUT desde la variable de entorno `BASE_URL` (por defecto `http://localhost:3000`).
- **Hook `pytest_runtest_makereport`** — Captura automática de screenshots en caso de fallo.

### `pytest.ini`

- **Directorio de tests**: `tests/`
- **Opciones por defecto**: Genera reporte HTML autocontenido en `reports/report.html`
- **Markers**: `smoke`, `login`, `signup`, `transaction`, `notification`

## Estructura del Directorio

```
tests/selenium/
├── requirements.txt          # Dependencias Python
├── conftest.py               # Fixtures y configuración de pytest
├── pytest.ini                # Configuración de pytest
├── pages/
│   ├── __init__.py
│   ├── base_page.py          # Page Object base
│   ├── login_page.py         # Page Object - Login
│   ├── signup_page.py        # Page Object - Registro
│   ├── transaction_page.py   # Page Object - Transacciones
│   └── notification_page.py  # Page Object - Notificaciones
├── tests/
│   ├── __init__.py
│   ├── test_login.py         # Tests de inicio de sesión
│   ├── test_signup.py        # Tests de registro
│   ├── test_transaction.py   # Tests de transacciones
│   └── test_notification.py  # Tests de notificaciones
├── reports/
│   └── report.html           # Reporte HTML generado por pytest-html
└── screenshots/              # Capturas de pantalla en fallos
```

## Instalación

```bash
cd tests/selenium
pip install -r requirements.txt
```

### Dependencias

| Paquete | Versión | Descripción |
|---|---|---|
| `selenium` | 4.27.1 | WebDriver para automatización de navegadores |
| `pytest` | 8.3.4 | Framework de testing |
| `pytest-html` | 4.1.1 | Plugin para generar reportes HTML |
| `webdriver-manager` | 4.0.2 | Gestión automática de drivers de navegador |

## Ejecución

```bash
# Ejecutar todas las pruebas con reporte HTML
python -m pytest tests/ --html=reports/report.html --self-contained-html

# Ejecutar un archivo de test específico
python -m pytest tests/test_login.py --html=reports/report.html --self-contained-html

# Ejecutar tests por marker
python -m pytest -m login

# Ejecutar con salida detallada
python -m pytest tests/ -v --html=reports/report.html --self-contained-html

# Ejecutar desde la raíz del proyecto con Makefile
make test-selenium
```

## Reportes

Tras la ejecución, el reporte HTML se genera en `reports/report.html`. Es un archivo autocontenido que se puede abrir directamente en el navegador.

En caso de fallo, se capturan automáticamente:
- **Screenshots** del estado del navegador, guardados en `screenshots/` con el nombre del test como identificador
