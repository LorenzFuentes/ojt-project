import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { AdminComponent } from './components/adminTable/adminTable';
import { Register } from './pages/register/register'
export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard }, 
  { path: 'post', component: AdminComponent},
  { path: 'register', component: Register}
];