import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { SalaryCalculatorComponent } from './salary-calculator.component';
import { DataService } from '../../services/data.service';

describe('SalaryCalculatorComponent', () => {
  let component: SalaryCalculatorComponent;
  let fixture: ComponentFixture<SalaryCalculatorComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DataService', ['getCountries', 'getLanguages']);
    spy.getCountries.and.returnValue(of(['United States', 'Germany', 'Netherlands']));
    spy.getLanguages.and.returnValue(of(['JavaScript/TypeScript', 'Python', 'Java/Kotlin']));

    await TestBed.configureTestingModule({
      imports: [
        SalaryCalculatorComponent,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: DataService, useValue: spy }
      ]
    }).compileComponents();

    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    fixture = TestBed.createComponent(SalaryCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load countries and languages on init', () => {
    expect(dataServiceSpy.getCountries).toHaveBeenCalled();
    expect(dataServiceSpy.getLanguages).toHaveBeenCalled();
    
    expect(component.countries.length).toBe(3);
    expect(component.languages.length).toBe(3);
  });

  it('should render country and language dropdowns', () => {
    const countrySelect = fixture.debugElement.query(By.css('#country'));
    const languageSelect = fixture.debugElement.query(By.css('#language'));
    
    expect(countrySelect).toBeTruthy();
    expect(languageSelect).toBeTruthy();
    
    // Check for placeholder options
    const countryOptions = countrySelect.queryAll(By.css('option'));
    const languageOptions = languageSelect.queryAll(By.css('option'));
    
    expect(countryOptions.length).toBe(4); // 3 countries + placeholder
    expect(languageOptions.length).toBe(4); // 3 languages + placeholder
    
    // Check placeholder text
    expect(countryOptions[0].nativeElement.textContent).toContain('Choose a country');
    expect(languageOptions[0].nativeElement.textContent).toContain('Choose a language');
  });

  it('should not calculate salaries when country or language is not selected', () => {
    component.calculateSalaries();
    expect(component.calculatedSalaries.length).toBe(0);
    
    component.selectedCountry = 'United States';
    component.calculateSalaries();
    expect(component.calculatedSalaries.length).toBe(0);
    
    component.selectedCountry = '';
    component.selectedLanguage = 'JavaScript/TypeScript';
    component.calculateSalaries();
    expect(component.calculatedSalaries.length).toBe(0);
  });

  it('should calculate salaries when both country and language are selected', () => {
    component.selectedCountry = 'United States';
    component.selectedLanguage = 'JavaScript/TypeScript';
    component.calculateSalaries();
    
    expect(component.calculatedSalaries.length).toBe(5); // 5 experience levels
    
    // Check salary calculation for Junior level
    const juniorSalary = component.calculatedSalaries.find(s => s.level === 'Junior');
    expect(juniorSalary).toBeTruthy();
    expect(juniorSalary?.salary).toBe(63000); // 90000 * 1.0 * 0.7
    
    // Check salary calculation for Senior level
    const seniorSalary = component.calculatedSalaries.find(s => s.level === 'Senior');
    expect(seniorSalary).toBeTruthy();
    expect(seniorSalary?.salary).toBe(126000); // 90000 * 1.0 * 1.4
  });

  it('should format salary correctly', () => {
    expect(component.formatSalary(75000)).toBe('$75,000');
    expect(component.formatSalary(1000000)).toBe('$1,000,000');
    expect(component.formatSalary(0)).toBe('$0');
  });

  it('should handle country change', () => {
    // Simulate selecting a country
    const countrySelect = fixture.debugElement.query(By.css('#country'));
    countrySelect.nativeElement.value = 'Germany';
    countrySelect.nativeElement.dispatchEvent(new Event('change'));
    
    expect(component.selectedCountry).toBe('Germany');
  });

  it('should handle language change', () => {
    // Simulate selecting a language
    const languageSelect = fixture.debugElement.query(By.css('#language'));
    languageSelect.nativeElement.value = 'Python';
    languageSelect.nativeElement.dispatchEvent(new Event('change'));
    
    expect(component.selectedLanguage).toBe('Python');
  });

  it('should use default values when country or language is not in the predefined lists', () => {
    component.selectedCountry = 'Unknown Country';
    component.selectedLanguage = 'JavaScript/TypeScript';
    component.calculateSalaries();
    
    // Should use default base salary of 70000
    const juniorSalary = component.calculatedSalaries.find(s => s.level === 'Junior');
    expect(juniorSalary?.salary).toBe(49000); // 70000 * 1.0 * 0.7
    
    component.selectedCountry = 'United States';
    component.selectedLanguage = 'Unknown Language';
    component.calculateSalaries();
    
    // Should use default language multiplier of 1.0
    const seniorSalary = component.calculatedSalaries.find(s => s.level === 'Senior');
    expect(seniorSalary?.salary).toBe(126000); // 90000 * 1.0 * 1.4
  });

  // Additional tests to improve branch coverage
  it('should handle unknown experience level with default multiplier', () => {
    // Modify the experienceLevels array to include an unknown level
    component.experienceLevels = [...component.experienceLevels, 'Unknown Level'];
    
    component.selectedCountry = 'United States';
    component.selectedLanguage = 'JavaScript/TypeScript';
    component.calculateSalaries();
    
    // Should use default experience multiplier of 1.0 for unknown level
    const unknownSalary = component.calculatedSalaries.find(s => s.level === 'Unknown Level');
    expect(unknownSalary).toBeTruthy();
    expect(unknownSalary?.salary).toBe(90000); // 90000 * 1.0 * 1.0
  });

  it('should handle both unknown country and language', () => {
    component.selectedCountry = 'Unknown Country';
    component.selectedLanguage = 'Unknown Language';
    component.calculateSalaries();
    
    // Should use default base salary and language multiplier
    const juniorSalary = component.calculatedSalaries.find(s => s.level === 'Junior');
    expect(juniorSalary?.salary).toBe(49000); // 70000 * 1.0 * 0.7
  });

  it('should handle empty experienceLevels array', () => {
    // Temporarily empty the experienceLevels array
    const originalLevels = [...component.experienceLevels];
    component.experienceLevels = [];
    
    component.selectedCountry = 'United States';
    component.selectedLanguage = 'JavaScript/TypeScript';
    component.calculateSalaries();
    
    // Should result in empty calculatedSalaries
    expect(component.calculatedSalaries.length).toBe(0);
    
    // Restore original levels
    component.experienceLevels = originalLevels;
  });
});