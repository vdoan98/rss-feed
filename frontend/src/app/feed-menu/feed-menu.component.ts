import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RssService, RSS } from 'src/app/rss.service';

@Component({
  selector: 'app-feed-menu',
  templateUrl: './feed-menu.component.html',
  styleUrls: ['./feed-menu.component.scss']
})
export class FeedMenuComponent implements OnInit {
  @Input() rss: RSS;

  link: string = "";
  feeds = [];
  events: string[] = [];
  opened: boolean;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  constructor(
    private rssService: RssService
  ) { }

  ngOnInit(): void {
    this.rssService.get().subscribe((data: any[]) => {
      console.log(data);
      this.feeds = data;
    })
  }
  
  addFeedUrl(){
    this.rssService.get()
  }

}
