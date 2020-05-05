import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {DatePipe} from "@angular/common";
import {BehaviorSubject, from, merge} from "rxjs";
import {filter, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  nazioni = new google.maps.Data();
  regioni = new google.maps.Data();
  province = new google.maps.Data();

  datiStatici;

  data = {
    nazioni: null,
    regioni: null,
    province: null
  }

  nazioniNow;
  regioniNow;
  provinceNow;

  geoStore = this.createGeoStore(null);



  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private datePipe: DatePipe
  ) {}

  // Recuperiamo il Geo
  getGeoById(tipo, id = null) {
    return id ? this[tipo].getFeatureById(id) : null;
  }

  // Store dei dati
  createGeoStore(initialState) {
    const state$ = new BehaviorSubject(initialState);

    const update = value => state$.next(value);

    const filterGeo = date => {
      const dateString = this.date2String(date);
      const dateOldString = this.date2OldString(date);
      // Filtra i dati per tutti i Geo (usare il From e non l'of)
      merge<any>(
        from(this.data.nazioni),
        from(this.data.regioni),
        from(this.data.province)
      ).pipe(
        filter(v =>v.id && (v.dt === dateString || v.dt === dateOldString)),
        map(v => {
          const folder = v.dt === dateString ? 'dataNew' : 'dataOld';
          const {tp: tipo, id, dt, ...data} = v;
          return {tipo, id, [folder]: data};
        }),
      ).subscribe(value   => update(value));
    }

    const setStatici = (folder) => {
      merge<any>(
        from(this.datiStatici.nazioni),
        from(this.datiStatici.regioni),
        from(this.datiStatici.province)
      ).pipe(
        map(value => {
          const {id, tipo, ...others} = value;
          return {tipo, id, [folder]: others};
        }),
      ).subscribe(value   => update(value));
    }

    return {
      getState: ()          => state$.asObservable(),
      filterGeo: (date)     => filterGeo(date),
      setStatici: (folder)  => setStatici(folder),
      update: (value)       => update(value),
    }
  }

  date2String(date, format = null) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  date2OldString(date) {
    const dateOld = new Date(date);
    dateOld.setDate(dateOld.getDate() - 1);
    return this.date2String(dateOld);
  }

}

