import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  InvoiceData,
  InvoiceService,
} from '../../shared/services/invoice.service';
import { SharedModule } from '../../shared/shared.module';
import { InvoiceCreateComponent } from '../invoice-create/invoice-create.component';
import { InvoiceDetailsComponent } from '../invoice-details/invoice-details.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
  imports: [SharedModule],
})
export class InvoiceListComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'id',
    'invoiceDate',
    'invoiceNumber',
    'fromName',
    'fromAddress',
    'toName',
    'toAddress',
    'totalAmount',
    'actions',
  ];

  dataSource: MatTableDataSource<InvoiceData> =
    new MatTableDataSource<InvoiceData>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'invoiceDate') {
        return new Date(item.invoiceDate).getTime();
      }
      return item[property as keyof InvoiceData];
    };
  }

  loadInvoices(
    sortBy: string = 'invoiceDate',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): void {
    this.isLoading = true;
    this.invoiceService.getInvoices(sortBy, sortOrder).subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading invoices:', error);
        this.isLoading = false;
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSort(sort: any): void {
    const sortField = sort.active;
    const sortDirection = sort.direction;
    this.loadInvoices(sortField, sortDirection);
  }

  createInvoice(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '60vw';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.panelClass = 'invoice-create-dialog';

    const dialogRef = this.dialog.open(InvoiceCreateComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.loadInvoices();
      console.log(`Dialog result: ${result}`);
    });
  }

  viewInvoiceDetails(invoice: InvoiceData): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.minWidth = '40vw';
    dialogConfig.minHeight = 'auto';
    dialogConfig.data = { invoiceId: invoice.id };

    const dialogRef = this.dialog.open(InvoiceDetailsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      this.loadInvoices();
      console.log(`Dialog result: ${result}`);
    });
  }
}
