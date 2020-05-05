import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  calendarStore = this.createCalendarStore(null);

  constructor() { }

  createCalendarStore(initialState) {
    const state$ = new BehaviorSubject(initialState);
    const update = date => {
      // Filtra i dati per tutti i Geo (usare il From e non l'of)
      state$.next(date);
    }
    const decrementDate = () => {
      const dt = state$.getValue();
      dt.setDate(dt.getDate() - 1);
      update(dt);
    }
    const incrementDate = () => {
      const dt = state$.getValue()
      dt.setDate(dt.getDate() + 1);
      update(dt);
    }
    return {
      getState: () => state$.asObservable(),
      update: (date)    => update(date),
      incrementDate: () => incrementDate(),
      decrementDate: () => decrementDate()
    }
  }

}
