import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataService } from '../../services/data.service';
import { SalaryDataWithLevel } from '../../models/salary.model';
import { 
  COUNTRY_SALARIES, 
  LANGUAGE_MULTIPLIERS, 
  EXPERIENCE_MULTIPLIERS, 
  EXPERIENCE_LEVELS 
} from '../../core/constants/salary.constants';

@Component({
  selector: 'app-salary-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-calculator.component.html',
  styleUrls: ['./salary-calculator.component.css']
})
export class SalaryCalculatorComponent implements OnInit {
  countries: string[] = [];
  languages: string[] = [];
  experienceLevels: string[] = EXPERIENCE_LEVELS;
  
  selectedCountry: string = '';
  selectedLanguage: string = '';
  
  calculatedSalaries: SalaryDataWithLevel[] = [];
  
  constructor(private dataService: DataService) {}
  
  ngOnInit(): void {
    // Load countries and languages from the DataService
    this.dataService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
    
    this.dataService.getLanguages().subscribe(languages => {
      this.languages = languages;
    });
  }
  
  calculateSalaries(): void {
    // Check if both country and language are selected
    if (!this.selectedCountry || !this.selectedLanguage) {
      this.calculatedSalaries = [];
      return;
    }
    
    // Get base salary and multipliers from constants
    const baseSalary = COUNTRY_SALARIES[this.selectedCountry] || 70000;
    const languageMultiplier = LANGUAGE_MULTIPLIERS[this.selectedLanguage] || 1.0;
    
    // Calculate salary for each experience level
    this.calculatedSalaries = this.experienceLevels.map(level => {
      const experienceMultiplier = EXPERIENCE_MULTIPLIERS[level] || 1.0;
      const salary = Math.round(baseSalary * languageMultiplier * experienceMultiplier);
      
      return {
        level: level,
        salary: salary,
        percentage: 100 // Will be used for visualization
      };
    });
  }
  
  formatSalary(amount: number): string {
    return '$' + amount.toLocaleString();
  }
}