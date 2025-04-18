import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINTS } from '../core/endpoints';
import { HttpClientService } from './HttpClientService.service';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor(private http: HttpClientService) {}

  subirImagen(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(ENDPOINTS.subirImagen, formData, undefined, {
      responseType: 'text' as 'json'
    });
  }

}
