import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private textSubject = new BehaviorSubject<string>('Cargando...');

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  get loadingText$(): Observable<string> {
    return this.textSubject.asObservable();
  }

  show(text: string = 'Cargando...') {
    this.textSubject.next(text);
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}
