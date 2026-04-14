import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_token';
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.AUTH_KEY);
    if (token) {
      this.currentUserSubject.next({ token });
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/auth/login', { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.AUTH_KEY, res.access_token);
        this.currentUserSubject.next(res);
      })
    );
  }

  register(email: string, password: string, name: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/auth/register', { email, password, name });
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.AUTH_KEY);
  }
}
