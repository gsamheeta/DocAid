import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProfileService} from '../services/profile.service';
import {LoginService} from '../services/login.service';
import {AdminService} from '../services/admin.service';
import {UploadService} from '../services/upload.service';
import {MatDialog} from '@angular/material';

declare var $: any;

export interface roleType {
  value: string;
  viewValue: string;
}

export interface docType {
  value: string;
  uid: string;
  viewValue: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  userId;
  userRole;
  uid;
  admin = {
    username: '',
  };

  newUser = {
    regUsername: '',
    regPassword: '',
    role: '',
    uid: ''
  };

  newApp = {
    doctorName: '',
    doctorUID: '',
    requested: '',
    confirmation: 'false',
    comments: '',
    name: '',
    userId: ''
  };


  panelOpenState = false;
  users = [];
  loading = false;
  maxDate = new Date();
  userForm;
  appointmentForm;

  roleList: roleType[] = [
    {value: 'user', viewValue: 'User'},
    {value: 'doctor', viewValue: 'Doctor'},
    {value: 'admin', viewValue: 'Admin'}
  ];
  docMap = new Map();
  minDate = new Date();
  maxappDate = new Date(2020, 0, 1);

  roleUserList: roleType[] = [];
  roleDoctorList: docType[] = [];


  constructor(private profileService: ProfileService, private router: Router,
              private loginService: LoginService, public dialog: MatDialog,
              private adminService: AdminService, private upload: UploadService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.findProfileById();
    this.fetchAllUsers();
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  openCreateUserFields() {
    this.userForm = true;
  }

  openCreateAppointmentFields() {
    this.appointmentForm = true;
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

  createUser(user) {
    this.loginService.registerUser(user, user.role)
      .then((response) => {
        this.registerSuccess(response[1]);
      })
      .then(() => {
        this.userForm = false;
        this.fetchAllUsers();
        this.newUser.regPassword = '';
        this.newUser.regUsername = '';
        this.newUser.role = '';
        this.newUser.uid = '';
      });
  }

  closeUser() {
    this.userForm = false;
    this.newUser.regPassword = '';
    this.newUser.regUsername = '';
    this.newUser.role = '';
    this.newUser.uid = '';
  }

  createAppointment(app) {
    app.doctorName = this.docMap.get(app.doctorUID);
    this.adminService.createAppointment(app)
      .then(response => {
        console.log(response);
        this.appointmentForm = false;
        this.newApp.doctorName = '',
          this.newApp.doctorUID = '',
          this.newApp.requested = '',
          this.newApp.confirmation = 'false',
          this.newApp.comments = '',
          this.newApp.name = '',
          this.newApp.userId = '';
        this.fetchAllUsers();
        this.success(response);
      });
  }

  closeAppointment() {
    this.appointmentForm = false;
    this.newApp.doctorName = '',
      this.newApp.doctorUID = '',
      this.newApp.requested = '',
      this.newApp.confirmation = 'false',
      this.newApp.comments = '',
      this.newApp.name = '',
      this.newApp.userId = '';
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

  registerSuccess(str) {
    if (str === 'true') {
      $.toast({
        heading: 'Success',
        text: 'User created successfully.',
        position: 'top-right',
        hideAfter: 4000,
        icon: 'success'
      });
    } else {
      $.toast({
        heading: 'Error',
        text: 'Error in creating user. Please try again',
        position: 'top-right',
        hideAfter: 5000,
        icon: 'error'
      });
    }
  }

  updateUser(id, data) {
    console.log(id);
    this.adminService.updatePatientProfile(id, data)
      .then((response) => {
        this.updateUserSuccess();
        this.fetchAllUsers();
      });
  }

  deleteUserSuccess() {
    $.toast({
      heading: 'Success',
      text: 'User deleted successfully.',
      position: 'top-right',
      hideAfter: 4000,
      icon: 'success'
    });
  }

  updateUserSuccess() {
    $.toast({
      heading: 'Success',
      text: 'User updated successfully.',
      position: 'top-right',
      hideAfter: 4000,
      icon: 'success'
    });
  }

  deleteUser(id) {
    console.log(id);
    this.adminService.deleteUser(id)
      .then(() => {
        this.deleteUserSuccess();
        this.fetchAllUsers();
      });
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

  fetchAllUsers() {
    this.loading = true;
    this.users = [];
    this.adminService.fetchAllUsers()
      .then((response) => {
        console.log(response);
        for (const res of response) {
          if (res.role !== 'admin') {
            this.users.push(res);
          }
        }

        for (const val of response) {
          if (val.role === 'user') {
            this.roleUserList.push({'value': val.id, 'viewValue': val.username});
          }
        }

        for (const data of response) {
          if (data.role === 'doctor') {
            this.roleDoctorList.push({'value': data.id, 'uid': data.uid, 'viewValue': data.username});
            this.docMap.set(data.uid, data.username);
          }
        }
        this.loading = false;
      });
  }

  updateAppointment(data) {
    console.log(data);
    this.loginService.updateAppointment(data)
      .then(response => {
        console.log(response);
        this.updateAppointmentSuccess(response);
      })
      .then(() => {
        this.fetchAllUsers();
      });
  }

  deleteAppointment(id) {
    console.log(id);
    this.adminService.deleteAppointment(id)
      .then(() => {
        this.fetchAllUsers();
      })
      .then(() => {
        this.deleteAppointmentSuccess();
      });
  }

  deleteFile(id) {
    console.log(id);
    this.upload.delete(id, this.userId)
      .then((response) => {
        console.log(response);
        this.deleteFileSuccess();
        this.fetchAllUsers();
      });
  }


  deleteAppointmentSuccess() {
    $.toast({
      heading: 'Success',
      text: 'Appointment deleted successfully',
      position: 'top-right',
      hideAfter: 4000,
      icon: 'success'
    });
  }

  deleteFileSuccess() {
    $.toast({
      heading: 'Success',
      text: 'File deleted successfully',
      position: 'top-right',
      hideAfter: 4000,
      icon: 'success'
    });
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

  findProfileById() {
    this.loading = true;
    this.profileService.findProfileById(this.userId)
      .then((response) => {
        this.renderUser(response);
      });
  }

  renderUser(user) {
    console.log(user);
    this.userId = user.id;
    this.userRole = user.role;
    this.uid = user.uid;
    this.admin.username = user.username;
  }

}
