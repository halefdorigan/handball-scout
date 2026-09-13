import { Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { GuestGuard } from './guest.guard';

describe('GuestGuard', () => {
  it('redirects authenticated users to the dashboard', () => {
    // Arrange
    const authService = { isAuthenticated: () => true } as AuthService;
    const dashboardTree = {} as UrlTree;
    const router = { createUrlTree: jasmine.createSpy().and.returnValue(dashboardTree) } as unknown as Router;
    const guard = new GuestGuard(authService, router);

    // Act
    const result = guard.canActivate({} as never, {} as never);

    // Assert
    expect(router.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toBe(dashboardTree);
  });
});
