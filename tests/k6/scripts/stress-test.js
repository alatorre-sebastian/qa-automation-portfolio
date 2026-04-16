import http from 'k6/http';
import { check, sleep } from 'k6';
import { API_URL, TEST_USER } from '../helpers/config.js';

/**
 * Prueba de estrés (Stress Test)
 *
 * Incrementa gradualmente la cantidad de usuarios virtuales
 * (10 → 50 → 100 → 200) para identificar los límites de la AUT.
 * Cada nivel se mantiene durante 2 minutos antes de escalar al siguiente.
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
    { duration: '1m', target: 10 },   // ramp-up a 10 VUs
    { duration: '2m', target: 10 },   // estable a 10 VUs
    { duration: '1m', target: 50 },   // escalar a 50 VUs
    { duration: '2m', target: 50 },   // estable a 50 VUs
    { duration: '1m', target: 100 },  // escalar a 100 VUs
    { duration: '2m', target: 100 },  // estable a 100 VUs
    { duration: '1m', target: 200 },  // escalar a 200 VUs
    { duration: '2m', target: 200 },  // estable a 200 VUs
    { duration: '2m', target: 0 },    // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% de las peticiones < 1s (más permisivo bajo estrés)
    http_req_failed: ['rate<0.10'],    // tasa de errores < 10%
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

  sleep(0.5);

  // 3. Obtener listado de usuarios
  const usersRes = http.get(`${API_URL}/users`, {
    jar,
  });
  check(usersRes, {
    'usuarios: status 200': (r) => r.status === 200,
  });

  sleep(0.5);

  // 4. Obtener notificaciones
  const notifRes = http.get(`${API_URL}/notifications`, {
    jar,
  });
  check(notifRes, {
    'notificaciones: status 200': (r) => r.status === 200,
  });

  sleep(0.5);

  // 5. Obtener contactos
  const contactsRes = http.get(`${API_URL}/contacts`, {
    jar,
  });
  check(contactsRes, {
    'contactos: status 200': (r) => r.status === 200,
  });

  sleep(0.5);
}
