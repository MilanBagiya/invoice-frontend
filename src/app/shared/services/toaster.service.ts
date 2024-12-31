import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(
    message: string,
    action: string = 'Close',
    duration: number = 3000
  ) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'left',
      verticalPosition: 'top',
    });
  }
}
