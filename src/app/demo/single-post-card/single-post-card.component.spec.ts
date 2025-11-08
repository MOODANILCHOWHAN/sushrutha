import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePostCardComponent } from './single-post-card.component';

describe('SinglePostCardComponent', () => {
  let component: SinglePostCardComponent;
  let fixture: ComponentFixture<SinglePostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SinglePostCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SinglePostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
