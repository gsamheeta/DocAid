import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileURL = '/api/profile';

  constructor() {
  }

  findProfileById(userId) {
    return fetch(this.profileURL + '/' + userId, {
      method: 'get'
    })
      .then(function (response) {
        if (response.status === 500) {
          return null;
        } else {
          return response.json();
        }
      });
  }

  updateProfile(user, userId) {
    return fetch(this.profileURL + '/' + userId, {
      method: 'put',
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(function (response) {
        return response.json();
      });
  }
}
