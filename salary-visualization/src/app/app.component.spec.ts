import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { SalaryCalculatorComponent } from './components/salary-calculator/salary-calculator.component';
import { VisualizationComponent } from './components/visualization/visualization.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA] // To ignore child components for isolated testing
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title', () => {
    expect(component.title).toEqual('salary-visualization');
  });

  it('should render the app container', () => {
    const appContainer = fixture.debugElement.query(By.css('.app-container'));
    expect(appContainer).toBeTruthy();
  });

  it('should render the background SVG', () => {
    const backgroundSvg = fixture.debugElement.query(By.css('.background-svg'));
    expect(backgroundSvg).toBeTruthy();

    const img = backgroundSvg.query(By.css('img'));
    expect(img).toBeTruthy();
    expect(img.attributes['src']).toContain('spirital-7a69e459de5e1b6afeb560734ebeffc4.svg');
  });

  it('should render the intro section', () => {
    const intro = fixture.debugElement.query(By.css('.intro'));
    expect(intro).toBeTruthy();

    const heading = intro.query(By.css('h1'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toContain('IT Salary Calculator');
  });

  it('should render the layout container', () => {
    const layoutContainer = fixture.debugElement.query(By.css('.layout-container'));
    expect(layoutContainer).toBeTruthy();
  });

  it('should include the salary calculator component', () => {
    const calculatorSelector = fixture.debugElement.query(By.css('app-salary-calculator'));
    expect(calculatorSelector).toBeTruthy();
  });

  it('should include the visualization component', () => {
    const visualizationSelector = fixture.debugElement.query(By.css('app-visualization'));
    expect(visualizationSelector).toBeTruthy();
  });
});
