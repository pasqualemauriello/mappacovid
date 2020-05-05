import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class TabService {

  getTabStore = this.createGetTabStore('regioni');
  setTabStore = this.createSetTabStore(0);

  createGetTabStore(initialState) {
    const state$ = new BehaviorSubject(initialState);
    const update = value => {
      state$.next(value);
    }
    return {
      getState: () => state$.asObservable(),
      update: (value) => update(value)
    }
  }

  createSetTabStore(initialState) {
    const state$ = new BehaviorSubject(initialState);
    const update = value => {
      state$.next(value);
    }
    return {
      getState: () => state$.asObservable(),
      update: (value) => update(value)
    }
  }

}
