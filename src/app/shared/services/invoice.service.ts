import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InvoiceData {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  totalAmount: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInvoices(
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Observable<InvoiceData[]> {
    return this.http.get<InvoiceData[]>(
      `${this.apiUrl}/invoice?sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
  }

  createInvoice(invoice: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/invoice`, invoice);
  }

  getInvoiceById(id: number): Observable<any> {
    debugger;
    return this.http.get<any>(`${this.apiUrl}/invoice/${id}`);
  }
}
