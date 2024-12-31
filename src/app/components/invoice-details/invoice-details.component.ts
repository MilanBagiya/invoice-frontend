import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  InvoiceService
} from '../../shared/services/invoice.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-invoice-details',
  imports: [SharedModule],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent {
  invoiceDetails!: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private invoiceService: InvoiceService,
    public dialogRef: MatDialogRef<InvoiceDetailsComponent>
  ) {
    this.fetchInvoiceDetails(data.invoiceId);
  }

  fetchInvoiceDetails(id: number): void {
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (data) => {
        this.invoiceDetails = data;
      },
      error: (error) => {
        console.error('Error fetching invoice details:', error);
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
