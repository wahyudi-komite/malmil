import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Global interceptor that adds `withCredentials: true` to every outgoing HTTP request.
 * This ensures HttpOnly authentication cookies are sent to the Nest backend on each call.
 */
@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const withCredentialsReq = req.clone({ withCredentials: true });
    return next.handle(withCredentialsReq);
  }
}
