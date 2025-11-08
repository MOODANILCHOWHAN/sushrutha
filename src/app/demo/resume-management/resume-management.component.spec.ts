import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeManagementComponent } from './resume-management.component';

describe('ResumeManagementComponent', () => {
  let component: ResumeManagementComponent;
  let fixture: ComponentFixture<ResumeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResumeManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResumeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
