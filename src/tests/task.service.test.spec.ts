import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TaskService} from '../app/services/task.service';
import {Task} from '../app/task.model';
import {Priority} from '../app/priority.model';
import {File} from '../app/file.model';
import {environment} from '../environments/environment';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const BASE_URL = environment.apiEndpoint + "/task/";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update position', () => {
    const mockId = 1;
    const mockPosition = 2;
    const mockNewTaskListId = 3;
    const expectedUrl = `${BASE_URL}id=${mockId}&newPosition=${mockPosition}&newTaskList=${mockNewTaskListId}`;

    service.updatePosition(mockId, mockPosition, mockNewTaskListId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(true);
  });

  it('should create a task', () => {
    const mockTask: Task = { id: 1, title: 'New Task' };
    const mockListId = 1;
    const expectedUrl = `${BASE_URL}newTask/listId=${mockListId}`;

    service.createTask(mockTask, mockListId).subscribe(response => {
      expect(response).toEqual(mockTask);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockTask);
  });

  it('should delete a task', () => {
    const mockTaskId = 1;
    const expectedUrl = `${BASE_URL}id=${mockTaskId}`;

    service.delete(mockTaskId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  it('should copy a task', () => {
    const mockTaskId = 1;
    const mockListId = 2;
    const expectedUrl = `${BASE_URL}id=${mockTaskId}&taskListId=${mockListId}`;

    service.copy(mockTaskId, mockListId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should move a task', () => {
    const mockTaskId = 1;
    const mockListId = 2;
    const expectedUrl = `${BASE_URL}id=${mockTaskId}&taskListId=${mockListId}`;

    service.move(mockTaskId, mockListId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(true);
  });

  it('should remove assignment', () => {
    const mockUserId = 1;
    const mockTaskId = 2;
    const expectedUrl = `${BASE_URL}id=${mockTaskId}/user=${mockUserId}`;

    service.removeAssigment(mockUserId, mockTaskId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  it('should add assignment', () => {
    const mockTaskId = 1;
    const mockUserId = 2;
    const expectedUrl = `${BASE_URL}id=${mockTaskId}/user=${mockUserId}`;

    service.addAssigment(mockTaskId, mockUserId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should update priority', () => {
    const mockTaskId = 1;
    const mockPriority: Priority = Priority.HIGH;
    const expectedUrl = `${BASE_URL}id=${mockTaskId}&newPriority=${mockPriority}`;

    service.updatePriority(mockTaskId, mockPriority).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(true);
  });

  it('should update end date', () => {
    const mockTaskId = 1;
    const mockNewDate = new Date();
    const expectedUrl = `${BASE_URL}id=${mockTaskId}&newDateEnd=${mockNewDate}`;

    service.updateDateEnd(mockTaskId, mockNewDate).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(true);
  });

  it('should update description', () => {
    const mockTaskId = 1;
    const mockNewDescription = 'New Description';
    const expectedUrl = `${BASE_URL}id=${mockTaskId}&newDescription=${mockNewDescription}`;

    service.updateDescription(mockTaskId, mockNewDescription).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(true);
  });

  it('should update title', () => {
    const mockTaskId = 1;
    const mockNewTitle = 'New Title';
    const expectedUrl = `${BASE_URL}id=${mockTaskId}&newTitle=${mockNewTitle}`;

    service.updateTitle(mockTaskId, mockNewTitle).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    req.flush(true);
  });

  it('should delete a subtask', () => {
    const mockSubtaskId = 1;
    const expectedUrl = `${BASE_URL}ids=${mockSubtaskId}`;

    service.deleteSubTask(mockSubtaskId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  it('should create a subtask', () => {
    const mockSubtask: Task = { id: 1, title: 'New Subtask' };
    const mockTaskId = 1;
    const expectedUrl = `${BASE_URL}newSubTask/task=${mockTaskId}`;

    service.createSubtask(mockSubtask, mockTaskId).subscribe(response => {
      expect(response).toEqual(mockSubtask);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockSubtask);
  });

  it('should add attachments', () => {
    const mockTaskId = 1;
    const mockAttachments: Set<File> = new Set<File>();
    const expectedUrl = `${BASE_URL}newAttachments/task=${mockTaskId}`;
    const expectedBody = Array.from(mockAttachments);

    service.addAttachments(mockTaskId, mockAttachments).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(expectedBody);
    req.flush(true);
  });
});
