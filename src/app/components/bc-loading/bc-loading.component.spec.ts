import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BcLoadingComponent } from './bc-loading.component';
import { BcLoadingService } from '../../services/loading.service';
import { of } from 'rxjs';

// ✅ Mock del servicio
class MockBcLoadingService {
  loading = of({ action: 'show', text: 'Cargando...' });
}

describe('BcLoadingComponent', () => {
  let component: BcLoadingComponent;
  let fixture: ComponentFixture<BcLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BcLoadingComponent],
      providers: [
        { provide: BcLoadingService, useClass: MockBcLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BcLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
