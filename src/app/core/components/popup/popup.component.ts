import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

  @Input()  icon: String;
  @Input()  type: String;

  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(type): void {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      data: {tipo: type}
    });
  }
}

@Component({
  selector: 'app-popup-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['./popup.component.scss']
})
export class DialogPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

}
