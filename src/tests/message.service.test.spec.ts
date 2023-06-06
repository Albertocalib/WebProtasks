import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessageService } from '../app/services/message.service';
import { Message } from '../app/message.model';
import { environment } from '../environments/environment';
import {Task} from "../app/task.model";

describe('MessageService', () => {
  let service: MessageService;
  let httpMock: HttpTestingController;
  const BASE_URL = environment.apiEndpoint + "/message/";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessageService]
    });
    service = TestBed.inject(MessageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a message', () => {
    const mockUser = { username: 'testuser1', password: 'password',name:'test' };
    const mockMessage: Message = { id: 1, body: 'Test message',user:mockUser,task:{} as Task };
    const expectedUrl = BASE_URL + 'newMessage/';

    service.create(mockMessage).subscribe(response => {
      expect(response).toEqual(mockMessage);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockMessage);
  });

});
