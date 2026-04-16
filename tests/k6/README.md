# Suite de Pruebas de Rendimiento — k6

Suite de pruebas de rendimiento escrita en **k6** con **JavaScript** que evalúa el comportamiento de la API de la cypress-realworld-app bajo diferentes niveles de carga. Los scripts están organizados de forma modular con configuración compartida.

## Escenarios de Prueba

### Prueba de Carga (`scripts/load-test.js`)

Simula un escenario de carga normal para validar que la API responde dentro de los umbrales aceptables bajo uso típico.

| Fase | Duración | Usuarios Virtuales | Descripción |
|---|---|---|---|
| Ramp-up | 1 min | 0 → 20 | Incremento gradual de usuarios |
| Estado estable | 3 min | 20 | Carga sostenida |
| Ramp-down | 1 min | 20 → 0 | Reducción gradual |

**Endpoints ejercitados:**
- `POST /login` — Autenticación
- `GET /transactions/public` — Listado público de transacciones
- `GET /users` — Listado de usuarios
- `GET /notifications` — Notificaciones del usuario

### Prueba de Estrés (`scripts/stress-test.js`)

Incrementa gradualmente la cantidad de usuarios virtuales para identificar los límites de rendimiento de la AUT.

| Fase | Duración | Usuarios Virtuales | Descripción |
|---|---|---|---|
| Ramp-up nivel 1 | 1 min | 0 → 10 | Carga inicial |
| Estable nivel 1 | 2 min | 10 | Línea base |
| Ramp-up nivel 2 | 1 min | 10 → 50 | Escalar a carga media |
| Estable nivel 2 | 2 min | 50 | Carga media sostenida |
| Ramp-up nivel 3 | 1 min | 50 → 100 | Escalar a carga alta |
| Estable nivel 3 | 2 min | 100 | Carga alta sostenida |
| Ramp-up nivel 4 | 1 min | 100 → 200 | Escalar a carga extrema |
| Estable nivel 4 | 2 min | 200 | Carga extrema sostenida |
| Ramp-down | 2 min | 200 → 0 | Reducción gradual |

**Endpoints ejercitados:**
- `POST /login` — Autenticación
- `GET /transactions/public` — Listado público de transacciones
- `GET /users` — Listado de usuarios
- `GET /notifications` — Notificaciones del usuario
- `GET /contacts` — Contactos del usuario

## Umbrales de Rendimiento (Thresholds)

### Prueba de Carga

| Métrica | Umbral | Descripción |
|---|---|---|
| `http_req_duration` | p(95) < 500ms | El 95% de las peticiones deben responder en menos de 500ms |
| `http_req_failed` | rate < 0.05 | La tasa de errores debe ser menor al 5% |

### Prueba de Estrés

| Métrica | Umbral | Descripción |
|---|---|---|
| `http_req_duration` | p(95) < 1000ms | El 95% de las peticiones deben responder en menos de 1s (más permisivo bajo estrés) |
| `http_req_failed` | rate < 0.10 | La tasa de errores debe ser menor al 10% |

Si algún umbral no se cumple, k6 retorna un código de salida no-cero, lo que permite integración directa con pipelines de CI/CD.

## Configuración

El archivo `helpers/config.js` exporta la configuración compartida:

- **`API_URL`** — URL base de la API (por defecto `http://localhost:3001`, configurable vía variable de entorno `API_URL`)
- **`BASE_URL`** — URL base del frontend (por defecto `http://localhost:3000`, configurable vía variable de entorno `BASE_URL`)
- **`TEST_USER`** — Credenciales del usuario de prueba pre-cargado en la AUT

## Estructura del Directorio

```
tests/k6/
├── README.md
├── scripts/
│   ├── load-test.js      # Escenario de prueba de carga
│   └── stress-test.js    # Escenario de prueba de estrés
└── helpers/
    └── config.js         # Configuración compartida (URLs, credenciales)
```

## Requisitos Previos

k6 debe estar instalado en el sistema. Consulta la [documentación oficial de instalación de k6](https://grafana.com/docs/k6/latest/set-up/install-k6/).

**Instalación rápida:**

```bash
# macOS (Homebrew)
brew install k6

# Linux (Debian/Ubuntu)
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D68
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# Windows (Chocolatey)
choco install k6
```

## Ejecución

```bash
# Ejecutar prueba de carga
k6 run scripts/load-test.js

# Ejecutar prueba de estrés
k6 run scripts/stress-test.js

# Ejecutar con exportación de resumen a JSON
k6 run scripts/load-test.js --summary-export=reports/summary.json

# Ejecutar con URL de API personalizada
API_URL=http://mi-servidor:3001 k6 run scripts/load-test.js

# Ejecutar desde la raíz del proyecto con Makefile
make test-k6
```

## Reportes

k6 muestra un resumen de métricas en la consola al finalizar la ejecución, incluyendo:

- **Tiempos de respuesta**: media, mediana, p(90), p(95), máximo
- **Throughput**: peticiones por segundo
- **Tasa de errores**: porcentaje de peticiones fallidas
- **Checks**: porcentaje de validaciones exitosas
- **Estado de umbrales**: pass/fail para cada threshold definido

Para exportar el resumen a un archivo JSON:

```bash
k6 run scripts/load-test.js --summary-export=reports/summary.json
```
