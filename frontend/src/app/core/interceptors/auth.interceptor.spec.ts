import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../auth/auth.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let http: HttpClient;
  let httpController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
    localStorage.clear();
  });

  it('adds the Bearer token when a session exists', () => {
    // Arrange
    TestBed.inject(AuthService);
    localStorage.setItem('auth_token', 'signed-token');

    // Act
    http.get('/protected').subscribe();
    const request = httpController.expectOne('/protected');

    // Assert
    expect(request.request.headers.get('Authorization')).toBe(
      'Bearer signed-token',
    );
    request.flush({});
  });

  it('leaves requests public when no session exists', () => {
    // Arrange

    // Act
    http.post('/auth/login', {}).subscribe();
    const request = httpController.expectOne('/auth/login');

    // Assert
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });
});
