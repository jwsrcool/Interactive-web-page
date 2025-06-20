import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SalaryData {
  level: string;
  salary: number;
  percentage: number;
}

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit, OnChanges {
  @Input() country: string = 'US';
  @Input() language: string = 'JavaScript';

  salaryData: SalaryData[] = [];
  averageSalary: number = 0;
  seniorJuniorRatio: number = 0;
  seniorJuniorGrowth: number = 0;
  countryComparison: number = 0;
  countryComparisonDirection: string = 'higher';

  experienceLevels: string[] = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Architect'];

  ngOnInit(): void {
    this.generateSalaryData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateSalaryData();
  }

  generateSalaryData(): void {
    // Base salary by country
    const countrySalaries: {[key: string]: number} = {
      'US': 90000,
      'UK': 65000,
      'Germany': 70000,
      'India': 25000,
      'Canada': 80000,
      'Australia': 85000,
      'France': 60000,
      'Japan': 75000,
      'Global': 65000
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
    const baseSalary = countrySalaries[this.country] || 70000;
    const languageMultiplier = languageMultipliers[this.language] || 1.0;
    
    const salaries = this.experienceLevels.map(level => {
      const experienceMultiplier = experienceMultipliers[level] || 1.0;
      return Math.round(baseSalary * languageMultiplier * experienceMultiplier);
    });
    
    // Find the maximum salary for percentage calculation
    const maxSalary = Math.max(...salaries);
    
    // Create the salary data array
    this.salaryData = this.experienceLevels.map((level, index) => {
      return {
        level: level,
        salary: salaries[index],
        percentage: Math.round((salaries[index] / maxSalary) * 100)
      };
    });
    
    // Calculate insights
    this.averageSalary = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
    this.seniorJuniorRatio = parseFloat((salaries[2] / salaries[0]).toFixed(1)); // Senior / Junior
    this.seniorJuniorGrowth = Math.round(((salaries[2] - salaries[0]) / salaries[0]) * 100);
    
    // Country comparison to global average
    const globalAverage = countrySalaries['Global'] * languageMultiplier;
    const countryAverage = baseSalary * languageMultiplier;
    this.countryComparison = Math.round(Math.abs(((countryAverage - globalAverage) / globalAverage) * 100));
    this.countryComparisonDirection = countryAverage > globalAverage ? 'higher' : 'lower';
  }

  formatSalary(amount: number): string {
    return '$' + amount.toLocaleString();
  }
}