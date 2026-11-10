
import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Pessoa } from './pessoa/pessoa';
import { Padrao } from './padrao/padrao';
import { NaoEncontrada } from './nao-encontrada/nao-encontrada';
import { CadastroEvento } from './cadastro-evento/cadastro-evento';
import { Empresa } from './empresa/empresa';
import { Participante } from './participante/participante';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },
  { path: 'pessoa', component: Pessoa },
  { path: 'padrao', component: Padrao },

  { path: 'eventos/novo', component: CadastroEvento },

  // Os participantes de UM evento: o :id e o id do evento.
  { path: 'eventos/:id/participantes', component: Participante },

  {
    path: 'cadastro-evento',
    redirectTo: 'eventos/novo',
    pathMatch: 'full'
  },

  { path: 'empresa', component: Empresa },

  // A rota curinga deve ficar por último.
  { path: '**', component: NaoEncontrada }
];
