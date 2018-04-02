import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { Shrink } from '../../models/shrink.model';
import { SET_SHRINK_URL } from '../../constants/urls';
import { ValidationService } from '../validation/validation.service';

@Injectable()
export class ShrinkService {

  constructor(
    private http: HttpClient,
    private validationService: ValidationService
  ) { }

  setShrink(shrink: Shrink): any {
    const fd = this.validationService.getFormDataFromObject(shrink);

    const req = new HttpRequest('POST', SET_SHRINK_URL, fd, {
      reportProgress: true
    });
    return this.http.request(req);
  }
}
