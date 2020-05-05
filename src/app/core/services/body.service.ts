import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {DatePipe} from "@angular/common";
import {BehaviorSubject, from, merge, ReplaySubject, Subject} from "rxjs";
import {Display} from "../../model/data";
import {filter, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BodyService {

  public datiStatici;
  public data: object;
  public nazioni;
  public regioni;
  public province;

  dataStore = this.createDataStore();

  public tabSelect = 'nazioni';

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private datePipe: DatePipe
  ) { }

  // Store dei dati
  createDataStore() {
    const state$ = new Subject<Display>();
    const update = value => {
      // console.log('dataStore', value);
      const displayData = value ? this.getDisplayFromGeo(value) : null;
      state$.next(displayData);
    }
    return {
      getState: () => state$.asObservable(),
      update: (value) => update(value)
    }
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
        from(this.nazioni),
        from(this.regioni),
        from(this.province)
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

  // Setta le Property per i DATI da visualuzzare
  getDisplayFromGeo(feature): Display {
    // console.log('getDisplayFromGeo', feature);
    const tipo = feature.getProperty('tipo');
    const id = feature.getId();
    const regione = tipo === 'regioni' ? id : feature.getProperty('regione');
    const provincia = feature.getProperty('provincia');
    const name = tipo === 'province' ? 'Provincia di ' + provincia : id;
    const statici = feature.getProperty('statici');
    const pop = statici ? statici.popolazione : null;
    const dataNew = feature.getProperty('dataNew');
    const dataOld = feature.getProperty('dataOld');
    const items = this.mappingObj(dataNew, dataOld);
    return {tipo, name, pop, items, regione, provincia};
  }

  mappingObj(obj1, obj2) {
    if (!obj1 || !obj2) {
      return;
    }
    const objSub = this.subObjectsByKey(obj2, obj1);
    // console.log('objSub: ', objSub);
    return [
      {style: 'tot', title: 'Casi compless.',   key1: 'Nuovi',    value1: obj1.nuo,   key2: 'Totale', value2: obj1.tot},
      {style: 'pos', title: 'Positivi',         key1: 'Variaz.',  value1: obj1.var,   key2: 'Totale', value2: obj1.pos},
      {style: 'tam', title: 'Tamponi',          key1: 'Nuovi',    value1: objSub.tam, key2: 'Totale', value2: obj1.tam},
      {style: 'iso', title: 'Isolamento',       key1: 'Variaz.',  value1: objSub.iso, key2: 'Totale', value2: obj1.iso},
      {style: 'ric', title: 'Ricoverati',       key1: 'Variaz.',  value1: objSub.ric, key2: 'Totale', value2: obj1.ric},
      {style: 'ter', title: 'Terapia',          key1: 'Variaz.',  value1: objSub.ter, key2: 'Totale', value2: obj1.ter},
      {style: 'gua', title: 'Guariti',          key1: 'Nuovi',    value1: objSub.gua, key2: 'Totale', value2: obj1.gua},
      {style: 'dec', title: 'Deceduti',         key1: 'Nuovi',    value1: objSub.dec, key2: 'Totale', value2: obj1.dec},
    ];
  }

  // Eseguire la differenza fra i dati degli oggetti
  subObjectsByKey(...objs) {
    return objs.reduce((a, b) => {
      for (const k in b) {
        if (b.hasOwnProperty(k)) {
          a[k] = (b[k]) - (a[k] || 0);
        }
      }
      return a;
    }, {});
  }
}
