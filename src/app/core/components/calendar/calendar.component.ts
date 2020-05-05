import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {FormControl} from '@angular/forms';
import {fromEvent, merge} from 'rxjs';
import {mapTo} from 'rxjs/operators';
import {CalendarService} from "../../services/calendar.service";
import {MapService} from "../../services/map.service";
import {BodyService} from "../../services/body.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  @Input()  math: string;
  @Input()  minDate: Date;
  @Input()  maxDate: Date;
  formControlDate: FormControl;

  disabledNext = true;
  disabledPrev = false;

  constructor(
    private calendarService: CalendarService,
    private bodyService: BodyService,
    private mapService: MapService,
  ) { }

  ngOnInit(): void {
    // Va instanziato il formControl altrimenti da errore
    this.formControlDate = new FormControl();

    this.updateDate();
    this.setPeriod();
  }

  currentPeriodClicked(event: MatDatepickerInputEvent<Date>) {
    // console.log('currentPeriodClicked', event.value);
    this.calendarService.calendarStore.update(event.value);
  }

  updateDate(): void {
    this.calendarService.calendarStore.getState()
      .subscribe(date => {
        if (date) {
          // Aggiorna i Geo con la data più recente
          this.mapService.geoStore.filterGeo(date);

          this.formControlDate = new FormControl(date);
          if (!this.maxDate || date >= this.maxDate) {
            this.disabledNext = true;
          } else {
            this.disabledNext = false;
          }

          if (date <= this.minDate) {
            this.disabledPrev = true;
          } else {
            this.disabledPrev = false;
          }

          const tabSelect = this.bodyService.tabSelect;
          const geoNow = this.mapService[tabSelect + 'Now'];
          if (geoNow) {
            const feature = this.mapService.getGeoById(tabSelect, geoNow);
            this.bodyService.dataStore.update(feature);
          } else {
            this.bodyService.dataStore.update(null);
          }
        }
      });
  }
  setPeriod() {
    merge(
      fromEvent(document.querySelector('#minDate'), 'click').pipe(mapTo('minDate')),
      fromEvent(document.querySelector('#decrementDate'), 'click').pipe(mapTo('decrementDate')),
      fromEvent(document.querySelector('#incrementDate'), 'click').pipe(mapTo('incrementDate')),
      fromEvent(document.querySelector('#maxDate'), 'click').pipe(mapTo('maxDate')),
    ).subscribe(value => {
      // console.log('period', value);
      switch (value) {
        case 'minDate':
          this.calendarService.calendarStore.update(new Date(this.minDate));
          break;
        case 'decrementDate':
          this.calendarService.calendarStore.decrementDate();
          break;
        case 'incrementDate':
          this.calendarService.calendarStore.incrementDate();
          break;
        case 'maxDate':
          this.calendarService.calendarStore.update(new Date(this.maxDate));
          break;
      }
    });
  }
}
