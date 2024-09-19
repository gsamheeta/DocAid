import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileService} from '../services/profile.service';
import {LoginService} from '../services/login.service';
import {AppointmentDialogComponent, DialogData} from '../data/data.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

declare var $: any;

export interface NewDialogData {
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  data;
}

/*import * as $ from 'jquery';*/

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  profile = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  };

  appointmentList = [];
  docsAppointmentList = [];
  userId;
  userRole;
  uid;
  maxDate = new Date();

  /*  $: any;*/

  constructor(private profileService: ProfileService, private router: Router,
              private loginService: LoginService, public dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.findProfileById(this.userId);
    this.fetchAppointments();
  }

  goHome() {
    this.router.navigate(['/home', {userId: this.userId}]);
  }

  goProfile() {
    this.router.navigate(['/profile', {userId: this.userId}]);
  }

  goAdmin() {
    this.router.navigate(['/admin', {userId: this.userId}]);
  }


  findProfileById(userId) {
    this.profileService.findProfileById(userId)
      .then((response) => {
        this.renderUser(response);
      })
      .then(() => {
        if (this.userRole === 'doctor') {
          this.fetchDocAppointments();
        }
      });
  }

  fetchAppointments() {
    this.loginService.fetchAppointments(this.userId)
      .then(response => {
        console.log(response);
        this.appointmentList = response;
      });
  }

  fetchDocAppointments() {
    this.loginService.fetchDocAppointments(this.uid)
      .then(response => {
        console.log(response);
        this.docsAppointmentList = response;
      });
  }

  approve(data) {
    data.confirmation = 'true';
    console.log(data);
    this.loginService.updateAppointment(data)
      .then(response => {
        console.log(response);
        this.updateAppointmentSuccess(response);
      })
      .then(() => {
        this.fetchDocAppointments();
      });
  }

  reject(data) {
    data.confirmation = 'cancelled';
    console.log(data);
    this.loginService.updateAppointment(data)
      .then(response => {
        console.log(response);
        this.updateAppointmentSuccess(response);
      })
      .then(() => {
        this.fetchDocAppointments();
      });
  }


  saveProfile(profile) {
    const user = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      dateOfBirth: profile.dateOfBirth
    };
    this.profileService.updateProfile(user, this.userId)
      .then((response) => {
        this.success(response);
      })
      .then(() => {
        this.findProfileById(this.userId);
      });
  }

  success(response) {
    if (response == null) {
      $.toast({
        heading: 'Error',
        text: 'Error in updating data',
        position: 'top-right',
        hideAfter: 4000,
        icon: 'error'
      });
    } else {
      $.toast({
        heading: 'Success',
        text: 'Data updated successfully',
        position: 'top-right',
        hideAfter: 4000,
        icon: 'success'
      });
    }
  }


  updateAppointmentSuccess(response) {
    if (response == null) {
      $.toast({
        heading: 'Error',
        text: 'Error in updating appointment',
        position: 'top-right',
        hideAfter: 4000,
        icon: 'error'
      });
    } else {
      $.toast({
        heading: 'Success',
        text: 'Appointment updated successfully',
        position: 'top-right',
        hideAfter: 4000,
        icon: 'success'
      });
    }
  }

  logout() {
    this.loginService.logout()
      .then(this.postLogout.bind(this));
  }

  postLogout(data) {
    $.toast({
      heading: 'Success',
      text: 'Logged out successfully',
      position: 'top-right',
      hideAfter: 3000,
      icon: 'success'
    });
    this.router.navigate(['/login']);
  }

  renderUser(user) {
    console.log(user);
    this.userId = user.id;
    this.userRole = user.role;
    this.uid = user.uid;
    this.profile.username = user.username;
    this.profile.firstName = user.firstName;
    this.profile.lastName = user.lastName;
    this.profile.email = user.email;
    this.profile.phone = user.phone;
    this.profile.address = user.address;
    this.profile.dateOfBirth = user.dateOfBirth;
  }

  fetchPatientInfo(id) {
    this.loginService.fetchPatientInfo(id)
      .then(response => {
        console.log(response);
        this.viewPatientInfo(response);
      });
  }

  viewPatientInfo(val): void {
    const editDialogRef = this.dialog.open(UserInfoDialogComponent, {
      width: '400px',
      data: {
        name: val.firstName + ' ' + val.lastName,
        phone: val.phone,
        email: val.email,
        dateOfBirth: val.dateOfBirth,
        data: val.data
      }
    });
    editDialogRef.afterClosed().subscribe(result => {
      console.log('Patient Info dialog was closed');
      if (result !== undefined) {
        console.log(result);
      }
    });
  }

  appointmentSuccess(response) {
    if (response === null) {
      $.toast({
        heading: 'Error',
        text: 'Error in creating appointment',
        position: 'top-right',
        hideAfter: 4000,
        icon: 'error'
      });
    } else {
      $.toast({
        heading: 'Success',
        text: 'Appointment created successfully',
        position: 'top-right',
        hideAfter: 4000,
        icon: 'success'
      });
    }
  }

}


@Component({
  selector: 'app-user-info-dialog-component',
  templateUrl: 'userInfo-dialog-component.html',
  styleUrls: ['./profile.component.css']
})
export class UserInfoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UserInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewDialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
