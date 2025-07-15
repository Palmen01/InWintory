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
  private GetAllItemsApi = 'https://localhost:7128/api/Item/All-Items';
  private SellItemApi = "https://localhost:7128/api/Item/Sell-Item"
  private OrderItemApi = "https://localhost:7128/api/Item/Order-Item"
  private AddItemApi = "https://localhost:7128/api/Item/Add-Item"
  private RemoveItemApi = "https://localhost:7128/api/Item/Delete-Item"
  private EditItemApi = "https://localhost:7128/api/Item/Edit-Item/{id}"


  constructor(private http: HttpClient) { }

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.GetAllItemsApi);
  }

  SellItem(id: number, quantity: number): Observable<Item> {
    const url = `${this.SellItemApi}?id=${id}&quantity=${quantity}`;
    return this.http.put<Item>(url, {});
  }

  OrderItem(id: number, quantity: number): Observable<Item> {
    const url = `${this.OrderItemApi}?id=${id}&quantity=${quantity}`;
    return this.http.post<Item>(url, {});
  }

  AddItem(name: string, quantity: number, reorderThreshold: number, cost: number): Observable<Item> {
    const body = {
      name: name,
      quantity: quantity,
      reorderThreshold: reorderThreshold,
      cost: cost
    };
    return this.http.post<Item>(this.AddItemApi, body);
  }

  RemoveItem(id: number): Observable<Item> {
    const url = `${this.RemoveItemApi}?id=${id}`;
    return this.http.delete<Item>(url, {});
  }

  EditItem(id: number, itemData: Item): Observable<Item> {
    const url = this.EditItemApi.replace('{id}', id.toString());
    return this.http.put<Item>(url, itemData);
  }
}