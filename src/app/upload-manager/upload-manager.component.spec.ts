import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadManagerComponent } from './upload-manager.component';

describe('UploadManagerComponent', () => {
  let component: UploadManagerComponent;
  let fixture: ComponentFixture<UploadManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
