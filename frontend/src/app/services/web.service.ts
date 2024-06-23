import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  readonly ROOT_URL: String;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  get(url: String): Observable<any> {
    return this.http.get(`${this.ROOT_URL}/${url}`);
  }

  post(url: String, payload: any): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/${url}`, payload);
  }

  patch(url: String, payload: any): Observable<any> {
    return this.http.patch(`${this.ROOT_URL}/${url}`, payload);
  }

  delete(url: String): Observable<any> {
    return this.http.delete(`${this.ROOT_URL}/${url}`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.ROOT_URL}/users/login`,
      { email, password },
      { observe: 'response' }
    );
  }

  signup(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.ROOT_URL}/users`,
      { email, password },
      { observe: 'response' }
    );
  }
}
