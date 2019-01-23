import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


@Component({
    selector: 'course-closed-dialog',
    templateUrl: 'course-closed-dialog.component.html',
    styleUrls: ['course-closed-dialog.component.scss']
})
export class CourseClosedDialog 
{

    constructor( 
        public dialogRef: MatDialogRef<CourseClosedDialog>, 
        @Inject(MAT_DIALOG_DATA) 
        public data: any,
    ) 
    {
        this.dialogRef.disableClose = true;
    }

    private close () : void {
        this.dialogRef.close();
    }

}