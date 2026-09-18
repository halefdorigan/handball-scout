import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
    localStorage.clear();
  });

  it('stores the access token returned by login', () => {
    // Arrange
    const token = 'header.payload.signature';

    // Act
    service.login('athlete@example.com', 'secret').subscribe();
    const request = httpController.expectOne(`${environment.apiUrl}/auth/login`);
    request.flush({
      access_token: token,
      user: { email: 'athlete@example.com' },
    });

    // Assert
    expect(request.request.body).toEqual({
      email: 'athlete@example.com',
      password: 'secret',
    });
    expect(service.getToken()).toBe(token);
  });

  it('clears the local session on logout', () => {
    // Arrange
    localStorage.setItem('auth_token', 'header.payload.signature');

    // Act
    service.logout();

    // Assert
    expect(service.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
