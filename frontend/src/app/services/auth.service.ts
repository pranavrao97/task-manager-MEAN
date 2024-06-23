import { Injectable } from '@angular/core';
import { WebService } from './web.service';
import { Observable, shareReplay, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private webService: WebService,
    private router: Router,
    private http: HttpClient
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res) => {
        const userId = res.body._id;
        const accessToken = res.headers.get('x-access-token');
        const refreshToken = res.headers.get('x-refresh-token');
        this.setSession(userId, accessToken, refreshToken);
      })
    );
  }

  signup(email: string, password: string): Observable<any> {
    return this.webService.signup(email, password).pipe(
      shareReplay(),
      tap((res) => {
        const userId = res.body._id;
        const accessToken = res.headers.get('x-access-token');
        const refreshToken = res.headers.get('x-refresh-token');
        this.setSession(userId, accessToken, refreshToken);
      })
    );
  }

  logout() {
    this.removeSession();

    this.router.navigate(['/login']);
  }

  getUserId(): string {
    return localStorage.getItem('user-id') || '';
  }

  getAccessToken(): string {
    return localStorage.getItem('access-token') || '';
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem('access-token', accessToken);
  }

  getRefreshToken(): string {
    return localStorage.getItem('refresh-token') || '';
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refresh-token', refreshToken);
  }

  private setSession(
    userId: string,
    accessToken: string,
    refreshToken: string
  ) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  getNewAccessToken() {
    return this.http
      .get(`${this.webService.ROOT_URL}/users/me/accessToken`, {
        headers: {
          'x-refresh-token': this.getRefreshToken(),
          _id: this.getUserId(),
        },
        observe: 'response',
      })
      .pipe(
        tap((res: HttpResponse<any>) => {
          this.setAccessToken(res.headers.get('x-access-token') || '');
        })
      );
  }
}
