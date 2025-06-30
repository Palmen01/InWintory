import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Item {
  id: number;
  name: string;
  quantity: number;
  unitsSold: number;
  unitsLost: number;
  reorderThreshold: number;
  restockOrders: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private GetAllItemsApi = 'https://localhost:7128/api/Item/All-Items';
  private SellItemApi = "https://localhost:7128/api/Item/Sell-Item"
  private OrderItemApi = "https://localhost:7128/api/Item/Order-Item"
  private RemoveItemApi = "https://localhost:7128/api/Item/Delete-Item"

  constructor(private http: HttpClient) {}

  // Method to get all items
  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.GetAllItemsApi);
  }

  // Method to sell items
  SellItem(id: number, quantity: number): Observable<Item> {
    const url = `${this.SellItemApi}?id=${id}&quantity=${quantity}`;
    return this.http.put<Item>(url, {});
  }

  OrderItem(id: number, quantity: number): Observable<Item> {
    const url = `${this.OrderItemApi}?id=${id}&quantity=${quantity}`;
    return this.http.post<Item>(url, {});
  }

  RemoveItem(id: number): Observable<Item> {
    const url = `${this.RemoveItemApi}?id=${id}`;
    return this.http.delete<Item>(url, {});
  }
}