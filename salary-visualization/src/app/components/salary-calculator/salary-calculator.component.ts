import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

interface SalaryData {
  level: string;
  salary: number;
  percentage: number;
}

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
  experienceLevels: string[] = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Architect'];
  
  selectedCountry: string = '';
  selectedLanguage: string = '';
  
  calculatedSalaries: SalaryData[] = [];
  
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
    
    // Base salary by country
    const countrySalaries: {[key: string]: number} = {
      'United States': 90000,
      'United Kingdom': 65000,
      'Germany': 70000,
      'India': 25000,
      'Canada': 80000,
      'France': 60000,
      'Japan': 75000,
      'Netherlands': 68000,
      'Spain': 50000,
      'Italy': 48000,
      'Brazil': 35000,
      'China Mainland': 45000,
      'Korea, Republic of (South Korea)': 65000,
      'Mexico': 30000,
      'Poland': 42000
    };
    
    // Language multipliers
    const languageMultipliers: {[key: string]: number} = {
      'JavaScript/TypeScript': 1.0,
      'Java/Kotlin': 1.1,
      'Python': 1.05,
      'C#': 1.05,
      'C / C++': 1.15,
      'Go': 1.2,
      'PHP': 0.9,
      'Rust': 1.25,
      'HTML/CSS': 0.85,
      'SQL (PL/SQL, T-SQL, or other programming extensions of SQL)': 1.0,
      'Shell scripting languages (Bash, Shell, PowerShell, etc.)': 0.95
    };
    
    // Experience multipliers
    const experienceMultipliers: {[key: string]: number} = {
      'Junior': 0.7,
      'Mid-level': 1.0,
      'Senior': 1.4,
      'Lead': 1.7,
      'Architect': 2.0
    };
    
    // Calculate salary for each experience level
    const baseSalary = countrySalaries[this.selectedCountry] || 70000;
    const languageMultiplier = languageMultipliers[this.selectedLanguage] || 1.0;
    
    this.calculatedSalaries = this.experienceLevels.map(level => {
      const experienceMultiplier = experienceMultipliers[level] || 1.0;
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