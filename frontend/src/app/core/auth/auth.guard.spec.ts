import { Router, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  it('redirects anonymous users to login with the requested URL', () => {
    // Arrange
    const authService = { isAuthenticated: () => false } as AuthService;
    const loginTree = {} as UrlTree;
    const router = { createUrlTree: jasmine.createSpy().and.returnValue(loginTree) } as unknown as Router;
    const guard = new AuthGuard(authService, router);

    // Act
    const result = guard.canActivate({} as never, { url: '/teams/42?tab=players' } as never);

    // Assert
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/teams/42?tab=players' }
    });
    expect(result).toBe(loginTree);
  });
});
