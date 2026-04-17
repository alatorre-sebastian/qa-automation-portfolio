import http from 'k6/http';
import { check, sleep } from 'k6';
import { API_URL, TEST_USER } from '../helpers/config.js';

/**
 * Prueba de carga (Load Test)
 *
 * Simula un escenario de carga normal con ramp-up a 20 usuarios virtuales,
 * estado estable durante 3 minutos y ramp-down gradual.
 *
 * Endpoints ejercitados:
 *   - POST /login          (autenticación)
 *   - GET  /transactions/public (listado público de transacciones)
 *   - GET  /users           (listado de usuarios)
 *   - GET  /notifications   (notificaciones del usuario)
 */

export const options = {
  stages: [
    { duration: '1m', target: 20 },  // ramp-up a 20 VUs
    { duration: '3m', target: 20 },  // estado estable
    { duration: '1m', target: 0 },   // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% de las peticiones < 2s (CI runners son más lentos)
    http_req_failed: ['rate<0.05'],    // tasa de errores < 5%
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
    'login: tiene cookie de sesión': (r) =>
      r.headers['Set-Cookie'] !== undefined && r.headers['Set-Cookie'] !== '',
  });

  // Retornar el jar de cookies para peticiones autenticadas
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

  sleep(1);

  // 3. Obtener listado de usuarios
  const usersRes = http.get(`${API_URL}/users`, {
    jar,
  });
  check(usersRes, {
    'usuarios: status 200': (r) => r.status === 200,
  });

  sleep(1);

  // 4. Obtener notificaciones
  const notifRes = http.get(`${API_URL}/notifications`, {
    jar,
  });
  check(notifRes, {
    'notificaciones: status 200': (r) => r.status === 200,
  });

  sleep(1);
}
