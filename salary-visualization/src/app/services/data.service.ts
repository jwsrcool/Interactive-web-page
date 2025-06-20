import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export interface SalaryData {
  country: string;
  language: string;
  experience: string;
  salary: number;
}

interface RawDataEntry {
  value: number;
  category: string;
  metadata: {
    Country: string;
    Language: string;
    Experience: string;
    Salary: string;
  };
}

interface RawData {
  [country: string]: {
    [language: string]: {
      entries: RawDataEntry[];
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data.json';
  private cachedData: SalaryData[] | null = null;

  constructor(private http: HttpClient) { }

  getData(): Observable<SalaryData[]> {
    if (this.cachedData) {
      return of(this.cachedData);
    }

    return this.http.get<RawData>(this.dataUrl).pipe(
      map(rawData => {
        const transformedData: SalaryData[] = [];

        // Process the nested structure
        Object.keys(rawData).forEach(country => {
          Object.keys(rawData[country]).forEach(language => {
            rawData[country][language].entries.forEach(entry => {
              // Extract salary value from string like "$35K / year"
              const salaryStr = entry.metadata.Salary;
              const salaryValue = parseInt(salaryStr.replace(/[^0-9]/g, ''), 10);

              transformedData.push({
                country: country,
                language: language,
                experience: entry.category,
                salary: salaryValue * 1000 // Convert K to actual value
              });
            });
          });
        });

        this.cachedData = transformedData;
        return transformedData;
      })
    );
  }

  getCountries(): Observable<string[]> {
    return this.getData().pipe(
      map(data => [...new Set(data.map(item => item.country))].sort())
    );
  }

  getLanguages(): Observable<string[]> {
    return this.getData().pipe(
      map(data => [...new Set(data.map(item => item.language))].sort())
    );
  }

  getExperienceLevels(): Observable<string[]> {
    return this.getData().pipe(
      map(data => [...new Set(data.map(item => item.experience))].sort())
    );
  }

  calculateSalary(country: string, language: string, experience: string): Observable<number> {
    return this.getData().pipe(
      map(data => {
        const matches = data.filter(item =>
          item.country === country &&
          item.language === language &&
          item.experience === experience
        );

        if (matches.length === 0) return 0;

        // Calculate average if multiple entries exist
        const sum = matches.reduce((acc, item) => acc + item.salary, 0);
        return Math.round(sum / matches.length);
      })
    );
  }
}
