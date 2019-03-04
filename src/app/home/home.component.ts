import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { UploadService } from '../common/services/upload.service';
import { AppError } from '../common/error-handling/app-error';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('fileInput')
  fileInput: ElementRef;

  /**
 * The file selected by the user
 */
  selectedFile: File;

  constructor(private toasterService: ToasterService,
    private uploadService: UploadService) { }

  /**
 * Function to remember selected file
 */
  onFileSelected(files: File[]) {
    if (files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  /**
   * Used when the user wants to remove the file they have selected.
   */
  fileReset() {
    this.selectedFile = undefined;
    this.fileInput.nativeElement.value = null;
  }

  uploadBilag() {
    let form = new FormData();
    form.append('file', this.selectedFile, this.selectedFile.name)

    this.uploadService.upload(form)
      .subscribe(_ => {
        this.toasterService.pop('success', 'Success', 'Faktura filen blev tilføjet');
      },
        (error: AppError) => {
          this.toasterService.pop('failure', 'Faktura filen blev ikke tilføjet');
          console.log(error)
        }
      );
  }
}
