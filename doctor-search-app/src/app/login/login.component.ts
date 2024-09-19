import {Component, OnInit, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../services/login.service';
import {
  MatSnackBar, MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MAT_SNACK_BAR_DATA
} from '@angular/material';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: boolean;
  register: boolean;
  xx = this;
  user = {
    username: '',
    password: '',
    regUsername: '',
    regPassword: '',
    regConfirmPassword: '',
    doctorUID: ''
  };
  mismatchPassword = true;
  fgtPwd = false;
  fgtPwdEmail;
  docCheck = false;
  userId;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private loginService: LoginService, private router: Router, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.login = true;
    this.register = false;
  }

  showDocUID(val) {
    this.docCheck = !this.docCheck;
  }

  showLogin() {
    $('#signIn').click(() => {
      this.login = true;
      this.register = false;
      $('#signIn').removeClass('inactive underlineHover');
      $('#signIn').addClass('active');
      $('#register').removeClass('active');
      $('#register').addClass('inactive underlineHover');
    });
  }

  showRegister() {
    $('#register').click(() => {
      this.login = false;
      this.register = true;
      $('#register').removeClass('inactive underlineHover');
      $('#register').addClass('active');
      $('#signIn').removeClass('active');
      $('#signIn').addClass('inactive underlineHover');
    });
  }

  /*  loginUser(user) {
      this.loginService.loginUser(user)
        .then((userResponse) => {
          console.log(userResponse);
          if (userResponse === null) {
            this.openSnackBar();
          } else {
            if (userResponse.role === 'admin') {
              this.router.navigate(['/admin', {username: userResponse.userName}]);
            } else if (userResponse.role === 'faculty') {
              this.router.navigate(['/faculty', {username: userResponse.userName}]);
            } else {
              this.router.navigate(['/profile', {username: userResponse.userName}]);
            }
            this.loginService.setUserName();
          }


        });
    }*/

  loginUser(user) {
    this.userId = '';
    this.loginService.login(user)
      .then((response) => {
        this.userId = response[0];
        this.loginSuccess(response[1], this.userId);
      });
  }

  registerUser(user) {
    let role = 'user';
    if (this.docCheck) {
      role = 'doctor';
    }
    this.loginService.registerUser(this.user, role)
      .then((response) => {
        this.userId = response[0];
        this.success(response[1], this.userId);
      });
  }

  forgotPassword(emailID) {
    const userEmail = {
      email: emailID
    };
    this.loginService.forgotPassword(userEmail)
      .then(this.postforgotPassword.bind(this));
  }

  activateForgotPwd() {
    this.fgtPwd = true;
    this.login = false;
    this.register = false;
  }

  deactivateForgotPwd() {
    this.fgtPwd = false;
    this.login = true;
    this.register = false;
  }

  postforgotPassword(val) {
    if (val[0] === 'success') {
      $.toast({
        heading: 'Information',
        text: 'A mail has been sent to given mail address. Click the link to reset password.',
        position: 'top-right',
        hideAfter: 6000,
        icon: 'info'
      });

      this.deactivateForgotPwd();
    } else {
      $.toast({
        heading: 'Error',
        text: val,
        position: 'top-right',
        hideAfter: 6000,
        icon: 'error'
      });
    }

  }

  success(str, userId) {
    if (str === 'true') {
      $.toast({
        heading: 'Success',
        text: 'User has been registered.',
        position: 'top-right',
        hideAfter: 4000,
        icon: 'success'
      });


      this.router.navigate(['/profile', {userId: userId}]);
    } else {
      $.toast({
        heading: 'Error',
        text: 'A user exists with the same username. Try some different username',
        position: 'top-right',
        hideAfter: 5000,
        icon: 'error'
      });
    }
  }


  loginSuccess(str, userId) {
    if (str === 'true') {
      $.toast({
        heading: 'Success',
        text: 'User logged in.',
        position: 'top-right',
        hideAfter: 4000,
        icon: 'success'
      });

      this.router.navigate(['/profile', {userId: userId}]);
    } else {
      $.toast({
        heading: 'Error',
        text: 'Invalid username or password. Please try again',
        position: 'top-right',
        hideAfter: 5000,
        icon: 'error'
      });
    }
  }

  checkValid(user, touched) {
    if (touched) {
      if (user.regPassword !== user.regConfirmPassword) {
        this.mismatchPassword = true;
        return true;
      } else {
        this.mismatchPassword = false;
        return false;
      }
    }
  }

  openSnackBar() {
    this.snackBar.openFromComponent(NotificationComponent, {
      duration: 6000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: 'login'
    });
  }

}

@Component({
  selector: 'app-login-alert',
  templateUrl: '../notifications/Alert/alert.html',
  styles: [`
    .example-pizza-party {
      color: white;
    }

    #error-sign {
      position: relative;
      top: 4px;
      margin: 0 8px 0 0px;
      color: red;
      font-size: 19px;
    }
  `],
})

export class NotificationComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }
}
