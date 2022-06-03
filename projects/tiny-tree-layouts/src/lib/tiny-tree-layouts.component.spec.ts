import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyTreeLayoutsComponent } from './tiny-tree-layouts.component';

describe('TinyTreeLayoutsComponent', () => {
  let component: TinyTreeLayoutsComponent;
  let fixture: ComponentFixture<TinyTreeLayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TinyTreeLayoutsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TinyTreeLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
