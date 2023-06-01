import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from '../app/services/logIn.service';
import { User } from '../app/user.model';
import { environment } from '../environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  const BASE_URL = environment.apiEndpoint + "/user/";
  let mockUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });

    mockUser = { username: 'testuser1', name:'test1',email:'test1@example.com' };
    localStorage.setItem('currentUser',JSON.stringify(mockUser))
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in a user', () => {
    const mockUser = { username: 'testuser', password: 'password',name:'test' };
    const expectedUrl = BASE_URL + 'logIn';
    const mockResponseUser: User = { username: 'testuser', email: 'testuser@example.com', name:'test' };

    service.logIn(mockUser.username, mockUser.password).subscribe(response => {
      expect(response).toEqual(mockResponseUser);
      expect(service.isLogged).toBeTruthy();
      expect(service.user).toEqual(mockResponseUser);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponseUser);
  });

  it('should log out a user', () => {
    service.logOut();
    expect(service.isLogged).toBeFalsy();
    expect(service.user).toBeUndefined();
  });

  it('should set current user', () => {
    const mockUser = { username: 'testuser', password: 'password',name:'test' };

    service.setCurrentUser(mockUser);

    expect(service.isLogged).toBeTruthy();
    expect(service.user).toEqual(mockUser);
    expect(localStorage.getItem('currentUser')).toEqual(JSON.stringify(mockUser));
  });

  it('should remove current user', () => {
    localStorage.setItem('currentUser', JSON.stringify({ username: 'testuser', email: 'testuser@example.com' }));

    service.removeCurrentUser();

    expect(service.isLogged).toBeFalsy();
    expect(service.user).toBeUndefined();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should register a user', () => {
    const mockUser = { username: 'testuser', password: 'password',name:'test' };
    const expectedUrl = BASE_URL + 'register/newUser';

    service.register(mockUser).subscribe(response => {
      expect(response).toEqual(mockUser);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should update photo of user', () => {
    const mockPhoto = 'testphoto';
    mockUser = { username: 'testuser1', name:'test1',email:'test1@example.com',photo:'testphoto' };
    localStorage.setItem('currentUser',JSON.stringify(mockUser))
    const expectedUrl = `${BASE_URL}updatePhoto/${service.user?.username}`;

    service.updatePhoto(mockPhoto).subscribe(response => {
      expect(response).toEqual(service.user!!);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(service.user!!);
  });

  it('should get users in board', () => {
    const mockBoardId = 1;
    const expectedUrl = `${BASE_URL}board_id=${mockBoardId}`;
    const mockUsers: User[] = [{ username: 'user1', email: 'user1@example.com',name:'user1' }, { username: 'user2', email: 'user2@example.com',name:'user2' }];

    service.getUsersInBoard(mockBoardId).subscribe(response => {
      expect(response).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should get all users', () => {
    const expectedUrl = `${BASE_URL}users`;
    const mockUsers: User[] = [{ username: 'user1', email: 'user1@example.com',name:'user1' }, { username: 'user2', email: 'user2@example.com',name:'user2' }];

    service.getAllUsers().subscribe(response => {
      expect(response).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

});
