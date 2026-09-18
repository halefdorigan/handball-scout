import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  access_token: string;
  user: { email: string; name?: string };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authKey = 'auth_token';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem(this.authKey, res.access_token);
        }),
      );
  }

  register(email: string, password: string, name: string): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/auth/register`, {
      email,
      password,
      name,
    });
  }

  logout(): void {
    localStorage.removeItem(this.authKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.authKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}
