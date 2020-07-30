import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppError } from '../common/error-handling/app-error';
import { ToasterService, ToasterConfig } from 'angular2-toaster';
import { PriceService } from '../common/services/price.service';
import { AnalysePris } from '../common/model/analyse-pris';
import { AnalyseType } from '../common/model/analyse-type';
import { AnalyseTypeService } from '../common/services/analyse-type.service';
import { AnalysePrisService } from '../common/services/analyse-pris.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { BadInputError } from '../common/error-handling/bad-request-error';
import { DownloadService } from '../common/services/download.service';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {

  @ViewChild('fileInput')
  fileInput: ElementRef;

  priser: AnalysePris[] = []
  analyse_typer: AnalyseType[] = []

  ngOnInit() {
  }

  /**
 * The file selected by the user
 */
  selectedFile: File;

  /**
   * The different types of templates that the user can download
   */
  templates: string[] = ["KI", "KB", "GM", "VTL", "Pato"]

  /**
   * The selected template
   */
  template = "KI";

  constructor(private toasterService: ToasterService,
    private priceService: PriceService,
    private analyseTypeService: AnalyseTypeService,
    private analysePrisService: AnalysePrisService,
    private downloadService: DownloadService) { }

  /**
 * Downloads the file attached to the faktura object from the database
 */
  downloadTemplate() {
    let popup = window.open('', '_blank');

    let path = "templates/" + this.template + "_template.xlsx";

    this.downloadService.download(path).
      subscribe(file => {
        var url = window.URL.createObjectURL(file);
        popup.location.href = url;
        popup.focus();
        popup.onblur = function () { popup.close() };
      },
        (error: AppError) => {
          console.log("Error getting file", error)
        }
      );
  }

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
   
  uploadPatowebPriceFile(form) {
    this.priceService.createPatowebPrices(form)
      .subscribe(response => {
        this.toasterService.pop('success', 'Success', 'Prisfilen blev uploadet');
      },
        (error: AppError) => {
          this.toasterService.pop('failure', 'Fejl', 'Prisfilen blev ikke uploadet');
          console.log("Error", error)
        }
      );
  }

  uploadPriceFile() {
    let form = new FormData();
    form.append('file', this.selectedFile, this.selectedFile.name)

    if (this.selectedFile.name.includes("pato")){
      this.uploadPatowebPriceFile(form)
      return
    }



    this.priceService.createPrices(form)
      .subscribe(response => {

        //Create list of analyse_koder
        let analyse_type_objects = [];
        for (let item of JSON.parse(response.analyse_type_objects)) {
          let analyse_type_object = item.fields as AnalyseType

          analyse_type_object.id = item.pk;
          analyse_type_objects.push(analyse_type_object)
        }

        //Create objects from response
        this.analyse_typer = []
        for (let item of JSON.parse(response.new_analyse_typer)) {
          let analyse_type = item.fields as AnalyseType

          analyse_type.id = item.pk;
          analyse_type.flatten = AnalyseType.prototype.flatten;

          this.analyse_typer.push(analyse_type)
        }

        //Mark duplicates
        this.markTypeDuplicates(this.analyse_typer)

        //Sort list so duplicates are on top
        this.analyse_typer.sort((a) => {
          if (a.duplikat) return -1;
          else if (!a.duplikat) return 1;
          else return 0;
        });

        //Create objects from response
        let index = 0;
        this.priser = []
        for (let item of JSON.parse(response.prices)) {
          let analyse_pris = item.fields as AnalysePris

          analyse_pris.id = item.pk;
          analyse_pris.analyse_type = analyse_type_objects[index];
          analyse_pris.flatten = AnalysePris.prototype.flatten;

          this.priser.push(analyse_pris)          

          index++;
        }

        //Mark duplicates
        this.markPriceDuplicates(this.priser)

        //Sort list so duplicates are on top
        this.priser.sort((p) => {
          if (p.duplikat) return -1;
          else if (!p.duplikat) return 1;
          else return 0;
        });

        this.toasterService.pop('success', 'Success', 'Prisfilen blev uploadet');
      },
        (error: AppError) => {
          this.toasterService.pop('failure', 'Fejl', 'Prisfilen blev ikke uploadet');
          console.log("Error", error)
        }
      );
  }

  removeType(index: number, markDuplikates?: boolean) {
    this.analyse_typer.splice(index, 1);
    if (markDuplikates)
      this.markTypeDuplicates(this.analyse_typer)
  }

  removePrice(index: number, markDuplikates?: boolean) {
    this.priser.splice(index, 1);
    if (markDuplikates)
      this.markPriceDuplicates(this.priser)
  }

  submitTypes() {
    let observables: Observable<void>[] = [];

    for (let analyse_type of this.analyse_typer) {

      //Skip if analysetype is marked as duplicate
      if (analyse_type.duplikat) {
        this.toasterService.pop('failure', 'Fejl', 'Kan ikke oprettet ny analysetype så længe der findes en duplikat');
        continue
      }

      observables.push(
        this.analyseTypeService.create(analyse_type.flatten()).
          pipe(map(newAnalyseType => {
            console.log("Created analysetype: ", newAnalyseType);
          },
            (error: AppError) => {
              if (error instanceof BadInputError) {
                console.log("Bad input create analysetype", error);
              } else {
                throw error;
              }
            }
          ))
      );
    }

    forkJoin(observables)
      .subscribe(_ => {
        //Filter list so only duplicates remain
        this.analyse_typer = this.analyse_typer.filter(analyse_type => analyse_type.duplikat)

        this.toasterService.pop('success', 'Success', 'De nye analysetyper blev oprettet');

        if (this.analyse_typer.length == 0) {
          this.uploadPriceFile()
        }
      },
        (error: AppError) => {
          this.toasterService.pop('failure', 'Fejl', 'Der gik noget galt under oprettelsen af nye analysetyper');
          throw error;
        }
      )
  }

  submitPrices() {
    let observables: Observable<void>[] = [];

    for (let pris of this.priser) {

      console.log(pris.flatten())

      //Skip if pris is marked as duplicate
      if (pris.duplikat) {
        this.toasterService.pop('failure', 'Fejl', 'Kan ikke oprettet ny pris så længe der findes en duplikat');
        continue
      }

      observables.push(
        this.analysePrisService.create(pris.flatten()).
          pipe(map(newAnalysePris => {
            console.log("Created analysepris: ", newAnalysePris);
          },
            (error: AppError) => {
              if (error instanceof BadInputError) {
                console.log("Bad input create analysepris", error);
              } else {
                throw error;
              }
            }
          ))
      );
    }

    forkJoin(observables)
      .subscribe(_ => {
        //Filter list so only duplicates remain
        this.priser = this.priser.filter(pris => pris.duplikat)

        this.toasterService.pop('success', 'Success', 'De nye priser blev oprettet');
      },
        (error: AppError) => {
          this.toasterService.pop('failure', 'Fejl', 'Der gik noget galt under oprettelsen af nye analysepriser');
          console.log(error)
        }
      )
  }

  markTypeDuplicates(list: AnalyseType[]) {
    var seen = {}
    for (let x of list) {
      if (seen[x.ydelses_kode]) {
        for (let found_duplicate of list.filter(y => y.ydelses_kode === x.ydelses_kode)) {
          found_duplicate.duplikat = true;
        }
        continue
      }
      seen[x.ydelses_kode] = true
      x.duplikat = false
    }
  }

  markPriceDuplicates(list: AnalysePris[]) {
    var seen = {}
    for (let x of list) {
      if (seen[x.analyse_type.ydelses_kode]) {
        for (let found_duplicate of list.filter(y => y.analyse_type === x.analyse_type)) {
          found_duplicate.duplikat = true;
        }
        continue
      }
      seen[x.analyse_type.ydelses_kode] = true
      x.duplikat = false
    }
  }
}