import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogInComponent } from '../app/logIn/logIn.component';
import { LoginService } from '../app/services/logIn.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import {of, throwError} from "rxjs";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('LogInComponent', () => {
  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['logIn']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    await TestBed.configureTestingModule({
      declarations: [LogInComponent],
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatIconModule,
        RouterTestingModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log in successfully', () => {
    const email = 'test@example.com';
    const password = 'password';
    const mockUser = { id: 1, username: 'testuser', name: 'test' };

    mockLoginService.logIn.and.returnValue(of(mockUser));

    component.logIn(null, email, password);

    expect(mockLoginService.logIn).toHaveBeenCalledWith(email, password);
    expect(mockSnackBar.open).not.toHaveBeenCalled();
  });

  it('should handle login error', () => {
    const email = 'test@example.com';
    const password = 'password';
    const mockError = 'Invalid credentials';

    mockLoginService.logIn.and.returnValue(throwError(mockError));

    component.logIn(null, email, password);

    expect(mockLoginService.logIn).toHaveBeenCalledWith(email, password);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      'Invalid user or password',
      'Cerrar',
      { duration: 2000, verticalPosition: 'top' }
    );
  });
});
