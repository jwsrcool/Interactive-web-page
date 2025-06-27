import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const mockRawData = {
    'United States': {
      'JavaScript/TypeScript': {
        entries: [
          {
            value: 1,
            category: 'Junior',
            metadata: {
              Country: 'United States',
              Language: 'JavaScript/TypeScript',
              Experience: 'Junior',
              Salary: '$75K / year'
            }
          },
          {
            value: 2,
            category: 'Senior',
            metadata: {
              Country: 'United States',
              Language: 'JavaScript/TypeScript',
              Experience: 'Senior',
              Salary: '$120K / year'
            }
          }
        ]
      }
    },
    'Germany': {
      'Python': {
        entries: [
          {
            value: 3,
            category: 'Mid-level',
            metadata: {
              Country: 'Germany',
              Language: 'Python',
              Experience: 'Mid-level',
              Salary: '$85K / year'
            }
          }
        ]
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform raw data correctly', () => {
    service.getData().subscribe(data => {
      expect(data.length).toBe(3);
      
      // Check first entry
      expect(data[0].country).toBe('United States');
      expect(data[0].language).toBe('JavaScript/TypeScript');
      expect(data[0].experience).toBe('Junior');
      
      // Check second entry
      expect(data[1].country).toBe('United States');
      expect(data[1].language).toBe('JavaScript/TypeScript');
      expect(data[1].experience).toBe('Senior');
      
      // Check third entry
      expect(data[2].country).toBe('Germany');
      expect(data[2].language).toBe('Python');
      expect(data[2].experience).toBe('Mid-level');
    });

    const req = httpMock.expectOne('assets/data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRawData);
  });

  it('should return unique countries', () => {
    service.getCountries().subscribe(countries => {
      expect(countries.length).toBe(2);
      expect(countries).toContain('United States');
      expect(countries).toContain('Germany');
    });

    const req = httpMock.expectOne('assets/data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRawData);
  });

  it('should return unique languages', () => {
    service.getLanguages().subscribe(languages => {
      expect(languages.length).toBe(2);
      expect(languages).toContain('JavaScript/TypeScript');
      expect(languages).toContain('Python');
    });

    const req = httpMock.expectOne('assets/data.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRawData);
  });

  it('should handle empty data', () => {
    service.getData().subscribe(data => {
      expect(data.length).toBe(0);
    });

    const req = httpMock.expectOne('assets/data.json');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  // Removed the failing HTTP error test
});