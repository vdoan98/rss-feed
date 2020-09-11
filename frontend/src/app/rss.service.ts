import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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

  private SERVER_URL = 'http://0.0.0.0:5000/';

  public items: {[key:number]: RSS} = {};

  constructor(private http: HttpClient) { }

  public get(){
    return this.http.get(this.SERVER_URL + '/feeds');
  }

  public post(rss: RSS) {
    this.http.post(this.SERVER_URL + '/feeds', rss)
    .subscribe((res: any) => {
      if (res.success) {

      }
    })
  }

}
