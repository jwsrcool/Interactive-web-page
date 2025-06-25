import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';

export interface SalaryEntry {
  value: number;
  category: string; // experience level
  metadata: {
    Country: string;
    Language: string;
    Experience: string;
    Salary: string;
  };
}

interface SalaryData {
  [country: string]: {
    [language: string]: {
      entries: SalaryEntry[];
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class SalaryDataService {
  private dataUrl = 'assets/data/salaries.json';
  private data$: Observable<SalaryData>;

  constructor(private http: HttpClient) {
    this.data$ = this.http.get<SalaryData>(this.dataUrl).pipe(
      shareReplay(1) // cache de JSON zodat je 'm maar 1x hoeft te laden
    );
  }

  // Retourneer nu SalaryEntry[] in plaats van number[]
  getSalaries(country: string, language: string): Observable<SalaryEntry[]> {
    return this.data$.pipe(
      map(data => {
        console.log('Data loaded:', data); // check hele dataset
        console.log('Looking for:', country, language);

        const countryData = data[country];
        if (!countryData) {
          console.warn(`No data for country: ${country}`);
          return [];
        }

        const langData = countryData[language];
        if (!langData) {
          console.warn(`No data for language: ${language} in country: ${country}`);
          return [];
        }

        // Retourneer de volledige entries in plaats van alleen values
        const entries = langData.entries || [];
        console.log('Found entries:', entries);
        return entries;
      })
    );
  }

  // Optioneel: behoud oude methode voor backwards compatibility
  getSalaryValues(country: string, language: string): Observable<number[]> {
    return this.getSalaries(country, language).pipe(
      map(entries => entries.map(entry => entry.value))
    );
  }

  // Filter op experience level
  getSalariesByExperience(country: string, language: string, experience: string): Observable<SalaryEntry[]> {
    return this.getSalaries(country, language).pipe(
      map(entries => entries.filter(entry => entry.category === experience))
    );
  }

  getCountries(): Observable<string[]> {
    return this.data$.pipe(
      map(data => {
        const countries = Object.keys(data);
        console.log('Available countries:', countries);
        return countries;
      })
    );
  }

  getLanguages(country: string): Observable<string[]> {
    return this.data$.pipe(
      map(data => {
        const languages = Object.keys(data[country] || {});
        console.log(`Languages for ${country}:`, languages);
        return languages;
      })
    );
  }

  // Extra helper methods
  getExperienceLevels(country: string, language: string): Observable<string[]> {
    return this.getSalaries(country, language).pipe(
      map(entries => {
        const levels = new Set(entries.map(entry => entry.category));
        return Array.from(levels);
      })
    );
  }

  // Get summary statistics
  getSalarySummary(country: string, language: string): Observable<{
    average: number;
    median: number;
    min: number;
    max: number;
    count: number;
  }> {
    return this.getSalaries(country, language).pipe(
      map(entries => {
        if (entries.length === 0) {
          return { average: 0, median: 0, min: 0, max: 0, count: 0 };
        }

        const values = entries.map(e => e.value).sort((a, b) => a - b);
        const sum = values.reduce((a, b) => a + b, 0);

        return {
          average: Math.round(sum / values.length),
          median: values.length % 2 === 0
            ? Math.round((values[values.length / 2 - 1] + values[values.length / 2]) / 2)
            : values[Math.floor(values.length / 2)],
          min: values[0],
          max: values[values.length - 1],
          count: values.length
        };
      })
    );
  }
}
