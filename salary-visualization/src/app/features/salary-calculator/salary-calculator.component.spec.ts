import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { SalaryCalculatorComponent } from './salary-calculator.component';
import { DataService } from '../../services/data.service';

describe('SalaryCalculatorComponent', () => {
  let component: SalaryCalculatorComponent;
  let fixture: ComponentFixture<SalaryCalculatorComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DataService', ['getCountries', 'getLanguages']);
    
    await TestBed.configureTestingModule({
      imports: [
        SalaryCalculatorComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: DataService, useValue: spy }
      ]
    })
    .compileComponents();

    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    
    // Set up spy return values
    dataServiceSpy.getCountries.and.returnValue(of(['United States', 'Canada']));
    dataServiceSpy.getLanguages.and.returnValue(of(['JavaScript/TypeScript', 'Python']));
    
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
    expect(component.countries).toEqual(['United States', 'Canada']);
    expect(component.languages).toEqual(['JavaScript/TypeScript', 'Python']);
  });

  it('should calculate salaries when both country and language are selected', () => {
    component.selectedCountry = 'United States';
    component.selectedLanguage = 'JavaScript/TypeScript';
    component.calculateSalaries();
    
    expect(component.calculatedSalaries.length).toBeGreaterThan(0);
    expect(component.calculatedSalaries[0].salary).toBeGreaterThan(0);
  });

  it('should not calculate salaries when country or language is missing', () => {
    component.selectedCountry = '';
    component.selectedLanguage = 'JavaScript/TypeScript';
    component.calculateSalaries();
    
    expect(component.calculatedSalaries.length).toBe(0);
  });

  it('should format salary correctly', () => {
    const formattedSalary = component.formatSalary(123456);
    expect(formattedSalary).toBe('$123,456');
  });
});