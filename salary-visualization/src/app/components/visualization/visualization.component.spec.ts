import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { VisualizationComponent } from './visualization.component';
import { DataService } from '../../services/data.service';

describe('VisualizationComponent', () => {
  let component: VisualizationComponent;
  let fixture: ComponentFixture<VisualizationComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DataService', ['getCountries', 'getLanguages']);
    spy.getCountries.and.returnValue(of(['United States', 'Germany', 'Netherlands']));
    spy.getLanguages.and.returnValue(of(['JavaScript/TypeScript', 'Python', 'Java/Kotlin']));

    await TestBed.configureTestingModule({
      imports: [
        VisualizationComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: DataService, useValue: spy }
      ]
    }).compileComponents();

    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
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
    
    expect(component.availableCountries.length).toBe(3);
    expect(component.availableLanguages.length).toBe(3);
  });

  it('should generate salary data on init', () => {
    expect(component.salaryRanges.length).toBe(7); // 7 experience levels (L1-L7)
    expect(component.reversedSalaryRanges.length).toBe(7);
    
    // Check that the first level is L1
    expect(component.salaryRanges[0].level).toBe('L1');
    
    // Check that the reversed array has L7 first
    expect(component.reversedSalaryRanges[0].level).toBe('L7');
  });

  it('should render the chart intro text with country and language', () => {
    component.country = 'Germany';
    component.language = 'Python';
    fixture.detectChanges();
    
    const introText = fixture.debugElement.query(By.css('.chart-intro')).nativeElement.textContent;
    expect(introText).toContain('Germany');
    expect(introText).toContain('Python');
  });

  it('should render the chart with correct number of levels', () => {
    const levelLines = fixture.debugElement.queryAll(By.css('.level-line'));
    expect(levelLines.length).toBe(7); // 7 experience levels (L1-L7)
  });

  it('should render the x-axis with correct number of labels', () => {
    const xLabels = fixture.debugElement.queryAll(By.css('.x-label'));
    expect(xLabels.length).toBe(6); // 6 labels (0 to max in 5 steps)
  });

  it('should render data points for each level', () => {
    const dataPoints = fixture.debugElement.queryAll(By.css('.data-point'));
    expect(dataPoints.length).toBeGreaterThan(0);
  });

  it('should format salary correctly', () => {
    expect(component.formatSalary(75000)).toBe('$75k');
    expect(component.formatSalary(1000000)).toBe('$1000k');
    expect(component.formatSalary(500)).toBe('$500');
  });

  it('should update data when country input changes', () => {
    const initialData = [...component.salaryRanges];
    
    component.country = 'Germany';
    component.ngOnChanges({
      country: {
        currentValue: 'Germany',
        previousValue: 'United States',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    
    expect(component.salaryRanges).not.toEqual(initialData);
  });

  it('should update data when language input changes', () => {
    const initialData = [...component.salaryRanges];
    
    component.language = 'Python';
    component.ngOnChanges({
      language: {
        currentValue: 'Python',
        previousValue: 'JavaScript/TypeScript',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    
    expect(component.salaryRanges).not.toEqual(initialData);
  });

  it('should render the chart footer with description and note', () => {
    const chartDescription = fixture.debugElement.query(By.css('.chart-description'));
    expect(chartDescription).toBeTruthy();
    expect(chartDescription.nativeElement.textContent).toContain('Developer Ecosystem Survey 2024');
    
    const chartNote = fixture.debugElement.query(By.css('.chart-note'));
    expect(chartNote).toBeTruthy();
    expect(chartNote.nativeElement.textContent).toContain('Experience levels refer to total years');
  });

  it('should calculate insights based on salary ranges', () => {
    // Test the insights calculation indirectly
    expect(component.averageSalary).toBeGreaterThan(0);
    expect(component.seniorJuniorRatio).toBeGreaterThan(1);
    expect(component.seniorJuniorGrowth).toBeGreaterThan(0);
  });

  // Additional tests to improve branch coverage
  it('should handle unknown country with default values', () => {
    component.country = 'Unknown Country';
    component.language = 'JavaScript/TypeScript';
    component.ngOnChanges({
      country: {
        currentValue: 'Unknown Country',
        previousValue: 'United States',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    
    // Should use default base salary
    expect(component.salaryRanges[0].min).toBeGreaterThan(0);
  });

  it('should handle unknown language with default values', () => {
    component.country = 'United States';
    component.language = 'Unknown Language';
    component.ngOnChanges({
      language: {
        currentValue: 'Unknown Language',
        previousValue: 'JavaScript/TypeScript',
        firstChange: false,
        isFirstChange: () => false
      }
    });
    
    // Should use default language multiplier
    expect(component.salaryRanges[0].min).toBeGreaterThan(0);
  });

  it('should handle first change correctly', () => {
    const initialData = [...component.salaryRanges];
    
    component.ngOnChanges({
      country: {
        currentValue: 'Germany',
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    
    // Should still generate data even on first change
    expect(component.salaryRanges.length).toBe(7);
  });

  it('should handle empty changes object', () => {
    const initialData = [...component.salaryRanges];
    
    component.ngOnChanges({});
    
    // Should not throw errors with empty changes
    expect(component.salaryRanges.length).toBe(7);
  });
});