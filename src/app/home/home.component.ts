import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { UploadService } from '../common/services/upload.service';
import { AppError } from '../common/error-handling/app-error';
import { ParsingService } from '../common/services/parsing.service';
import { Parsing } from '../common/model/parsing';
import { AuthService } from '../common/services/auth.service';
import { FakturaPdfComponent } from '../common/component/faktura-pdf/faktura-pdf.component';
import { Faktura } from '../common/model/faktura';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public config: ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-right'
  });

  @ViewChild('fileInput')
  fileInput: ElementRef;

  @ViewChild('presentation') presentation: FakturaPdfComponent;

  /**
 * The file selected by the user
 */
  selectedFile: File;

  /**
   * The current faktura that is being converted to PDF
   */
  fakturaToPDF: Faktura = undefined;

  constructor(private toasterService: ToasterService,
    private parsingService: ParsingService,
    private authService: AuthService) { }

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

  createParsing() {
    let parsing_form = new FormData();

    parsing_form.append('data_fil', this.selectedFile, this.selectedFile.name)
    //parsing_form.append('fakturaer', "Test")
    //parsing_form.append('oprettet_af', this.authService.User.profile.id.toString())


    this.parsingService.create(parsing_form, true)
      .subscribe(parsing => {
        console.log(parsing);

        this.fakturaToPDF = parsing.fakturaer[0];

        setTimeout(() => {
          this.createPDF();
        }, 1000);        

        this.toasterService.pop('success', 'Success', 'Fakturaerne blev oprettet');
      },
        (error: AppError) => {
          this.toasterService.pop('failure', 'Fakturaerne blev ikke oprettet');
          console.log(error)
        }
      );
  }

  async createPDF() {
    const pdf: any = await this.presentation.convertToPdf();
    pdf.save('test.pdf');
  }
}
