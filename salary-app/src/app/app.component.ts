import { Component, inject } from '@angular/core';

import { SalaryFormComponent } from './components/salary-form/salary-form.component';
import { SalaryResultComponent } from './components/salary-result/salary-result.component';
import { SalaryDataService } from './services/salary-data.service';

@Component({
  selector: 'app-root',
  imports: [ SalaryFormComponent, SalaryResultComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'salary-app';
  filteredSalaries: number[] = [];
  private salaryDataService: SalaryDataService = inject(SalaryDataService);


  onFormSubmit(selection: { country: string; language: string; experience: string }) {
    console.log('Form selection received:', selection);
    this.salaryDataService
      .getSalaries(selection.country, selection.language)
      .subscribe((salaries) => {
        console.log('Salaries fetched:', salaries);
        this.filteredSalaries = salaries;
      });
  }

}
