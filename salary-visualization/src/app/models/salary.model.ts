/**
 * Interface for raw data entry from data.json
 */
export interface RawDataEntry {
  value: number;
  category: string;
  metadata: {
    Country: string;
    Language: string;
    Experience: string;
    Salary: string;
  };
}

/**
 * Interface for the structure of the raw data from data.json
 */
export interface RawData {
  [country: string]: {
    [language: string]: {
      entries: RawDataEntry[];
    };
  };
}

/**
 * Interface for the processed salary data
 */
export interface SalaryData {
  country: string;
  language: string;
  experience: string;
  salary: number;
}

/**
 * Interface for salary data with level used in components
 */
export interface SalaryDataWithLevel {
  level: string;
  salary: number;
  percentage: number;
}

/**
 * Interface for a single data point in the salary visualization
 */
export interface SalaryPoint {
  value: number;
  percent: number;
  frequency: number; // Value between 0.3 and 1.0 to represent frequency
}

/**
 * Interface for salary range data used in visualization
 */
export interface SalaryRange {
  level: string;
  min: number;
  max: number;
  minPercent: number;
  maxPercent: number;
  rangePercent: number;
  dataPoints: SalaryPoint[];
}