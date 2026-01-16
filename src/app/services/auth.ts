// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User, Admin, RegisterRequest } from '../models/post';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private adminApi = 'http://localhost:3000/admin';
  private userApi = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // LOGIN - Check if user exists with matching username and password
  login(username: string, password: string): Observable<boolean> {
    return this.http
      .get<User[]>(`${this.userApi}?username=${username}&password=${password}`)
      .pipe(map(users => users.length > 0));
  }

  // --- USER REGISTRATION ---
  // Register new user to json-server API
  register(registerData: RegisterRequest): Observable<User> {
    return this.http.post<User>(this.userApi, registerData);
  }

  // Check if username already exists
  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.userApi}?username=${username}`)
      .pipe(map(users => users.length > 0));
  }

  // Check if email already exists
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.userApi}?email=${email}`)
      .pipe(map(users => users.length > 0));
  }

  // Get all registered users
  getAllRegisteredUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userApi);
  }
    // --- ADMIN USERS ---
  getAllUsers(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.adminApi);
  }

  getUserById(id: any): Observable<Admin> {
    return this.http.get<Admin>(`${this.adminApi}/${id}`);
  }

  createUser(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(this.adminApi, admin);
  }

  updateUser(id: any, admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.adminApi}/${id}`, admin);
  }

  deleteUser(id: any): Observable<void> {
    return this.http.delete<void>(`${this.adminApi}/${id}`);
  }
}