import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import {AddElementDialogComponent} from "../app/AddElementDialog/add.element.dialog.component";

@Component({
  template: ''
})
class MockMatDialogRef {
  close(): void {}
}

describe('AddElementDialogComponent', () => {
  let fixture: ComponentFixture<AddElementDialogComponent>;
  let component: AddElementDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddElementDialogComponent],
      providers: [
        { provide: MatDialogRef, useClass: MockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddElementDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form controls', () => {
    expect(component.display instanceof FormControl).toBe(true);
    expect(component.display.disabled).toBe(true);
    expect(component.display.validator).toEqual(Validators.required);

    expect(component.selectedColor).toBe('');
    expect(component.mode).toBe('');
    expect(component.areRequiredFieldsFilled).toBe(false);
  });

  it('should handle ngAfterViewInit when color is not null', () => {
    const mockSelectElement: Partial<MatSelect> = {
      value: 'color'
    };
    component.selectElement = mockSelectElement as MatSelect;

    component.data.color = 'blue';
    component.ngAfterViewInit();

    expect(component.selectedColor).toBe('blue');
    expect(component.mode).toBe('color');
    expect(component.selectElement.value).toBe('color');
  });

  it('should handle ngAfterViewInit when photo_name is not null', () => {
    const mockSelectElement: Partial<MatSelect> = {
      value: 'image'
    };
    component.selectElement = mockSelectElement as MatSelect;

    component.data.photo_name = 'image.jpg';
    component.ngAfterViewInit();

    expect(component.display.value).toBe('image.jpg');
    expect(component.mode).toBe('image');
    expect(component.selectElement.value).toBe('image');
  });

  it('should handle onNoClick', () => {
    spyOn(component.dialogRef, 'close');

    component.onNoClick();

    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });


  it('should handle onImgSelected when no file is selected', () => {

    component.onImgSelected(null);

    expect(component.display.value).toBe('');
    expect(component.data.photo_name).toBeUndefined();
  });



  it('should handle selectMode', () => {
    const mode = 'image';

    component.selectMode(mode);

    expect(component.mode).toBe(mode);
  });
});
