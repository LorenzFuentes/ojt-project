// services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User, Admin, RegisterRequest } from '../models/post';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private adminApi = 'http://localhost:3000/admin';
  private userApi = 'http://localhost:3000/users'; 
  private usersKey = 'users_data'; 

  constructor(private http: HttpClient) {
    // Initialize with default data
    this.initializeDefaultData();
  }

  // LOGIN (for admin)
  login(username: string, password: string): Observable<boolean> {
    return this.http
      .get<User[]>(`${this.userApi}?username=${username}&password=${password}`)
      .pipe(map(user => user.length > 0));
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

  // --- USER REGISTRATION ---
  // Method 1: Register using json-server API
  register(registerData: RegisterRequest): Observable<User> {
    return this.http.post<User>(this.userApi, registerData);
  }

  // Method 2: Using localStorage (fallback/demo)
  registerLocal(registerData: RegisterRequest): Observable<User> {
    return new Observable(observer => {
      try {
        // Get existing users
        const existingData = localStorage.getItem(this.usersKey);
        let users: User[] = [];
        
        if (existingData) {
          users = JSON.parse(existingData);
        }
        
        // Generate new ID
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        // Create new user
        const newUser: User = {
          id: newId,
          ...registerData,
          middleName: registerData.middleName || ''
        };
        
        // Add to array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        
        // Also try to save to json-server
        this.register(registerData).subscribe({
          next: () => console.log('Also saved to json-server'),
          error: (err) => console.warn('Could not save to json-server:', err)
        });
        
        // Emit success
        observer.next(newUser);
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  // Check if username exists (check both API and localStorage)
  checkUsernameExists(username: string): Observable<boolean> {
    // First check localStorage
    const localData = localStorage.getItem(this.usersKey);
    if (localData) {
      const users: User[] = JSON.parse(localData);
      const localExists = users.some(user => user.username === username);
      if (localExists) {
        return of(true);
      }
    }
    
    // Then check API
    return this.http.get<User[]>(`${this.userApi}?username=${username}`)
      .pipe(
        map(users => users.length > 0)
      );
  }

  // Check if email exists
  checkEmailExists(email: string): Observable<boolean> {
    // First check localStorage
    const localData = localStorage.getItem(this.usersKey);
    if (localData) {
      const users: User[] = JSON.parse(localData);
      const localExists = users.some(user => user.email === email);
      if (localExists) {
        return of(true);
      }
    }
    
    // Then check API
    return this.http.get<User[]>(`${this.userApi}?email=${email}`)
      .pipe(
        map(users => users.length > 0)
      );
  }

  // Get all registered users
  getAllRegisteredUsers(): Observable<User[]> {
    // Try API first, fallback to localStorage
    return this.http.get<User[]>(this.userApi).pipe(
      map(users => {
        // Also save to localStorage for backup
        if (users.length > 0) {
          localStorage.setItem(this.usersKey, JSON.stringify(users));
        }
        return users;
      })
    );
  }

  // Export users as JSON
  exportUsers(): void {
    const existingData = localStorage.getItem(this.usersKey);
    if (existingData) {
      const users = JSON.parse(existingData);
      const dataStr = JSON.stringify({ users }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(dataBlob);
      downloadLink.download = 'users.json';
      downloadLink.click();
    }
  }

  // Initialize with default data
  private initializeDefaultData(): void {
    const existingData = localStorage.getItem(this.usersKey);
    if (!existingData) {
      const defaultUsers: User[] = [
        {
          id: 1,
          firstName: "lorenz",
          middleName: "caluag",
          lastName: "fuentes",
          contact: "09123456789",
          department: "CEU",
          position: "Student",
          username: "lorenz",
          email: "lorenzcfuentes@gmail.com",
          password: "admin123"
        }
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
    }
  }
}