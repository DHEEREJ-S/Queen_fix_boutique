import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LehengaComponent } from './lehenga.component';

describe('LehengaComponent', () => {
  let component: LehengaComponent;
  let fixture: ComponentFixture<LehengaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LehengaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LehengaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
