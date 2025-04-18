import { environment } from '../../environments/environment';

const URL_AUTH = environment.urlAuth;
const URL_AUTH_AUX = environment.urlAuthAux;
const URL_BASE = environment.urlBase;

export class Endpoint {
  constructor(
    public baseUrl: string,
    public path: string,
    public authenticated: boolean = true
  ) {}
}

export const ENDPOINTS = {
  // === URL_AUTH ===
  iniciarSesion: new Endpoint(URL_AUTH, 'iniciar-sesion', false),

  // === URL_AUTH_AUX ===
  crearCuenta: new Endpoint(URL_AUTH_AUX, 'crear-cuenta', false),
  recuperarPassword: new Endpoint(URL_AUTH_AUX, 'recuperar-password', false),
  recuperaInfoCuenta: new Endpoint(URL_AUTH_AUX, 'obtener-info-cuenta/{id}', false),
  editarCuenta: new Endpoint(URL_AUTH_AUX, 'editar-perfil', true),
  eliminarCuenta: new Endpoint(URL_AUTH_AUX, 'eliminar-cuenta/{id}', true),

  crearEquipo: new Endpoint(URL_BASE, 'equipos', true),
  obtenerEquipo: new Endpoint(URL_BASE, 'equipos/{id}', true),
  actualizarEquipo: new Endpoint(URL_BASE, 'equipos/{id}', true),
  eliminarEquipo: new Endpoint(URL_BASE, 'equipos/{id}', true),
  listarEquipos: new Endpoint(URL_BASE, 'equipos', true),
  subirImagen: new Endpoint(URL_BASE, 'imagenes', true),


};
