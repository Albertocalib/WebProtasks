import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import { of } from 'rxjs';
import { Tag } from '../app/tag.model';
import { File } from '../app/file.model';
import { Task } from '../app/task.model';
import { TagService } from '../app/services/tag.service';
import { TaskService } from '../app/services/task.service';
import { TaskCardComponent } from '../app/taskCard/taskCard.component';
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let tagService: TagService;
  let taskService: TaskService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskCardComponent],
      imports:[MatMenuModule,MatCardModule,MatChipsModule,MatIconModule],
      providers: [
        { provide: TagService, useValue: { delete: jasmine.createSpy('delete').and.returnValue(of(true)) } },
        { provide: TaskService, useValue: { removeAssigment: jasmine.createSpy('removeAssigment').and.returnValue(of(true)) } },
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    tagService = TestBed.inject(TagService);
    taskService = TestBed.inject(TaskService);
    dialog = TestBed.inject(MatDialog);

    // Mock task data
    component.task = {
      id: 1,
      title: 'Test Task',
      tag_ids: [],
      attachments: [],
      users: []
    } as Task;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.title).toBe('Test Task');
    expect(component.tags).toEqual([]);
    expect(component.image).toBe('');
    expect(component.attachments).toEqual([]);
    expect(component.removable).toBe(true);
    expect(component.users).toEqual([]);
  });

  it('should set component properties based on task data', () => {
    const attachments: File[] = [
      { id: 1, name: 'image.jpg', type: 'jpg', content: 'base64-encoded-image' } as File
    ];
    const tags: Tag[] = [{ id: 1, name: 'Tag 1' } as Tag];
    const users = [{ id: 1, name: 'User 1' }];
    component.task = {
      id: 1,
      title: 'Test Task',
      tag_ids: tags,
      attachments: attachments,
      users: users
    } as Task;

    component.ngOnInit();

    expect(component.title).toBe('Test Task');
    expect(component.tags).toEqual(tags);
    expect(component.image).toBe('data:image/png;base64,base64-encoded-image');
    expect(component.attachments).toEqual(attachments);
    expect(component.users).toEqual(users);
  });

  it('should remove tag', () => {
    const tag: Tag = { id: 1, name: 'Tag 1' } as Tag;
    component.tags = [tag];

    component.removeTag(tag);

    expect(tagService.delete).toHaveBeenCalledWith(tag.id!!, component.task?.id!!);
    expect(component.tags).toEqual([]);
  });

  it('should remove user', () => {
    const user = { id: 1, name: 'User 1' };
    component.users = [user];

    component.removeUser(user);

    expect(taskService.removeAssigment).toHaveBeenCalledWith(user.id, component.task?.id!!);
    expect(component.users).toEqual([]);
  });
});
