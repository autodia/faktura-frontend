import { Component, OnInit, Input } from '@angular/core';
import { Faktura } from '../../model/faktura';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-faktura-pdf',
  templateUrl: './faktura-pdf.component.html',
  styleUrls: ['./faktura-pdf.component.css']
})
export class FakturaPdfComponent implements OnInit {
  @Input() faktura: Faktura;

  math = Math;

  constructor() { }

  ngOnInit() {
  }

  async convertToPdf() {
    let element = document.querySelector("#replyPage") as HTMLElement
    console.log("HEYHEY", element.scrollHeight)
    return await html2canvas(element, {
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      width: element.scrollWidth,
      height: element.scrollHeight,
      scale: 2    
    }).then(async canvas => {

      console.log(canvas)

      var contentWidth = canvas.width;
      var contentHeight = canvas.height;

      //The height of the canvas which one pdf page can show;
      var pageHeight = contentWidth / 592.28 * 841.89;
      //the height of canvas that haven't render to pdf
      var leftHeight = contentHeight;
      //addImage y-axial offset
      var position = 0;
      //a4 format [595.28,841.89]	      
      var imgWidth = 595.28;
      var imgHeight = 592.28 / contentWidth * contentHeight;

      var pageData = canvas.toDataURL('image/jpeg', 1.0);

      var pdf = new jspdf('', 'pt', 'a4');

      if (leftHeight < pageHeight) {
        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight;
          position -= 841.89;
          //avoid blank page
          if (leftHeight > 0) {
            pdf.addPage();
          }
        }
      }

      return pdf;
    });

  }

}
