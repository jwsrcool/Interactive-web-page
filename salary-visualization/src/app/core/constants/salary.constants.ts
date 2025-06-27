/**
 * Base salary values by country
 */
export const COUNTRY_SALARIES: Record<string, number> = {
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

/**
 * Multiplier values for different programming languages
 */
export const LANGUAGE_MULTIPLIERS: Record<string, number> = {
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

/**
 * Multiplier values for different experience levels
 */
export const EXPERIENCE_MULTIPLIERS: Record<string, number> = {
  'Junior': 0.7,
  'Mid-level': 1.0,
  'Senior': 1.4,
  'Lead': 1.7,
  'Architect': 2.0
};

/**
 * Experience levels used in the application
 */
export const EXPERIENCE_LEVELS: string[] = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Architect'];

/**
 * Visualization levels used in the application
 */
export const VISUALIZATION_LEVELS: string[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];