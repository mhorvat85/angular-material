import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class DateRangeValidatorService {
  public datesMustBeValid(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.get('searchHotel')) {
        const formGroup = control.get('searchHotel') as FormGroup;
        var sdCtrl = formGroup.get('checkIn');
        var edCtrl = formGroup.get('checkOut');
      } else {
        var sdCtrl = control.get('checkIn');
        var edCtrl = control.get('checkOut');
      }

      if (!sdCtrl || !edCtrl || !sdCtrl.value || !edCtrl.value) {
        return null;
      }

      const sd = new Date(sdCtrl.value);
      const ed = new Date(edCtrl.value);

      if (ed > sd) {
        sdCtrl.setErrors(null);
        edCtrl.setErrors(null);
        return null;
      }

      if (edCtrl.value) {
        edCtrl.setErrors({ invalidEndDate: true });
      }

      return null;
    };
  }
}
