import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VisualizationComponent } from './visualization.component';
import { DataService } from '../../services/data.service';

describe('VisualizationComponent', () => {
  let component: VisualizationComponent;
  let fixture: ComponentFixture<VisualizationComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DataService', ['getCountries', 'getLanguages']);
    
    await TestBed.configureTestingModule({
      imports: [
        VisualizationComponent,
        HttpClientTestingModule
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
    
    fixture = TestBed.createComponent(VisualizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load countries and languages on init', () => {
    expect(dataServiceSpy.getCountries).toHaveBeenCalled();
    expect(dataServiceSpy.getLanguages).toHaveBeenCalled();
    expect(component.availableCountries).toEqual(['United States', 'Canada']);
    expect(component.availableLanguages).toEqual(['JavaScript/TypeScript', 'Python']);
  });

  it('should generate salary data based on selected country and language', () => {
    component.country = 'United States';
    component.language = 'JavaScript/TypeScript';
    component.generateSalaryData();
    
    expect(component.salaryRanges.length).toBeGreaterThan(0);
    expect(component.xAxisValues.length).toBeGreaterThan(0);
    expect(component.reversedSalaryRanges.length).toEqual(component.salaryRanges.length);
  });

  it('should format salary correctly for values over 1000', () => {
    const formattedSalary = component.formatSalary(75000);
    expect(formattedSalary).toBe('$75k');
  });

  it('should format salary correctly for values under 1000', () => {
    const formattedSalary = component.formatSalary(950);
    expect(formattedSalary).toBe('$950');
  });

  it('should respond to changes in inputs', () => {
    spyOn(component, 'generateSalaryData');
    
    component.country = 'Canada';
    component.language = 'Python';
    
    component.ngOnChanges({
      country: { 
        currentValue: 'Canada',
        previousValue: 'United States',
        firstChange: false,
        isFirstChange: () => false
      },
      language: {
        currentValue: 'Python',
        previousValue: 'JavaScript/TypeScript',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    
    expect(component.generateSalaryData).toHaveBeenCalled();
  });
});