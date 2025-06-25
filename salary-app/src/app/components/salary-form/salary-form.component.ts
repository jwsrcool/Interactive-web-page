import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalaryDataService } from '../../services/salary-data.service';

interface FormData {
  country: string;
  language: string;
}

@Component({
  selector: 'app-salary-form',
  templateUrl: './salary-form.component.html',
  imports: [ReactiveFormsModule]
})
export class SalaryFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<FormData>();

  form!: FormGroup;
  countries: string[] = [];
  languages: string[] = [];
  isLoadingLanguages = false;

  private salaryService = inject(SalaryDataService);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    this.loadCountries();
    this.setupCountryChangeHandler();
  }

  private initializeForm() {
    this.form = this.fb.group({
      country: ['', Validators.required],
      language: ['', Validators.required]
    });
  }

  private loadCountries() {
    this.salaryService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  private setupCountryChangeHandler() {
    this.form.get('country')?.valueChanges.subscribe((country) => {
      if (country) {
        this.isLoadingLanguages = true;
        // Disable language control via FormControl instead of template
        this.form.get('language')?.disable();

        this.salaryService.getLanguages(country).subscribe(languages => {
          this.languages = languages;
          this.form.get('language')?.reset();
          this.form.get('language')?.enable(); // Re-enable when data is loaded
          this.isLoadingLanguages = false;
        });
      } else {
        this.languages = [];
        this.form.get('language')?.reset();
        this.form.get('language')?.disable();
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData: FormData = {
        country: this.form.value.country,
        language: this.form.value.language
      };
      this.formSubmitted.emit(formData);
    } else {
      this.form.markAllAsTouched();
    }
  }

  // Getters voor template
  get countryControl() { return this.form.get('country'); }
  get languageControl() { return this.form.get('language'); }
}
