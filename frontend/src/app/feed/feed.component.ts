import { Component, OnInit, Input } from '@angular/core';
// import { RSS, RssService } from 'src/app/rss.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  // @Input() rss: RSS;

  links: string[] = []
 
  constructor(
    // private RssService: RssService
  ) { }

  ngOnInit(): void {
  }


}
