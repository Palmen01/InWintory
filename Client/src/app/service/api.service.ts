import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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

@Injectable({ providedIn: 'root' })

export class ApiService {
  private baseUrl = 'https://localhost:7128/api/items';

  private itemsUpdatedSource = new BehaviorSubject<void>(undefined);
  itemsUpdated$ = this.itemsUpdatedSource.asObservable();

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl);
  }

  SellItem(id: number, quantity: number): Observable<Item> {
    const url = `${this.baseUrl}/${id}/sell?quantity=${quantity}`;
    return this.http.put<Item>(url, {}).pipe(
      tap(() => {
        // Notify all subscribers that items have been updated
        this.notifyItemsUpdated();
      })
    );
  }

  OrderItem(id: number, quantity: number): Observable<Item> {
    const url = `${this.baseUrl}/${id}/restock?quantity=${quantity}`;
    return this.http.patch<Item>(url, {}).pipe(
      tap(() => {
        this.notifyItemsUpdated();
      })
    );
  }

  AddItem(name: string, quantity: number, reorderThreshold: number, cost: number): Observable<Item> {
    const body = { name, quantity, reorderThreshold, cost };
    return this.http.post<Item>(this.baseUrl, body).pipe(
      tap(() => {
        this.notifyItemsUpdated();
      })
    );
  }

  RemoveItem(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url).pipe(
      tap(() => {
        this.notifyItemsUpdated();
      })
    );
  }

  EditItem(id: number, itemData: Item): Observable<Item> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Item>(url, itemData).pipe(
      tap(() => {
        this.notifyItemsUpdated();
      })
    );
  }

  UpdateItem(id: number, item: Item): Observable<Item> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Item>(url, item).pipe(
      tap(() => {
        this.notifyItemsUpdated();
      })
    );
  }

  notifyItemsUpdated() {
    this.itemsUpdatedSource.next();
  }
}