import { Component, Input, computed, signal } from '@angular/core';
import { SalaryEntry } from '../../services/salary-data.service';

@Component({
  selector: 'app-salary-result',
  templateUrl: './salary-result.component.html',
  styleUrls: ['./salary-result.component.css']
})
export class SalaryResultComponent {
  private _entries = signal<SalaryEntry[]>([]);

  @Input() set entries(value: SalaryEntry[]) {
    this._entries.set(value || []);
  }

  get entries() {
    return this._entries();
  }

  readonly values = computed(() => this._entries().map(e => e.value));

  readonly average = computed(() => {
    const vals = this.values();
    if (vals.length === 0) return 0;
    const sum = vals.reduce((a, b) => a + b, 0);
    return Math.round(sum / vals.length);
  });

  readonly count = computed(() => this._entries().length);

  readonly categoryStats = computed(() => {
    const stats = new Map<string, { values: number[], average: number }>();

    this._entries().forEach(entry => {
      if (!stats.has(entry.category)) {
        stats.set(entry.category, { values: [], average: 0 });
      }
      stats.get(entry.category)!.values.push(entry.value);
    });

    // Bereken gemiddelden
    const result = Array.from(stats.entries()).map(([category, data]) => {
      const average = Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length);
      return { category, average, count: data.values.length };
    });

    return result.sort((a, b) => b.average - a.average);
  });

  readonly maxSalary = computed(() => {
    const stats = this.categoryStats();
    return stats.length > 0 ? Math.max(...stats.map(s => s.average)) : 0;
  });
}
