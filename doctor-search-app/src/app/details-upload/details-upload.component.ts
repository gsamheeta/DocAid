import {Component, OnInit, Input} from '@angular/core';
import {UploadService} from '../services/upload.service';

@Component({
  selector: 'app-details-upload',
  templateUrl: './details-upload.component.html',
  styleUrls: ['./details-upload.component.css']
})
export class DetailsUploadComponent implements OnInit {

  @Input() fileUpload;

  constructor(private upload: UploadService) {
  }

  ngOnInit() {
  }

/*  delete(id) {
    console.log(id);
    this.upload.delete(id)
      .then((response) => {
        console.log(response);
      });
  }*/

}
