import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { InvoiceService } from '../../shared/services/invoice.service';
import { ToasterService } from '../../shared/services/toaster.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.scss'],
  imports: [SharedModule],
})
export class InvoiceCreateComponent {
  invoiceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InvoiceCreateComponent>,
    public invoiceService: InvoiceService,
    private toast: ToasterService
  ) {
    this.invoiceForm = this.fb.group({
      fromName: ['', Validators.required],
      fromAddress: ['', Validators.required],
      toName: ['', Validators.required],
      toAddress: ['', Validators.required],
      items: this.fb.array([this.createItemGroup()]),
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      itemName: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(1)]],
    });
  }

  addItem(): void {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  calculateTotal(index: number): number {
    const item = this.items.at(index).value;
    return item.quantity * item.rate;
  }

  submitInvoice(): void {
    if (!this.invoiceForm.valid) {
      console.log('Form is invalid');
      return;
    }

    const formData = this.invoiceForm.value;

    this.invoiceService.createInvoice(formData).subscribe({
      next: (res: any) => {
        this.toast.openSnackBar('Invoice Submitted');
        this.dialogRef.close();
      },
      error: (err) => {
        this.toast.openSnackBar('Error creating invoice');
        console.error('Error submitting invoice:', err);
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
