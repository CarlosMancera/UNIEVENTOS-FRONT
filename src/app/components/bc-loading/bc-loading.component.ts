import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BcLoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bc-loading',
  standalone: true, // IMPORTANTE
  imports: [CommonModule],
  templateUrl: './bc-loading.component.html',
  styleUrls: ['./bc-loading.component.css']
})
export class BcLoadingComponent implements OnInit {

  @ViewChild('bc_loading', { read: ElementRef }) modalRef!: ElementRef;

  text: string = 'Cargando';
  showText: string = 'Cargando';
  count: number = 0;
  loading: any;
  subscription!: Subscription;

  constructor(
    private bcLoadingService: BcLoadingService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.bcLoadingService.loading.subscribe({
      next: data => {
        if (data.action === 'show') {
          this.show(data.text);
        } else {
          this.close();
        }
      }
    });
  }

  show(text: string): void {
    this.text = text;
    this.showText = this.text;
    setTimeout(() => {
      this.modalRef.nativeElement.style.display = 'block';
    });
  }

  close(): void {
    this.modalRef.nativeElement.style.display = 'none';
    clearInterval(this.loading);
  }

  loadingText(): void {
    this.count = (this.count === 3) ? 0 : this.count + 1;
    this.showText = `${this.text}${'.'.repeat(this.count)}`;
  }

  ngAfterViewChecked(): void {
    this.loadingText();
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.subscription && typeof this.subscription.unsubscribe === 'function') {
      this.subscription.unsubscribe();
    }
  }

}
