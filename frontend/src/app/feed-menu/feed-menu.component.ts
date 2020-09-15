import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { RssService, RSS } from 'src/app/rss.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../auth.service';
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-feed-menu',
  templateUrl: './feed-menu.component.html',
  styleUrls: ['./feed-menu.component.scss']
})
export class FeedMenuComponent implements OnInit, OnDestroy {
  @Input() rss: RSS;

  url: string = "";
  opened: boolean;
  mobileQuery: MediaQueryList;
  userprofile: any;
  titleSort: boolean = false;
  dateSort: boolean = false;
  descriptionSort: boolean = false;
  selectedUrls: string[];
  appropriateClass: string = '';


  @HostListener('window:resize', ['$event'])
  getScreenHeight (event?) {
    if (window.innerHeight<=412){
      this.appropriateClass = 'bottomRelative';
    }else{
      this.appropriateClass = 'bottomStick';
    }
  }


  private _mobileQueryListener:() => void;

  constructor(
    public rssService: RssService,
    public auth: AuthService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.getScreenHeight()
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  feeds: any;

  ngOnInit(): void {
    this.rssService.get()
    this.rssService.getUrl()
    this.auth.userProfile$.subscribe(val => this.userprofile = val)
    console.log(this.rssService.urlList)
  }


  addFeedUrl(){
    this.rssService.post(this.url)
  }

  deleteFeedUrl(){
    for (let url of this.selectedUrls){
      this.rssService.delete(url);
    }
  }

  sortTitle(value){
    this.titleSort = value
    this.rssService.sortByTitle(this.titleSort)
  }

  sortDate(value){
    this.dateSort = value
    this.rssService.sortByDate(this.dateSort)
  }

  sortDescription(value){
    this.descriptionSort = value
    this.rssService.sortByDescription(this.descriptionSort)
  }

}
