import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPostANdActivityComponent } from './my-post-and-activity.component';

describe('MyPostANdActivityComponent', () => {
  let component: MyPostANdActivityComponent;
  let fixture: ComponentFixture<MyPostANdActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyPostANdActivityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyPostANdActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
