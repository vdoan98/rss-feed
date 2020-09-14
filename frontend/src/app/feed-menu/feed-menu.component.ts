import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RssService, RSS } from 'src/app/rss.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-feed-menu',
  templateUrl: './feed-menu.component.html',
  styleUrls: ['./feed-menu.component.scss']
})
export class FeedMenuComponent implements OnInit {
  @Input() rss: RSS;

  url: string = "";
  opened: boolean;
  mobileQuery: MediaQueryList;
  userprofile: any;

  private _mobileQueryListener:() => void;

  constructor(
    public rssService: RssService,
    public auth: AuthService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  feeds: any;

  ngOnInit(): void {
    this.rssService.get()
    this.auth.userProfile$.subscribe(val => this.userprofile = val)
    //console.log(this.rssService.itemsNoCategory)
  }

  addFeedUrl(){
    console.log(this.url)
    this.rssService.post(this.url)
  }

}
