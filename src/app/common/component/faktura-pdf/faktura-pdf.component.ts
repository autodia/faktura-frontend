import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { Faktura } from '../../model/faktura';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

export interface ImageData {
  imgWidth: number,
  imgHeight: number,
  pageData: string
}

@Component({
  selector: 'app-faktura-pdf',
  templateUrl: './faktura-pdf.component.html',
  styleUrls: ['./faktura-pdf.component.css']
})
export class FakturaPdfComponent implements OnInit {
  @Input() faktura: Faktura;

  math = Math;

  pdf: jspdf;

  pagesAdded = 0;
  pages = 0;

  removedElements: HTMLElement[] = [];
  tableFoot: HTMLElement = undefined;
  footer: HTMLElement = undefined;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  reset() {
    this.pdf = new jspdf('', 'pt', 'a4');
    this.pagesAdded = 0;
    this.pages = 0;
    this.removedElements = [];
    this.tableFoot = undefined;
    this.footer = undefined;
  }

  async convertToPdf() {

    this.reset();

    this.pages = Math.ceil(this.faktura.antal_linjer / 18)

    let element = document.querySelector("#replyPage") as HTMLElement;

    //Remove and save table foot
    this.tableFoot = element.children.namedItem("table").children.namedItem("tfoot") as HTMLElement;
    element.children.namedItem("table").children.namedItem("tfoot").remove();

    //Save footer
    this.footer = document.querySelector("#footer") as HTMLElement;

    return await this.callAddPage(0, element);

  }

  async callAddPage(i: number, element: HTMLElement) {

    if (this.pagesAdded === this.pages) {
      return this.pdf
    }
    else if (i < this.pages) {
      return await this.addPage(i, element).then(async _ => {
        return await this.callAddPage(i + 1, element);
      });
    }
    else {
      return this.pdf;
    }
  }

  async addPage(i: number, element: HTMLElement) {
    for (let j = 0; j < this.faktura.antal_linjer; j++) {

      if (j >= i * 18 && j < (i + 1) * 18) {
      }
      else {
        this.removedElements.push(element.children.namedItem("table").children.namedItem("tbody").children.namedItem("row-" + j) as HTMLElement)
        element.children.namedItem("table").children.namedItem("tbody").children.namedItem("row-" + j).remove()
      }
    }

    if (i === this.pages - 1) {
      this.renderer.appendChild(element.children.namedItem("table"), this.tableFoot)
    }

    //Add new page
    await this.createImageFromCanvas(element).then(async data => {

      if (i !== 0) {
        this.pdf.addPage();
      }
      this.pdf.addImage(data.pageData, 'JPEG', 0, 0, data.imgWidth, data.imgHeight);
      this.pagesAdded++;

      for (let x of this.removedElements) {
        this.renderer.appendChild(element.children.namedItem("table").children.namedItem("tbody"), x)
      }

      this.removedElements = [];

      //Add footer
      await this.createImageFromCanvas(this.footer).then(async data2 => {

        this.pdf.addImage(data2.pageData, 'JPEG', 0, 841.89 - 50, data2.imgWidth, data2.imgHeight);

      })
    })
  }

  async createImageFromCanvas(element: HTMLElement) {
    return await html2canvas(element, {
      scale: 3
    }).then(async canvas => {

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

      let imageData: ImageData = {
        imgHeight: imgHeight,
        imgWidth: imgWidth,
        pageData: pageData
      }

      return imageData;
    });
  }

}

/*
        return await html2canvas(parent_element, {
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
        */
