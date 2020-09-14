import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  token: string = this.auth.activeJWT()

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    console.log(this.token)
  }

}
