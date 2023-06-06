import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskListService } from '../app/services/tasklist.service';
import { TaskList } from '../app/tasklist.model';
import {environment} from "../environments/environment";

describe('TaskListService', () => {
  let service: TaskListService;
  let httpMock: HttpTestingController;
  const BASE_URL = environment.apiEndpoint + "/list/";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskListService]
    });

    service = TestBed.inject(TaskListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get task lists', () => {
    const mockBoardId = '1';
    const mockTaskLists: TaskList[] = [
      { id: 1, title: 'List 1',tasks:[] },
      { id: 2, title: 'List 2',tasks:[] }
    ];

    const expectedUrl = `${BASE_URL}boardId=${mockBoardId}`;

    service.getTaskLists(mockBoardId).subscribe(response => {
      expect(response).toEqual(mockTaskLists);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTaskLists);
  });

  it('should update position', () => {
    const mockListId = 1;
    const mockPosition = 2;
    const mockResponse: TaskList = { id: 1, title: 'List 1', tasks:[] };

    const expectedUrl = `${BASE_URL}id=${mockListId}&position=${mockPosition}`;

    service.updatePosition(mockListId, mockPosition).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush({ tl: mockResponse });
  });

  it('should create a list', () => {
    const mockList: TaskList = { id: 1, title: 'New List', tasks:[] };
    const mockBoardId = 1;

    const expectedUrl = `${BASE_URL}newList/boardId=${mockBoardId}`;

    service.createList(mockList, mockBoardId).subscribe(response => {
      expect(response).toEqual(mockList);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockList);
  });

  it('should delete a list', () => {
    const mockListId = 1;

    const expectedUrl = `${BASE_URL}id=${mockListId}`;

    service.delete(mockListId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  it('should copy a list', () => {
    const mockListId = 1;
    const mockBoardDestId = 2;
    const mockResponse: TaskList = { id: 1, title: 'List 1',tasks:[] };

    const expectedUrl = `${BASE_URL}id=${mockListId}&boardDestId=${mockBoardDestId}`;

    service.copy(mockListId, mockBoardDestId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should move a list', () => {
    const mockListId = 1;
    const mockBoardDestId = 2;
    const mockResponse: TaskList = { id: 1, title: 'List 1', tasks:[] };

    const expectedUrl = `${BASE_URL}id=${mockListId}&boardDestId=${mockBoardDestId}`;

    service.move(mockListId, mockBoardDestId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });
});
