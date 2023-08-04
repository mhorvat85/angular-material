import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  change = new Subject<any>();

  constructor() {}

  emitValue(value: any) {
    this.change.next(value);
  }
}
