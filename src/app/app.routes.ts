import { Routes } from '@angular/router';

import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AdminComponent} from './components/admin/admin.component';
import { EventoAdminComponent } from './components/admin/evento-admin/evento-admin.component';
import { DatoAdminComponent } from './components/admin/dato-admin/dato-admin.component';
import { CuponAdminComponent } from './components/admin/cupon-admin/cupon-admin.component';
import { CrearCuponComponent } from './components/admin/crear-cupon/crear-cupon.component';
import { UserComponent } from './components/user/user.component';
import { PerfilUsuarioComponent } from './components/user/perfil-usuario/perfil-usuario.component';
import { ListaDeseosComponent } from './components/user/lista-deseos/lista-deseos.component';
import { HistorialComprasComponent } from './components/user/historial-compras/historial-compras.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { ComprasComponent } from './components/compras/compras.component';
import { QuienesSomosComponent } from './quienes-somos/quienes-somos.component';
import { ConntactenosComponent } from './conntactenos/conntactenos.component';
import { ActualizarPasswordComponent } from './actualizar-password/actualizar-password.component';
import { EquipoAdminComponent } from './pages/admin/equipo-admin/equipo-admin.component';
import { MatchAdminComponent } from './components/admin/match-admin/match-admin.component';
import { MatchCrearComponent } from './components/admin/match-crear/match-crear.component';
import { PartidosComponent } from './components/partidos/partidos/partidos.component';
import { CompraBoletaComponent } from './pages/compra-boleta.component';


import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'partidos', component: PartidosComponent },
  { path: 'compras/:id', component: CompraBoletaComponent },
  { path: 'quienes-somos', component: QuienesSomosComponent },
  { path: 'contactenos', component: ConntactenosComponent },
  { path: 'actualizar-password', component: ActualizarPasswordComponent },

  { path: 'compras', component: ComprasComponent, canActivate: [AuthGuard] },

  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'user' },
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'perfil', component: PerfilUsuarioComponent },
      { path: 'lista-deseos', component: ListaDeseosComponent },
      { path: 'historial', component: HistorialComprasComponent },
    ]
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'admin' },
    children: [
      { path: '', redirectTo: 'datos', pathMatch: 'full' },
      { path: 'datos', component: DatoAdminComponent },
      { path: 'evento-admin', component: EventoAdminComponent },
      { path: 'crear-cupon', component: CrearCuponComponent },
      { path: 'cupon-admin', component: CuponAdminComponent },
      { path: 'equipo-admin', component: EquipoAdminComponent },
      { path: 'partido-admin', component: MatchAdminComponent },
      { path: 'crear-partido', component: MatchCrearComponent },
      { path: 'editar-partido/:id', component: MatchCrearComponent },
    ]
  },

  { path: "**", pathMatch: "full", redirectTo: "" }
];
