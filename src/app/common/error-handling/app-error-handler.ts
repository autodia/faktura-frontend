/**
 * @module Error_Handling
 */

import { ErrorHandler } from '@angular/core';


export class AppErrorHandler implements ErrorHandler {
    handleError(error) {
        // alert('An unexpected error occured'); // display error use toast in future
        console.log(error); // log on server

        // show toast to user

        // log error
    }
}
