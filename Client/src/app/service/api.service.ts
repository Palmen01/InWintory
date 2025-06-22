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
  private GetAllItemsApi = 'https://localhost:7128/api/Item/Items';
  private SellItemApi = "https://localhost:7128/api/Item/Items"

  constructor(private http: HttpClient) {}

  // Method to get all items
  getAllItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.GetAllItemsApi);
  }

  SellItem(): Observable<Item[]> {
    return this.http.get<Item[]>(this.SellItemApi)
  }
}