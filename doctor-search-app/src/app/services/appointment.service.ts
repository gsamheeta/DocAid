import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  appointmentUrl = '/api/appointment';
  newAppointment;

  constructor() {
  }

  createAppointment(appointment, docID, userId) {
    this.newAppointment = {
      doctorName: appointment.doctorName,
      doctorUID: docID,
      requested: appointment.requested,
      confirmation: 'false',
      comments: '',
      name: appointment.appointmentName
    };
    return fetch(this.appointmentUrl + '/' + userId, {
      method: 'post',
      body: JSON.stringify(this.newAppointment),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(function (response) {
        return response.json();
      });
  }

  fetchPatients(id) {
    return fetch(this.appointmentUrl + '/user/' + id, {
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


}
