import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage: Storage = localStorage;

  set<T>(key: string, value: T): void {
    try {
      const wrapped = JSON.stringify(value);
      this.storage.setItem(key, wrapped);
    } catch {
      // ignore
    }
  }

  get<T>(key: string, fallback: T): T {
    const raw = this.storage.getItem(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }
}
