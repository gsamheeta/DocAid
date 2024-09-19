import {Component, OnInit, Input} from '@angular/core';
import {HttpClient, HttpResponse, HttpEventType} from '@angular/common/http';
import {UploadService} from '../services/upload.service';

declare var $: any;

@Component({
  selector: 'app-form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.css']
})
export class FormUploadComponent implements OnInit {

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = {percentage: 0};
  @Input() userId: String;

  constructor(private uploadService: UploadService) {
  }

  ngOnInit() {
  }


  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    this.progress.percentage = 0;

    this.currentFileUpload = this.selectedFiles.item(0);
    this.uploadService.pushFileToStorage(this.currentFileUpload, this.userId).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        this.success();
      }
    });

    this.selectedFiles = undefined;
  }

  success() {
    $.toast({
      heading: 'Success',
      text: 'File uploaded successfully',
      position: 'top-right',
      hideAfter: 4000,
      icon: 'success'
    });
  }

}
