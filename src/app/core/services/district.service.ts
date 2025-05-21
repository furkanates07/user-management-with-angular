import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { District } from '../../models/district.model';

@Injectable({
  providedIn: 'root',
})
export class DistrictService {
  private districts = new BehaviorSubject<District[]>([]);

  districts$ = this.districts.asObservable();

  constructor(private http: HttpClient) {
    this.loadDistricts();
  }

  private loadDistricts(): void {
    this.http
      .get<District[]>('assets/data/dashboard/districts.json')
      .subscribe({
        next: (data) => this.districts.next(data),
        error: (err) =>
          console.error('Error loading districts from JSON file:', err),
      });
  }

  getDistricts(): Observable<District[]> {
    return this.districts.asObservable();
  }

  getDistrictByFileName(fileName: string): District | undefined {
    const currentDistricts = this.districts.getValue();
    return currentDistricts.find((district) => district.fileName === fileName);
  }

  getAllDistrictsFileNames(): string[] {
    const currentDistricts = this.districts.getValue();
    return currentDistricts.map((district) => district.fileName);
  }
}
