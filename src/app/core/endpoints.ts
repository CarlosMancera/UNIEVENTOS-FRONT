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

  // === NUEVO ENDPOINT PARA ARTISTAS ===
  crearArtista: new Endpoint(URL_BASE, 'api/administrador/crear-artista', true),
  listarArtistas: new Endpoint(URL_BASE, 'api/administrador/listar-artista', true),
  editarArtista: new Endpoint(URL_BASE, 'api/administrador/editar-artista', true),
  eliminarArtista: new Endpoint(URL_BASE, 'api/administrador/eliminar-artista/{id}', true),
  crearEvento: new Endpoint(URL_BASE, 'api/administrador/crear-evento', true),
  agregarImagenEvento: new Endpoint(URL_BASE,'api/administrador/agregar-imagen/{idEvento}',true),
  agregarImagenLocalidad: new Endpoint(URL_BASE, 'api/administrador/agregar-imagen-localidad/{idEvento}/{nombreLocalidad}',true
  ),



};
