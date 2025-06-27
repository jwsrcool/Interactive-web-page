import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

interface SalaryData {
  level: string;
  salary: number;
  percentage: number;
}

interface SalaryPoint {
  value: number;
  percent: number;
  frequency: number; // Value between 0.3 and 1.0 to represent frequency
}

interface SalaryRange {
  level: string;
  min: number;
  max: number;
  minPercent: number;
  maxPercent: number;
  rangePercent: number;
  dataPoints: SalaryPoint[];
}

@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css']
})
export class VisualizationComponent implements OnInit, OnChanges {
  @Input() country: string = 'United States';
  @Input() language: string = 'JavaScript/TypeScript';

  salaryData: SalaryData[] = [];
  salaryRanges: SalaryRange[] = [];
  reversedSalaryRanges: SalaryRange[] = []; // For display in reverse order
  xAxisValues: number[] = [];
  
  averageSalary: number = 0;
  seniorJuniorRatio: number = 0;
  seniorJuniorGrowth: number = 0;
  countryComparison: number = 0;
  countryComparisonDirection: string = 'higher';

  experienceLevels: string[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
  maxSalaryValue: number = 0;
  
  // Store available countries and languages from the DataService
  availableCountries: string[] = [];
  availableLanguages: string[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Load available countries and languages from the DataService
    this.dataService.getCountries().subscribe(countries => {
      this.availableCountries = countries;
      this.generateSalaryData();
    });
    
    this.dataService.getLanguages().subscribe(languages => {
      this.availableLanguages = languages;
      this.generateSalaryData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateSalaryData();
  }

  generateSalaryData(): void {
    // Base salary by country - use the same values as before for consistency
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
      'Poland': 42000,
      'Global': 65000
    };
    
    // Language multipliers - use the same values as before for consistency
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
    
    // Calculate base salary
    const baseSalary = countrySalaries[this.country] || 70000;
    const languageMultiplier = languageMultipliers[this.language] || 1.0;
    const baseValue = baseSalary * languageMultiplier;
    
    // Generate salary ranges with variation
    this.salaryRanges = [];
    
    // Find the maximum salary for scaling
    let maxSalary = 0;
    let minSalary = Number.MAX_VALUE;
    
    // Generate salary data with ranges and data points
    this.experienceLevels.forEach((level, index) => {
      // Base multiplier increases with level
      const baseMultiplier = 0.7 + (index * 0.3);
      
      // Generate min and max with some randomness
      const minMultiplier = baseMultiplier * (0.85 + Math.random() * 0.1);
      const maxMultiplier = baseMultiplier * (1.15 + Math.random() * 0.1);
      
      const min = Math.round(baseValue * minMultiplier);
      const max = Math.round(baseValue * maxMultiplier);
      
      // Generate 3-5 data points between min and max
      const numPoints = 3 + Math.floor(Math.random() * 3);
      const dataPoints: SalaryPoint[] = [];
      
      // Always include min and max
      dataPoints.push({ value: min, percent: 0, frequency: 0.3 + Math.random() * 0.3 });
      
      // Generate intermediate points
      for (let i = 1; i < numPoints - 1; i++) {
        const percent = i / (numPoints - 1);
        const value = Math.round(min + (max - min) * percent);
        // Add random frequency between 0.3 and 1.0
        dataPoints.push({ 
          value, 
          percent: 0, 
          frequency: 0.3 + Math.random() * 0.7 
        });
      }
      
      dataPoints.push({ value: max, percent: 0, frequency: 0.3 + Math.random() * 0.3 });
      
      // Update global min/max
      if (min < minSalary) minSalary = min;
      if (max > maxSalary) maxSalary = max;
      
      this.salaryRanges.push({
        level,
        min,
        max,
        minPercent: 0, // Will be calculated after finding global max
        maxPercent: 0, // Will be calculated after finding global max
        rangePercent: 0, // Will be calculated after finding global max
        dataPoints
      });
    });
    
    // Round max salary to nearest 10k for better x-axis
    this.maxSalaryValue = Math.ceil(maxSalary / 10000) * 10000;
    
    // Generate x-axis values (0 to maxSalary in steps)
    const numSteps = 5;
    this.xAxisValues = [];
    for (let i = 0; i <= numSteps; i++) {
      this.xAxisValues.push(Math.round((this.maxSalaryValue / numSteps) * i));
    }
    
    // Calculate percentages for positioning
    this.salaryRanges.forEach(range => {
      range.minPercent = (range.min / this.maxSalaryValue) * 100;
      range.maxPercent = (range.max / this.maxSalaryValue) * 100;
      range.rangePercent = range.maxPercent - range.minPercent;
      
      // Update data point percentages
      range.dataPoints.forEach(point => {
        point.percent = (point.value / this.maxSalaryValue) * 100;
      });
    });
    
    // Create reversed copy of salary ranges for display (L7 at top, L1 at bottom)
    this.reversedSalaryRanges = [...this.salaryRanges].reverse();
    
    // Calculate insights (using the middle level as reference)
    const midLevelIndex = Math.floor(this.experienceLevels.length / 2);
    const juniorIndex = 0;
    const seniorIndex = this.experienceLevels.length - 1;
    
    const juniorSalary = this.salaryRanges[juniorIndex].min;
    const seniorSalary = this.salaryRanges[seniorIndex].max;
    
    this.averageSalary = Math.round((juniorSalary + seniorSalary) / 2);
    this.seniorJuniorRatio = parseFloat((seniorSalary / juniorSalary).toFixed(1));
    this.seniorJuniorGrowth = Math.round(((seniorSalary - juniorSalary) / juniorSalary) * 100);
    
    // Country comparison to global average
    const globalAverage = countrySalaries['Global'] * languageMultiplier;
    const countryAverage = baseSalary * languageMultiplier;
    this.countryComparison = Math.round(Math.abs(((countryAverage - globalAverage) / globalAverage) * 100));
    this.countryComparisonDirection = countryAverage > globalAverage ? 'higher' : 'lower';
  }

  formatSalary(amount: number): string {
    if (amount >= 1000) {
      return '$' + (amount / 1000).toFixed(0) + 'k';
    }
    return '$' + amount.toLocaleString();
  }
}