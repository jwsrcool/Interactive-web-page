import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  countries: string[] = ['US', 'UK', 'Germany', 'India', 'Canada', 'Australia', 'France', 'Japan'];
  languages: string[] = ['JavaScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'Go', 'PHP'];
  experienceLevels: string[] = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Architect'];
  
  selectedCountry: string = 'US';
  selectedLanguage: string = 'JavaScript';
  
  calculatedSalaries: SalaryData[] = [];
  
  ngOnInit(): void {
    this.calculateSalaries();
  }
  
  calculateSalaries(): void {
    // Base salary by country
    const countrySalaries: {[key: string]: number} = {
      'US': 90000,
      'UK': 65000,
      'Germany': 70000,
      'India': 25000,
      'Canada': 80000,
      'Australia': 85000,
      'France': 60000,
      'Japan': 75000
    };
    
    // Language multipliers
    const languageMultipliers: {[key: string]: number} = {
      'JavaScript': 1.0,
      'Python': 1.05,
      'Java': 1.1,
      'C#': 1.05,
      'C++': 1.15,
      'Ruby': 1.0,
      'Go': 1.2,
      'PHP': 0.9
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