import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

export interface RSS {
  url: string;
  articles: Array<{
    link: string;
    image: string;
    published: Date, 
    title: string;
    description: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class RssService {

  private SERVER_URL = 'http://0.0.0.0:5000';

  public items: {[key:number]: RSS} = {};

  constructor(private http: HttpClient, private auth: AuthService) { }

  public get(){
    return this.http.get(this.SERVER_URL + '/api/feeds', {responseType:'json'});
  }

  public post(rss: RSS) {
    this.http.post(this.SERVER_URL + '/api/feeds', rss)
    .subscribe((res: any) => {
      if (res.success) {

      }
    })
  }

}
