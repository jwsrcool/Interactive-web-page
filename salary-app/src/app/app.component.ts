import { Component, inject } from '@angular/core';
import { SalaryFormComponent } from './components/salary-form/salary-form.component';
import { SalaryResultComponent } from './components/salary-result/salary-result.component';
import { SalaryDataService, SalaryEntry } from './services/salary-data.service';

interface FormData {
  country: string;
  language: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    SalaryFormComponent,
    SalaryResultComponent
  ]
})
export class AppComponent {
  filteredSalaries: SalaryEntry[] = [];

  private salaryService = inject(SalaryDataService);

  onFormSubmit(formData: FormData) {
    // console.log('Form submitted:', formData);

    this.salaryService.getSalaries(formData.country, formData.language)
      .subscribe(salaries => {
        this.filteredSalaries = salaries;
        // console.log('Received salaries:', salaries);
      });
  }
}
