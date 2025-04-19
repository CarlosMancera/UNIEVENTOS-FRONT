import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BcLoadingService {

  private subject = new Subject<any>();

  get loading(): Observable<any> {
    return this.subject.asObservable();
  }

  show(text: string = "Cargando...") {
    this.subject.next({ action: 'show', text });
  }

  close() {
    this.subject.next({ action: 'close' });
  }
}
