import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';


import { environment } from 'src/environments/environment';

export interface RSS {
  id: number;
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

  private SERVER_URL = 'http://localhost:5000';
  userprofile: any;

  public items: {[key:number]: RSS} = {

  }
  public itemsNoCategory: Array<RSS> = []
  public urlList: Array<string> = []

  constructor(private http: HttpClient, private auth: AuthService) { }

  public get(){
    this.auth.userProfile$.subscribe(val => this.userprofile = val)
    this.http.post(this.SERVER_URL + '/api/feeds', this.userprofile).
    subscribe((res: any) => {
      this.itemsNoCategory = []
      this.items = {}
      this.feedsToItems(res['feeds'])
    })
  }

  public getUrl(){
    this.auth.userProfile$.subscribe(val => this.userprofile = val)
    let data = {}
    data["email"] = this.userprofile["email"]
    this.http.post(this.SERVER_URL + '/api/urls', data).
    subscribe((res: any) => {
      this.urlList = []
      this.urlsToItems(res['urls'])
    })
  }
  

  public post(url: string) {
    this.auth.userProfile$.subscribe(val => this.userprofile = val)
    let data = {}
    data["email"] = this.userprofile["email"]
    data["url"] = url
    this.http.post(this.SERVER_URL + '/api/feeds/add', data).
    subscribe((res: any) => {
      this.itemsNoCategory = []
      this.get()
    })
  }


  public delete(url_id: string){
    this.http.delete(this.SERVER_URL + '/api/feeds/' + url_id).
    subscribe((res: any) => {
      this.itemsNoCategory = []
      this.items = {}
      this.itemsNoCategory = []
      this.get()
      this.getUrl()
    })
  }

  feedsToItems( feed : Array<RSS>) {
    for (let key of Object.keys(feed)){
      this.items[key] = feed[key]
      for (let item of feed[key]){
        this.itemsNoCategory.push(item)
      }
    }
    this.sortByDate()
  }

  urlsToItems( urls: Array<string>){
    for (let url of urls){
      this.urlList.push(url)
    }
  }

  sortByDate(reverse:boolean = false){
    if (reverse == true){
      this.itemsNoCategory.sort((a, b) => (a['published'] < b['published']) ? 1: -1);
    } else {
      this.itemsNoCategory.sort((a, b) => (a['published'] > b['published']) ? 1: -1);
    }
  }

  sortByTitle(reverse:boolean = false){
    if (reverse == true){
      this.itemsNoCategory.sort((a, b) => (a['title'] < b['title']) ? 1 : -1);
    } else {
      this.itemsNoCategory.sort((a, b) => (a['title'] > b['title']) ? 1 : -1);
    }
  }

  sortByDescription(reverse:boolean = false){
    if (reverse == true){
      this.itemsNoCategory.sort((a, b) => (a['description'] < b['description']) ? 1: -1)
    } else {
      this.itemsNoCategory.sort((a, b) => (a['description'] > b['description']) ? 1: -1)
    }
  }

}
