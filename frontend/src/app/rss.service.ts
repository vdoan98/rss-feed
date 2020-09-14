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

  private SERVER_URL = 'http://localhost:5000/';


  public feeds: [
    {
      'link' : "//rss.cnn.com/~r/rss/cnn_world/~3/jzCEqVDbR6Y/index.html",
      'image': '',
      'published': "Tue, 18 Aug 2020 11:16:35 GMT",
      'title': 'The street style youth of West Africa',
      'description': 'Streetwear has always been about more than just clothing. Over the last three decades it has become a global phenomenon, influenced by a DIY, no-holds-barred attitude expressed through fashion, music, art, dance and skateboarding.'
    },
    {
      'link': 'http://rss.cnn.com/~r/rss/cnn_world/~3/HdIbLfFJnSw/index.html',
      'image': '',
      'published': "Fri, 10 Apr 2020 08:25:16 GMT",
      'title': 'The TV drama that rewrote the rulebook 30 years ago -- and hasn\'t met its match yet',
      'description': 'Before Netflix, before sagas like "Game of Thrones" -- before high-speed internet -- there was "Twin Peaks."'
    },
    {
      'link': 'http://rss.cnn.com/~r/rss/cnn_world/~3/ISS_Wb16eJ4/index.html',
      'image': '',
      'published': "Thu, 10 Sep 2020 11:16:48 GMT",
      'title': 'Actor Cameron Boyce\'s parents turn his private battle with epilepsy into a quest for a cure',
      'description': 'When 20-year-old Cameron Boyce died suddenly after suffering an epileptic seizure in July 2019, fans around the world mourned the loss of a gifted actor whose career was just getting started. Few people knew that behind the scenes, he was privately battling epilepsy.'
    },
    {
      'link': 'https://www.bbc.co.uk/news/uk-england-derbyshire-53741531',
      'image': '',
      'published': "Tue, 11 Aug 2020 23:01:56 GMT",
      'title': '\'Lidl voice\' checkout assistant performs opera to customers',
      'description': 'Lily Taylor-Ward was chosen to perform for Captain Sir Tom Moore on his 100th birthday.'
    },
    {
      'link': 'https://www.bbc.co.uk/news/uk-england-hampshire-53662398',
      'image': '',
      'published': "Sat, 08 Aug 2020 23:27:29 GMT",
      'title': 'Coronavirus: Winchester teenager films lockdown documentary',
      'description': 'Teenager Octavia Sanger is releasing her first documentary on an international streaming service.'
    }
  ]

  public items: {[key:number]: RSS} = [
    {
      url: "http://rss.cnn.com/rss/cnn_world.rss",
      articles: [
        {
          link : "//rss.cnn.com/~r/rss/cnn_world/~3/jzCEqVDbR6Y/index.html",
          image: '',
          published: new Date("Tue, 18 Aug 2020 11:16:35 GMT"),
          title: 'The street style youth of West Africa',
          description: 'Streetwear has always been about more than just clothing. Over the last three decades it has become a global phenomenon, influenced by a DIY, no-holds-barred attitude expressed through fashion, music, art, dance and skateboarding.'
        },
        {
          link: 'http://rss.cnn.com/~r/rss/cnn_world/~3/HdIbLfFJnSw/index.html',
          image: '',
          published: new Date("Fri, 10 Apr 2020 08:25:16 GMT"),
          title: 'The TV drama that rewrote the rulebook 30 years ago -- and hasn\'t met its match yet',
          description: 'Before Netflix, before sagas like "Game of Thrones" -- before high-speed internet -- there was "Twin Peaks."'
        },
        {
          link: 'http://rss.cnn.com/~r/rss/cnn_world/~3/ISS_Wb16eJ4/index.html',
          image: '',
          published: new Date("Thu, 10 Sep 2020 11:16:48 GMT"),
          title: 'Actor Cameron Boyce\'s parents turn his private battle with epilepsy into a quest for a cure',
          description: 'When 20-year-old Cameron Boyce died suddenly after suffering an epileptic seizure in July 2019, fans around the world mourned the loss of a gifted actor whose career was just getting started. Few people knew that behind the scenes, he was privately battling epilepsy.'
        }
      ]
    },
    {
      url: 'http://feeds.bbci.co.uk/news/video_and_audio/entertainment_and_arts/rss.xml',
      articles: [
        {
          link: 'https://www.bbc.co.uk/news/uk-england-derbyshire-53741531',
          image: '',
          published: new Date("Tue, 11 Aug 2020 23:01:56 GMT"),
          title: '\'Lidl voice\' checkout assistant performs opera to customers',
          description: 'Lily Taylor-Ward was chosen to perform for Captain Sir Tom Moore on his 100th birthday.'
        },
        {
          link: 'https://www.bbc.co.uk/news/uk-england-hampshire-53662398',
          image: '',
          published: new Date("Sat, 08 Aug 2020 23:27:29 GMT"),
          title: 'Coronavirus: Winchester teenager films lockdown documentary',
          description: 'Teenager Octavia Sanger is releasing her first documentary on an international streaming service.'
        }
      ]
    }
  ]

  constructor(private http: HttpClient, private auth: AuthService) { }

  public get(){
  }

  public post(rss: RSS) {
  }

}
