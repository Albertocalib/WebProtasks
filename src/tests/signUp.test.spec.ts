import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {of, throwError} from 'rxjs';
import { LoginService } from '../app/services/logIn.service';
import { User } from '../app/user.model';
import { SignUpComponent } from '../app/SignUp/signUp.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import Spy = jasmine.Spy;

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let loginService: LoginService;
  let router: Router;
  let snackBar: MatSnackBar;
  let registerSpy: Spy
  let loginSpy: Spy

  beforeEach(async () => {
    registerSpy = jasmine.createSpy('register')
    loginSpy = jasmine.createSpy('login')
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [MatFormFieldModule,MatInputModule,MatDialogModule,FormsModule,MatIconModule],
      providers: [
        { provide: LoginService, useValue: { logIn: loginSpy, register:registerSpy}},
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.hide).toBe(true);
    expect(component.title).toBe('WebProtasks');
    expect(component.username).toBeUndefined();
    expect(component.email).toBeUndefined();
    expect(component.password).toBeUndefined();
    expect(component.passEqualsElement).toBeUndefined();
    expect(component.userRegister).toEqual({ name: '', surname: '', password: '', username: '', email: '' });
  });

  it('should call logInService.logIn and navigate on logIn', () => {
    const email = 'test@example.com';
    const password = 'password123';
    loginSpy.and.returnValue(of({}));
    component.logIn(null, email, password);
    expect(loginService.logIn).toHaveBeenCalledWith(email, password);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display snackbar on logIn error', () => {
    const error = 'Invalid credentials';
    spyOn(console, 'log');
    loginSpy.and.returnValue(throwError(error));
    component.logIn(null, 'invalid@example.com', 'invalid');
    expect(console.log).toHaveBeenCalledWith(error);
    expect(snackBar.open).toHaveBeenCalledWith('Usuario o Contraseña Incorrecto', 'Cerrar', {
      duration: 2000,
      verticalPosition: 'top'
    });
  });

  it('should call loginService.register, display snackbar, and navigate on signUp', () => {
    const user: User = { name: 'John', surname: 'Doe', password: 'password', username: 'johndoe', email: 'john@example.com' };
    spyOn(console, 'log');
    component.userRegister = user;
    registerSpy.and.returnValue(of({}))
    component.signUp();
    expect(loginService.register).toHaveBeenCalledWith(user);
    expect(snackBar.open).toHaveBeenCalledWith('Cuenta creada satisfactoriamente', 'Cerrar', {
      duration: 2000,
      verticalPosition: 'top'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/logIn']);
  });

  it('should log error on signUp error', () => {
    const error = 'Registration failed';
    registerSpy.and.returnValue(throwError(error))
    spyOn(console, 'log');
    component.signUp();
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
