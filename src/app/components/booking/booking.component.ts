import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, tap, switchMap, startWith, map, take, mergeMap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { City } from 'src/app/models/city';
import { CitiesService } from 'src/app/services/cities.service';
import { Hotel } from 'src/app/models/hotel';
import { HotelsService } from 'src/app/services/hotels.service';
import { RoomType } from 'src/app/models/room-type';
import { RoomTypesService } from 'src/app/services/room-types.service';
import { Food } from 'src/app/models/food';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CountriesService } from 'src/app/services/countries.service';
import { Country } from 'src/app/models/country';
import { MatStepper } from '@angular/material/stepper';
import { BookingsService } from 'src/app/services/bookings.service';
import { SharedService } from 'src/app/services/shared.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatepickerDropdownPositionX } from '@angular/material/datepicker';
import { DateRangeValidatorService } from 'src/app/services/date-range-validator.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit, OnDestroy {
  formGroup: FormGroup | any;
  cities: City[] = [];
  hotels!: Observable<Hotel[]>;
  roomTypes!: Observable<RoomType[]>;
  countries!: Observable<Country[]>;
  isCitiesLoading: boolean = false;

  minAdults: number = 1;
  maxAdults: number = 2;
  minChildren: number = 0;
  maxChildren: number = 2;

  allDineIn: any[] = [
    { id: 1, dineInName: 'Breakfast' },
    { id: 2, dineInName: 'Lunch' },
    { id: 3, dineInName: 'Dinner' },
  ];

  allFoods: Food[] = [
    { name: 'Fries' },
    { name: 'Burger' },
    { name: 'Gulash' },
    { name: 'Spaghetti' },
    { name: 'Fish' },
    { name: 'Pizza' },
  ];

  foods: Food[] = [];

  filteredFoods: Observable<Food[]>;

  @ViewChild('foodInput') foodInput!: ElementRef<HTMLInputElement>;

  separatorKeyCodes: number[] = [ENTER, COMMA];

  minDate: Date = new Date();
  startDate: Date = new Date('1985-12-22');
  @Input() end: DatepickerDropdownPositionX = 'end';

  @ViewChild('stepper') stepper!: MatStepper;

  subscription_1: Subscription;
  subscription_2!: Subscription;

  largeSize: boolean = false;

  constructor(
    private citiesService: CitiesService,
    private hotelsService: HotelsService,
    private roomTypesService: RoomTypesService,
    private countriesService: CountriesService,
    private bookingsService: BookingsService,
    private sharedService: SharedService,
    private responsive: BreakpointObserver,
    private dateValidator: DateRangeValidatorService
  ) {
    this.subscription_1 = this.responsive.observe(Breakpoints.Large).subscribe((result) => {
      if (result.matches) {
        this.largeSize = result.matches;
      } else {
        this.largeSize = result.matches;
      }
    });

    this.formGroup = new FormGroup(
      {
        searchHotel: new FormGroup({
          city: new FormControl(null, [Validators.required]),
          checkIn: new FormControl(null, [Validators.required]),
          checkOut: new FormControl(null, [Validators.required]),
          adults: new FormControl(1, [Validators.min(1)]),
          children: new FormControl(0, [Validators.min(0)]),
        }),

        chooseHotel: new FormGroup({
          hotel: new FormControl(null, [Validators.required]),
        }),

        chooseRoom: new FormGroup({
          roomType: new FormControl(null, Validators.required),
          allDineIn: new FormControl(false),
          dineIn: new FormArray([]),
          foods: new FormControl(null),
          extraBed: new FormControl(false),
        }),

        personalInformation: new FormGroup({
          customerName: new FormControl(null, [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern('^[A-Za-z. ]*$'),
          ]),
          country: new FormControl(null, Validators.required),
          phone: new FormControl(null),
          dateOfBirth: new FormControl(null),
          gender: new FormControl(null),
        }),

        guestsInformation: new FormGroup({
          guest1Name: new FormControl(null, Validators.required),
          guest1Age: new FormControl(null),
          guest1Gender: new FormControl(null),
          guest2Name: new FormControl(null),
          guest2Age: new FormControl(null),
          guest2Gender: new FormControl(null),
        }),

        payment: new FormGroup({
          creditCardNumber: new FormControl(null, Validators.required),
          cvv: new FormControl(null, Validators.required),
          giftCardNumber: new FormControl(null),
        }),
      },
      {
        validators: [this.dateValidator.datesMustBeValid()],
        updateOn: 'change',
      }
    );

    this.allDineIn.forEach(() => {
      this.dineInFormArray.push(new FormControl(false));
    });

    this.filteredFoods = this.getFormControl('chooseRoom.foods').valueChanges.pipe(
      startWith(''),
      map((food: string) => {
        return food && typeof food === 'string'
          ? this.allFoods.filter((af) => af.name.toLowerCase().indexOf(food.toLowerCase()) == 0)
          : this.allFoods.filter((af) => !this.foods.find((f) => af.name === f.name));
      })
    );
  }

  ngOnInit(): void {
    this.subscription_2 = this.getFormControl('searchHotel.city')
      .valueChanges.pipe(
        debounceTime(500),

        tap(() => {
          this.isCitiesLoading = true;
        }),
        //startWith: selectable on click
        startWith(''),
        switchMap((value) => this.citiesService.getCities(value))
      )
      .subscribe({
        next: (response: City[]) => {
          this.cities = response;
          this.isCitiesLoading = false;
        },

        error: (error) => {
          console.log(error);
          this.isCitiesLoading = false;
        },
      });

    this.roomTypes = this.roomTypesService.getRoomTypes();

    this.countries = this.countriesService.getCountries();

    setTimeout(() => {
      this.stepper.reset();
    }, 200);
  }

  get dineInFormArray(): FormArray {
    return this.formGroup.get('chooseRoom.dineIn') as FormArray;
  }

  convertStartDate(event: any) {
    let newDate = event.value;
    newDate = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);
    this.getFormControl('searchHotel').patchValue({ checkIn: newDate });
  }

  convertEndDate(event: any) {
    if (event.value) {
      let newDate = event.value;
      newDate = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);
      this.getFormControl('searchHotel').patchValue({ checkOut: newDate });
    }
  }

  increaseAdults() {
    if (this.formGroup.value.searchHotel.adults < this.maxAdults) {
      this.getFormControl('searchHotel').patchValue({
        adults: this.formGroup.value.searchHotel.adults + 1,
      });
    }
  }

  decreaseAdults() {
    if (this.formGroup.value.searchHotel.adults > this.minAdults) {
      this.getFormControl('searchHotel').patchValue({
        adults: this.formGroup.value.searchHotel.adults - 1,
      });
    }
  }

  increaseChildren() {
    if (this.formGroup.value.searchHotel.children < this.maxChildren) {
      this.getFormControl('searchHotel').patchValue({
        children: this.formGroup.value.searchHotel.children + 1,
      });
    }
  }

  decreaseChildren() {
    if (this.formGroup.value.searchHotel.children > this.minChildren) {
      this.getFormControl('searchHotel').patchValue({
        children: this.formGroup.value.searchHotel.children - 1,
      });
    }
  }

  searchHotels() {
    this.hotels = this.hotelsService.getHotelsByLocation(this.getFormControl('searchHotel.city').value);
  }

  chooseHotel(hotel: Hotel) {
    this.getFormControl('chooseHotel').patchValue({
      hotel: hotel.hotelName,
    });
    setTimeout(() => {
      this.stepper.next();
    });
  }

  isAllDineInSelected() {
    return this.dineInFormArray.value.every((val: any) => val == true);
  }

  isNoDineInSelected() {
    return this.dineInFormArray.value.every((val: any) => val == false);
  }

  onAllDineInCheckBoxChange() {
    this.dineInFormArray.controls.forEach((dineIn, index) => {
      this.dineInFormArray.at(index).patchValue(this.getFormControl('chooseRoom.allDineIn').value);
    });
  }

  onDineInChange() {
    if (this.isAllDineInSelected()) {
      this.getFormControl('chooseRoom').patchValue({ allDineIn: true });
    } else {
      this.getFormControl('chooseRoom').patchValue({ allDineIn: false });
    }
  }

  getFormControl(controlName: string): FormControl {
    return this.formGroup.get(controlName) as FormControl;
  }

  add(event: MatChipInputEvent): void {
    if ((event.value || '').trim()) {
      this.foods.push({ name: event.value.trim() });
    }

    this.getFormControl('chooseRoom').patchValue({ foods: this.foods });
    this.foodInput.nativeElement.value = '';
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.foods.push({ name: event.option.viewValue });

    this.getFormControl('chooseRoom').patchValue({ foods: this.foods });
    this.foodInput.nativeElement.value = '';
  }

  remove(food: Food): void {
    let index = this.foods.indexOf(food);

    if (index >= 0) {
      this.foods.splice(index, 1);
    }

    this.getFormControl('chooseRoom').patchValue({ foods: this.foods });
  }

  onFinishClick() {
    let booking = {
      ...this.formGroup.value.searchHotel,
      ...this.formGroup.value.chooseHotel,
      ...this.formGroup.value.chooseRoom,
      ...this.formGroup.value.personalInformation,
      ...this.formGroup.value.guestsInformation,
      ...this.formGroup.value.payment,
      status: 'Not Paid',
      isArchived: false,
      isNotified: false,
    };

    this.bookingsService
      .postBooking(booking)
      .pipe(
        take(1),
        mergeMap(() => this.bookingsService.getBookings())
      )
      .subscribe({
        next: (response) => {
          this.sharedService.emitValue(response[response.length - 1]);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getErrorMessage(controlName: string, errorType: string): string {
    let errorMessage: string = '';
    switch (controlName) {
      case 'city': {
        if (errorType == 'required') errorMessage = 'You must choose a <strong>City</strong>';
        break;
      }

      case 'checkIn': {
        if (errorType == 'required') errorMessage = 'You must enter a <strong>Check-In Date</strong>';
        break;
      }

      case 'checkOut': {
        if (errorType == 'required') errorMessage = 'You must enter a <strong>Check-Out Date</strong>';
        else if (errorType == 'invalidEndDate') errorMessage = 'End Date cannot be equal to Start Date';
        break;
      }

      case 'customerName': {
        if (errorType == 'required') errorMessage = 'You must specify a <strong>Name</strong>';
        else if (errorType == 'maxlength') errorMessage = '<strong>Name</strong> can contain up to 30 characters only';
        else if (errorType == 'pattern')
          errorMessage = '<strong>Name</strong> can contain alphabets or dot (.) or space only';
        break;
      }

      case 'country': {
        if (errorType == 'required') errorMessage = 'You must choose a <strong>Country</strong>';
        break;
      }
    }

    return errorMessage;
  }

  ngOnDestroy(): void {
    this.subscription_1.unsubscribe();
    this.subscription_2.unsubscribe();
  }
}
