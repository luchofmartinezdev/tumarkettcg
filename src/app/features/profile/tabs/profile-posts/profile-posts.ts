import { Component } from '@angular/core';
import { MyPostsComponent } from '../../../my-posts/my-posts';

@Component({
  selector: 'app-profile-posts',
  standalone: true,
  imports: [MyPostsComponent],
  template: `<app-my-posts />`
})
export class ProfilePostsComponent {}