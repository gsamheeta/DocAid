import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  allUsersURL = '/api/user';
  adminURL = '/api/admin';
  appointmentURL = '/api/appointment';

  constructor() {
  }

  fetchAllUsers() {
    return fetch(this.allUsersURL, {
      method: 'get'
    })
      .then(function (response) {
        return response.json();
      });
  }

  updatePatientProfile(userId, user) {
    return fetch(this.adminURL + '/updateProfile/' + userId, {
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

  deleteUser(userId) {
    return fetch(this.allUsersURL + '/' + userId, {
      method: 'delete'
    })
      .then(function (response) {
        return response;
      });
  }

  deleteAppointment(aid) {
    return fetch(this.appointmentURL + '/' + aid, {
      method: 'delete'
    })
      .then(function (response) {
        return response;
      });
  }

  createAppointment(data) {
    return fetch(this.adminURL + '/appointment', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(function (response) {
        return response.json();
      });
  }
}
