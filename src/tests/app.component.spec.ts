import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { AppComponent } from '../app/app.component';
import {LoginService} from "../app/services/logIn.service";
import {Router} from "@angular/router";
import {ProfilePhotoDialogComponent} from "../app/ProfilePhotoDialog/profile.photo.dialog.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {LogInComponent} from "../app/logIn/logIn.component";
import {SharedService} from "../app/shared.service";
import {Board} from "../app/board.model";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockSidenav:jasmine.SpyObj<MatSidenav>;
  let mockSharedService: jasmine.SpyObj<SharedService>;

  beforeEach(async () => {
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoginService = jasmine.createSpyObj('LoginService', ['logOut']);
    mockSharedService = jasmine.createSpyObj('SharedService', [
      'notifyOpenStats',
      'notifyButtonClickChangeView',
      'resetObservers',
    ]);
    mockSidenav = jasmine.createSpyObj('MatSidenav', ['close']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'logIn', component: LogInComponent }
        ]),
        MatSidenavModule,BrowserAnimationsModule,MatListModule,MatToolbarModule],
      providers: [
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: LoginService, useValue: mockLoginService},
        { provide: SharedService, useValue: mockSharedService },
        { provide: MatSidenav, useValue: mockSidenav},

      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.loginService =mockLoginService
    component.router = mockRouter;
    component.sidenav = mockSidenav;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    expect(component.title).toBe('WebProtasks');
  });

  it('should initialize with settingsOpened set to false', () => {
    expect(component.settingsOpened).toBe(false);
  });

  it('should initialize without any boards', () => {
    expect(component.boards).toBeUndefined();
  });

  it('should initialize without a selected board', () => {
    expect(component.board).toBeUndefined();
  });

  it('should log out and navigate to login page', () => {
    component.logOut();
    expect(component.boards).toBeUndefined();
    expect(mockLoginService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/logIn']);
  });
  it('should open profile photo dialog', () => {
    component.openProfilePic();

    expect(mockMatDialog.open).toHaveBeenCalledWith(ProfilePhotoDialogComponent, {
      width: '80vw',
      height: '75vh',
    });
  });

  it('should call sharedService.notifyOpenStats with true when openStats is called', () => {
    component.openStats();
    expect(mockSharedService.notifyOpenStats).toHaveBeenCalledWith(true);
  });

  it('should call sharedService.notifyButtonClickChangeView with the provided mode when changeVIewMode is called', () => {
    const mode = 'list';
    component.changeVIewMode(mode);
    expect(mockSharedService.notifyButtonClickChangeView).toHaveBeenCalledWith(mode);
  });

  it('should set board to undefined and navigate to "/" when goToHome is called', () => {
    component.goToHome();
    expect(component.board).toBeUndefined();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set settingsOpened to false, set the board, reset observers, and navigate to the board when openBoard is called with a board', () => {
    const board: Board = { id: 1, name: 'Board 1',photo:'' };
    component.openBoard(board);
    expect(component.settingsOpened).toBe(false);
    expect(component.board).toBe(board);
    expect(mockSharedService.resetObservers).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/board/' + board.id]);
  });

  it('should set settingsOpened to true and navigate to the board settings when openSettings is called', () => {
    const board: Board = { id: 1, name: 'Board 1',photo:'' };
    component.board = board;
    component.openSettings();
    expect(component.settingsOpened).toBe(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/board/${board.id}/settings`]);
  });

});

