import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  EMPTY,
  Observable,
  catchError,
  empty,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebInterceptor implements HttpInterceptor {
  refreshingAccessToken!: boolean;

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = this.addAuthHeader(req);

    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401 && !this.refreshingAccessToken) {
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              req = this.addAuthHeader(req);
              return next.handle(req);
            }),
            catchError((err) => {
              console.log(err);
              this.authService.logout();
              return EMPTY;
            })
          );
        }
        return throwError(() => new Error('error occured'));
      })
    );
  }

  refreshAccessToken() {
    this.refreshingAccessToken = true;
    return this.authService.getNewAccessToken().pipe(
      tap((res) => {
        this.refreshingAccessToken = false;
        console.log('access toen refreshed');
      })
    );
  }

  addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getAccessToken();

    if (token) {
      return req.clone({
        setHeaders: {
          'x-access-token': token,
        },
      });
    }

    return req;
  }
}
