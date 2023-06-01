import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {BoardService} from '../app/services/board.service';
import {User} from '../app/user.model';
import {environment} from '../environments/environment';
import {Board} from '../app/board.model';
import {Rol} from '../app/rol.model';

describe('BoardService', () => {
  let service: BoardService;
  let httpMock: HttpTestingController;
  const BASE_URL = environment.apiEndpoint + "/board/";
  let mockUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BoardService]
    });

    mockUser = { username: 'testuser1', name:'test' };
    localStorage.setItem('currentUser',JSON.stringify(mockUser))
    service = TestBed.inject(BoardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve boards', () => {
    const mockResponse: Board[] = [
      { id: 1, name: 'Board 1',photo:'' },
      { id: 2, name: 'Board 2',photo:'' }
    ];

    service.getBoards().subscribe(boards => {
      expect(boards).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_URL}username=${mockUser.username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a board', () => {
    mockUser = { username: 'testuser1', name:'test' };
    localStorage.setItem('currentUser',JSON.stringify(mockUser))
    const mockBoard: Board = { id: 1, name: 'Board 1', photo:'' };
    const expectedUrl = `${BASE_URL}newBoard/username=${mockUser.username}`;

    service.createBoard(mockBoard).subscribe(board => {
      expect(board).toEqual(mockBoard);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockBoard);
    req.flush(mockBoard);
  });

  it('should delete a board', () => {
    const mockBoardId = 1;
    const expectedUrl = `${BASE_URL}id=${mockBoardId}`;

    service.delete(mockBoardId).subscribe(result => {
      expect(result).toBeTrue();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  it('should copy a board', () => {
    const mockBoardId = 1;
    const expectedUrl = `${BASE_URL}copyBoard/boardId=${mockBoardId}`;
    const mockResponse: Board = { id: 2, name: 'Board 2',photo:'' };

    service.copy(mockBoardId).subscribe(board => {
      expect(board).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update a board', () => {
    const mockBoard: Board = { id: 1, name: 'Board 1',photo:'' };
    const expectedUrl = `${BASE_URL}updateBoard/${mockBoard.id}`;

    service.updateBoard(mockBoard).subscribe(board => {
      expect(board).toEqual(mockBoard);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockBoard);
    req.flush(mockBoard);
  });

  it('should update WIP', () => {
    const mockBoard: Board = { id: 1, name: 'Board 1',photo:'' };
    const mockWipActivated = true;
    const mockWipLimit = 5;
    const mockWipList = 'WIP List';
    const expectedUrl = `${BASE_URL}id=${mockBoard.id}/wipActivated=${mockWipActivated}&wipLimit=${mockWipLimit}&wipList=${mockWipList}`;

    service.updateWip(mockBoard, mockWipActivated, mockWipLimit, mockWipList).subscribe(board => {
      expect(board).toEqual(mockBoard);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockBoard);
    req.flush(mockBoard);
  });

  it('should add a user to a board', () => {
    const mockBoard: Board = { id: 1, name: 'Board 1',photo:'' };
    const mockRol: Rol = Rol.ADMIN;
    const expectedUrl = `${BASE_URL}id=${mockBoard.id}/username=${mockUser.username}&rol${mockRol}`;

    service.addUserToBoard(mockBoard, mockRol, mockUser.username!!).subscribe(board => {
      expect(board).toEqual(mockBoard);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockBoard);
    req.flush(mockBoard);
  });

  it('should update a user role in a board', () => {
    const mockBoard: Board = { id: 1, name: 'Board 1',photo:'' };
    const mockUserId = 123;
    const mockRole: Rol = Rol.USER;
    const expectedUrl = `${BASE_URL}id=${mockBoard.id}/userId=${mockUserId}&role=${mockRole}`;

    service.updateRol(mockBoard, mockUserId, mockRole).subscribe(board => {
      expect(board).toEqual(mockBoard);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockBoard);
    req.flush(mockBoard);
  });

  it('should delete a user from a board', () => {
    const mockBoard: Board = { id: 1, name: 'Board 1',photo:'' };
    const mockUserId = 123;
    const expectedUrl = `${BASE_URL}id=${mockBoard.id}/userId=${mockUserId}`;

    service.deleteUserFromBoard(mockBoard, mockUserId).subscribe(board => {
      expect(board).toEqual(mockBoard);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockBoard);
  });

  it('should update time settings for a board', () => {
    const mockBoard: Board = { id: 1, name: 'Board 1',photo:'' };
    const mockTimeActivated = true;
    const mockCycleStart = '2023-05-01';
    const mockCycleEnd = '2023-05-31';
    const mockLeadStart = '2023-05-05';
    const mockLeadEnd = '2023-05-25';
    const expectedUrl = `${BASE_URL}id=${mockBoard.id}/timeActivated=${mockTimeActivated}&cycleStart=${mockCycleStart}&cycleEnd=${mockCycleEnd}&leadStart=${mockLeadStart}&leadEnd=${mockLeadEnd}`;

    service.updateTime(mockBoard, mockTimeActivated, mockCycleStart, mockCycleEnd, mockLeadStart, mockLeadEnd).subscribe(board => {
      expect(board).toEqual(mockBoard);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockBoard);
    req.flush(mockBoard);
  });

});
