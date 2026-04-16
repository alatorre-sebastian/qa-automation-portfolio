// Configuración compartida para los scripts de k6
// Exporta la URL base de la API y credenciales de prueba

export const API_URL = __ENV.API_URL || 'http://localhost:3001';
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Credenciales de prueba (usuario pre-seeded en la AUT)
export const TEST_USER = {
  username: 'Katharina_Bernier',
  password: 's3cret',
};
