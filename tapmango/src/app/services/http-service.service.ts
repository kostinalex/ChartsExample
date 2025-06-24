import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  constructor(private http: HttpClient) {}

  getData(start: string, end: string) {
    return this.http.get(environment.api + `/getdata/${start}/${end}`);
  }
}
