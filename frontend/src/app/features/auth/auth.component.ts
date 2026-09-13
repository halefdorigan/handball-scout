import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isRegister = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  returnUrl: string | null = null;

  readonly authForm = this.formBuilder.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirmation: ['']
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isRegister = this.router.url.startsWith('/register');
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (this.isRegister) {
      this.authForm.controls.name.setValidators([Validators.required, Validators.minLength(2)]);
      this.authForm.controls.passwordConfirmation.setValidators([Validators.required]);
    }

    if (this.route.snapshot.queryParamMap.get('registered') === '1') {
      this.successMessage = 'Conta criada. Entre para abrir seu workspace.';
    }
  }

  submit(): void {
    this.errorMessage = '';

    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const { name, email, password, passwordConfirmation } = this.authForm.getRawValue();

    if (this.isRegister && password !== passwordConfirmation) {
      this.errorMessage = 'As senhas precisam ser iguais.';
      return;
    }

    this.isSubmitting = true;
    const request$ = this.isRegister
      ? this.authService.register(email!, password!, name!)
      : this.authService.login(email!, password!);

    request$
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          if (this.isRegister) {
            this.router.navigate(['/login'], {
              queryParams: {
                registered: 1,
                ...(this.isSafeReturnUrl(this.returnUrl) ? { returnUrl: this.returnUrl } : {})
              }
            });
          } else {
            this.router.navigateByUrl(this.isSafeReturnUrl(this.returnUrl) ? this.returnUrl : '/dashboard');
          }
        },
        error: () => {
          this.errorMessage = this.isRegister
            ? 'Não foi possível criar sua conta. Tente novamente.'
            : 'E-mail ou senha incorretos.';
        }
      });
  }

  private isSafeReturnUrl(returnUrl: string | null): returnUrl is string {
    return Boolean(returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//'));
  }
}
