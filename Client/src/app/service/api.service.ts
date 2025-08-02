import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Item {
  id: number;
  name: string;
  quantity: number;
  unitsSold: number;
  unitsLost: number;
  reorderThreshold: number;
  cost: number;
  restockOrders: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://localhost:7128/api/items';

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl);
  }

  SellItem(id: number, quantity: number): Observable<Item> {
    const url = `${this.baseUrl}/${id}/sell?quantity=${quantity}`;
    return this.http.put<Item>(url, {});
  }

  OrderItem(id: number, quantity: number): Observable<Item> {
    const url = `${this.baseUrl}/${id}/restock?quantity=${quantity}`;
    return this.http.patch<Item>(url, {});
  }

  AddItem(name: string, quantity: number, reorderThreshold: number, cost: number): Observable<Item> {
    const body = { name, quantity, reorderThreshold, cost };
    return this.http.post<Item>(this.baseUrl, body);
  }

  RemoveItem(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }

  EditItem(id: number, itemData: Item): Observable<Item> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Item>(url, itemData);
  }
}
