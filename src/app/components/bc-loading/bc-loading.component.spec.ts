import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcLoadingComponent } from './bc-loading.component';

describe('BcLoadingComponent', () => {
  let component: BcLoadingComponent;
  let fixture: ComponentFixture<BcLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BcLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BcLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
