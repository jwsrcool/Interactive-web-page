import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, catchError } from 'rxjs';
import { SalaryData, RawData } from '../models/salary.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data.json';
  private cachedData: SalaryData[] | null = null;

  constructor(private http: HttpClient) { }

  /**
   * Gets the full dataset of salary information
   * @returns Observable of SalaryData array
   */
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
      }),
      catchError(error => {
        console.error('Error fetching salary data:', error);
        return of([]);
      })
    );
  }

  /**
   * Gets a list of all available countries
   * @returns Observable of string array of country names
   */
  getCountries(): Observable<string[]> {
    return this.getData().pipe(
      map(data => [...new Set(data.map(item => item.country))].sort())
    );
  }

  /**
   * Gets a list of all available programming languages
   * @returns Observable of string array of language names
   */
  getLanguages(): Observable<string[]> {
    return this.getData().pipe(
      map(data => [...new Set(data.map(item => item.language))].sort())
    );
  }

  /**
   * Gets a list of all available experience levels
   * @returns Observable of string array of experience levels
   */
  getExperienceLevels(): Observable<string[]> {
    return this.getData().pipe(
      map(data => [...new Set(data.map(item => item.experience))].sort())
    );
  }

  /**
   * Calculates the salary based on country, language and experience
   * @param country The selected country
   * @param language The selected programming language
   * @param experience The selected experience level
   * @returns Observable with the calculated salary value
   */
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