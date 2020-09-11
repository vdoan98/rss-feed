import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { environment } from 'src/environments/environment';

export interface RSS {
  url: string;
  articles: Array<{
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

  url = environment.apiServerUrl;

  public items: {[key:number]: RSS} = {};

  constructor(private http: HttpClient) { }

  public get(){
    return this.http.get(this.url + '/feed');
  }

  public post(rss: RSS) {
    this.http.post(this.url + '/feed', rss)
    .subscribe((res: any) => {
      if (res.success) {

      }
    })
  }

}
