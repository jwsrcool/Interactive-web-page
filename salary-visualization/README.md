# Salary Visualization Application

This Angular application visualizes salary data for developers based on programming language, country, and experience level.

## Project Structure

The application follows a feature-based folder structure for better organization:

```
src/
├── app/
│   ├── core/             # Core functionality and constants
│   │   └── constants/    # Application-wide constants
│   ├── features/         # Feature modules
│   │   ├── salary-calculator/  # Salary calculator feature
│   │   └── visualization/      # Data visualization feature
│   ├── models/           # Shared interfaces and models
│   └── services/         # Shared services
└── assets/
    ├── data.json         # Salary data
    └── images/           # Images used in the application
```

## Features

### Salary Calculator
The salary calculator component allows users to:
- Select a programming language and country
- View calculated salaries based on different experience levels

### Visualization
The visualization component:
- Displays salary ranges based on selected parameters
- Shows data points representing salary distribution
- Provides statistical insights about the selected data

## Core Modules

### Data Service
Provides access to salary data with these main functions:
- `getData()`: Retrieves and transforms raw data
- `getCountries()`: Gets a list of available countries
- `getLanguages()`: Gets a list of available programming languages
- `calculateSalary()`: Calculates a salary based on provided parameters

### Models
The application uses several type-safe interfaces:
- `SalaryData`: Represents processed salary data
- `SalaryDataWithLevel`: Adds experience level to salary data
- `SalaryRange`: Represents a range of salaries for visualization
- `SalaryPoint`: Individual data points for visualization

## Development

### Prerequisites
- Node.js 14+
- Angular CLI 19.2+

### Setup
1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `ng serve` to start the development server
4. Navigate to `http://localhost:4200/`

### Testing
- Run `ng test` to execute the unit tests
- Run `ng test --code-coverage` to generate a code coverage report

### Building
- Run `ng build --configuration=production` for a production build

## Recent Refactoring

The codebase has been refactored to:
- Improve code organization with a feature-based structure
- Centralize constants and type definitions
- Enhance type safety with proper interfaces
- Improve test coverage and test configurations
- Add comprehensive documentation

## License
This project is licensed under the MIT License - see the LICENSE file for details.