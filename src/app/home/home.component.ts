import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { UploadService } from '../common/services/upload.service';
import { AppError } from '../common/error-handling/app-error';
import { ParsingService } from '../common/services/parsing.service';
import { Parsing } from '../common/model/parsing';
import { AuthService } from '../common/services/auth.service';
import { FakturaPdfComponent } from '../common/component/faktura-pdf/faktura-pdf.component';
import { Faktura } from '../common/model/faktura';
import { FakturaService } from '../common/services/faktura.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SendService } from '../common/services/send.service';

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

  /**
   * Determines whether or not to disable the upload button
   */
  uploadDisabled: boolean = false;

  constructor(private toasterService: ToasterService,
    private parsingService: ParsingService,
    private fakturaService: FakturaService,
    private sendService: SendService,
    private authService: AuthService,
    private spinner: NgxSpinnerService) { }

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
    this.uploadDisabled = true;
    this.spinner.show();

    let parsing_form = new FormData();

    parsing_form.append('data_fil', this.selectedFile, this.selectedFile.name)
    //parsing_form.append('fakturaer', "Test")
    //parsing_form.append('oprettet_af', this.authService.User.profile.id.toString())


    this.parsingService.create(parsing_form, true)
      .subscribe(parsing => {
        console.log(parsing);

        this.fakturaToPDF = parsing.fakturaer[0];

        // setTimeout(() => {
        //   this.callCreatePDF(0, parsing);
        // }, 2000);

        this.toasterService.pop('success', 'Success', 'Fakturaerne blev oprettet');
        this.spinner.hide();
      },
        (error: AppError) => {
          this.uploadDisabled = false;
          this.spinner.hide();

          this.toasterService.pop('failure', 'Fakturaerne blev ikke oprettet');
          console.log(error)
        }
      );
  }

  send() {
        this.sendService.send().subscribe(_ => {})
  }

  async callCreatePDF(i: number, parsing: Parsing) {
    if (i === parsing.fakturaer.length) {
      this.uploadDisabled = false;
      this.spinner.hide();
      this.fakturaToPDF = undefined;
    }
    else if (i < parsing.fakturaer.length) {
      await this.createPDF(parsing.fakturaer[i]).then(_ => {
        this.fakturaToPDF = parsing.fakturaer[i + 1]
        setTimeout(() => {
          this.callCreatePDF(i + 1, parsing);
        }, 2000);
      })
    }
    else {
      this.uploadDisabled = false;
      this.spinner.hide();
      this.fakturaToPDF = undefined;
    }
  }

  async createPDF(faktura: Faktura) {
    const pdf: any = await this.presentation.convertToPdf();

    const blob = pdf.output('blob')
    const file = this.blobToFil(blob, "faktura.pdf")

    let fakturaForm = new FormData();
    fakturaForm.append('id', faktura.id.toString())
    fakturaForm.append('pdf_fil', file, "faktura.pdf")
    fakturaForm.append('parsing', faktura.parsing.toString())

    this.fakturaService.update(fakturaForm)
      .subscribe(updatedFaktura => {
        console.log("Updated faktura", updatedFaktura)
      },
        (error: AppError) => {
          this.uploadDisabled = false;
          this.spinner.hide();

          this.toasterService.pop('failure', 'Der gik noget galt under upload af PDF-filer');
          console.log(error)
        }
      )
  }

  /**
   * Adds file metadata to a blob object
   * @param blob 
   * @param filename 
   */
  private blobToFil(blob, filename) {
    blob.lastModifiedDate = Date();
    blob.name = filename

    return <File>blob
  }
}
