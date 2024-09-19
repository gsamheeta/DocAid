import {Component, OnInit, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AppointmentService} from '../services/appointment.service';
import {ProfileService} from '../services/profile.service';
import {LoginService} from '../services/login.service';

declare var $: any;

export interface DialogData {
  doctorName: string;
  requested: number;
  doctorUID: string;
  appointmentName: string;
}


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  doctorId = '';
  docProfileInfo;

  profile = {
    username: ''
  };
  userId;
  uid;
  userRole;
  patientsList = [];

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private appointmentService: AppointmentService,
              private router: Router, private loginService: LoginService,
              private profileService: ProfileService) {
  }

  ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('id');
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.findProfileById();
    this.findPatientsOfDoctor(this.doctorId);
    return fetch
    ('/2016-03-01/doctors/' + this.doctorId + '?user_key=737c87ec63ac3e77604e2fd4524f1308')
      .then(response => response.json())
      .then(results => {
        this.docProfileInfo = results.data;
        console.log(this.docProfileInfo);
      });
  }

  findPatientsOfDoctor(doctorId) {
    this.appointmentService.fetchPatients(doctorId)
      .then(response => {
        console.log(response);
        this.patientsList = response;
      });
  }

  createAppointment(val): void {
    const editDialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '400px',
      data: {
        doctorName: val.profile.first_name + ' ' + val.profile.last_name,
        requested: '',
        appointmentName: ''
      }
    });

    editDialogRef.afterClosed().subscribe(result => {
      console.log('Edit dialog was closed');
      if (result !== undefined) {
        console.log(result);

        this.appointmentService.createAppointment(result, this.doctorId, this.userId)
          .then(response => {
            console.log(response);
            this.success(response);
            this.findPatientsOfDoctor(this.doctorId);
          });
      }

    });
  }

  logout() {
    this.loginService.logout()
      .then(this.postLogout.bind(this));
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

  login() {
    this.router.navigate(['/login']);
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

  findProfileById() {
    if (this.userId !== 'null') {
      this.profileService.findProfileById(this.userId)
        .then((response) => {
          this.renderUser(response);
        });
    }

  }

  renderUser(user) {
    console.log(user);
    this.userId = user.id;
    this.userRole = user.role;
    this.uid = user.uid;
    this.profile.username = user.username;
  }


  success(response) {
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
  selector: 'app-appointment-dialog-component',
  templateUrl: 'appointment-dialog-component.html',
  styleUrls: ['./data.component.css']
})
export class AppointmentDialogComponent {

  minDate = new Date();
  maxDate = new Date(2020, 0, 1);

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  onNoClick(): void {
    this.dialogRef.close();
  }


}
