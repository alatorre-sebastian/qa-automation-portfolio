import http from 'k6/http';
import { check, sleep } from 'k6';
import { API_URL, TEST_USER } from '../helpers/config.js';

/**
 * Prueba de pico (Spike Test)
 *
 * Simula un salto repentino de 0 a 100 usuarios virtuales para evaluar
 * cómo la aplicación maneja picos de tráfico inesperados.
 * Mantiene la carga durante 1 minuto y luego baja a 0.
 *
 * Endpoints ejercitados:
 *   - POST /login                (autenticación)
 *   - GET  /transactions/public  (listado público de transacciones)
 *   - GET  /users                (listado de usuarios)
 *   - GET  /notifications        (notificaciones del usuario)
 *   - GET  /contacts             (contactos del usuario)
 */

export const options = {
  stages: [
    { duration: '10s', target: 100 },  // salto repentino a 100 VUs
    { duration: '1m', target: 100 },   // mantener 100 VUs durante 1 minuto
    { duration: '10s', target: 0 },    // bajar a 0 VUs
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% de las peticiones < 3s
    http_req_failed: ['rate<0.15'],    // tasa de errores < 15%
  },
};

/**
 * Función auxiliar que inicia sesión y devuelve las cookies de sesión.
 */
function login() {
  const loginPayload = JSON.stringify({
    username: TEST_USER.username,
    password: TEST_USER.password,
    type: 'LOGIN',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const loginRes = http.post(`${API_URL}/login`, loginPayload, params);

  check(loginRes, {
    'login: status 200': (r) => r.status === 200,
  });

  return http.cookieJar();
}

export default function () {
  // 1. Autenticarse
  const jar = login();

  // 2. Obtener transacciones públicas
  const txPublicRes = http.get(`${API_URL}/transactions/public`, {
    jar,
  });
  check(txPublicRes, {
    'transacciones públicas: status 200': (r) => r.status === 200,
  });

  sleep(0.3);

  // 3. Obtener listado de usuarios
  const usersRes = http.get(`${API_URL}/users`, {
    jar,
  });
  check(usersRes, {
    'usuarios: status 200': (r) => r.status === 200,
  });

  sleep(0.3);

  // 4. Obtener notificaciones
  const notifRes = http.get(`${API_URL}/notifications`, {
    jar,
  });
  check(notifRes, {
    'notificaciones: status 200': (r) => r.status === 200,
  });

  sleep(0.3);

  // 5. Obtener contactos
  const contactsRes = http.get(`${API_URL}/contacts`, {
    jar,
  });
  check(contactsRes, {
    'contactos: status 200': (r) => r.status === 200,
  });

  sleep(0.3);
}
