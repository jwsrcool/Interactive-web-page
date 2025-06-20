import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryCalculatorComponent } from './components/salary-calculator/salary-calculator.component';
import { VisualizationComponent } from './components/visualization/visualization.component';

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
