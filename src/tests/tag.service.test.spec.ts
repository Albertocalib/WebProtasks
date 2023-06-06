import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TagService } from '../app/services/tag.service';
import { Tag } from '../app/tag.model';
import { environment } from '../environments/environment';

describe('TagService', () => {
  let service: TagService;
  let httpMock: HttpTestingController;
  const BASE_URL = environment.apiEndpoint + "/tag/";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TagService]
    });
    service = TestBed.inject(TagService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete a tag', () => {
    const mockTagId = 1;
    const mockTaskId = 1;
    const expectedUrl = `${BASE_URL}id=${mockTagId}/task=${mockTaskId}`;

    service.delete(mockTagId, mockTaskId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);
  });

  it('should get tags in a board', () => {
    const mockBoardId = 1;
    const expectedUrl = `${BASE_URL}board_id=${mockBoardId}`;
    const mockTags: Tag[] = [{ id: 1, name: 'Tag 1' }, { id: 2, name: 'Tag 2' }];

    service.getTagsInBoard(mockBoardId).subscribe(response => {
      expect(response).toEqual(mockTags);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTags);
  });

  it('should add a tag to a task', () => {
    const mockTagId = 1;
    const mockTaskId = 1;
    const expectedUrl = `${BASE_URL}id=${mockTaskId}/tag=${mockTagId}`;

    service.addTagToTask(mockTagId, mockTaskId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('should create a tag', () => {
    const mockTag: Tag = { id: 1, name: 'New Tag' };
    const mockBoardId = 1;
    const expectedUrl = `${BASE_URL}newTag/boardId=${mockBoardId}`;

    service.create(mockTag, mockBoardId).subscribe(response => {
      expect(response).toEqual(mockTag);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockTag);
  });

});
