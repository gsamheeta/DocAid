import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  userName;
  registerURL = '/api/register';
  loginURL = '/api/login';
  url = '/api/user';
  appointmentUrl = '/api/appointment';
  updateAppointmentUrl = '/api/updateAppointment';
  profileUrl = '/api/profile/';
  user;

  constructor() {
  }

  forgotPassword(userEmail) {
    return fetch(this.loginURL + '/forgot', {
      method: 'post',
      body: JSON.stringify(userEmail),
      headers: {
        'content-type': 'application/json',
      }
    })
      .then(function (response) {
        return response.json();
      });
  }

  fetchAppointments(id) {
    return fetch(this.appointmentUrl + '/' + id, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'GET'
    })
      .then(response => {
        console.log(response);
        return response.json();
      });
  }

  fetchDocAppointments(uid) {
    return fetch(this.appointmentUrl + '/doctor/' + uid, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'GET'
    })
      .then(response => {
        console.log(response);
        return response.json();
      });
  }

  updateAppointment(data) {
    return fetch(this.updateAppointmentUrl, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(data)
    })
      .then(response => response.json());
  }

  fetchPatientInfo(id) {
    return fetch(this.profileUrl + '/' + id, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json());
  }

  registerUser(user, role) {
    if (role === 'doctor') {
      this.user = {
        username: user.regUsername,
        password: user.regPassword,
        role: role,
        uid: user.doctorUID
      };
    } else {
      this.user = {
        username: user.regUsername,
        password: user.regPassword,
        role: role
      };
    }


    return fetch(this.registerURL, {
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(this.user),
      credentials: 'include'
    })
      .then(response => response.json());
  }

  login(user) {
    return fetch(this.loginURL, {
      method: 'post',
      credentials : 'include',
      body: JSON.stringify({username: user.username, password: user.password}),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(function (response) {
        return response.json();
      });
  }

  setUserName() {
    return fetch('https://still-beyond-49650.herokuapp.com/api/getUserId', {
      method: 'GET',
      credentials: 'include'
    })
      .then(data => {
        if (data.headers.get('content-type') !== null) {
          return data.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        this.userName = data.userName;
      });
  }

  logout() {
    return fetch(this.url + '/logout', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(function (response) {
        return response;
      });
  }
}
