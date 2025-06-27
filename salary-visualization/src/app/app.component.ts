import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryCalculatorComponent } from './features/salary-calculator/salary-calculator.component';
import { VisualizationComponent } from './features/visualization/visualization.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SalaryCalculatorComponent, VisualizationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'salary-visualization';
}