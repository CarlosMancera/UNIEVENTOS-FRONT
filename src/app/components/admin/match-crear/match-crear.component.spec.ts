import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchCrearComponent } from './match-crear.component';

describe('MatchCrearComponent', () => {
  let component: MatchCrearComponent;
  let fixture: ComponentFixture<MatchCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchCrearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
