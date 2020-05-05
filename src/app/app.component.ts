import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {ApiService} from "./core/http/api.service";
import {MapService} from "./core/services/map.service";
import {CalendarService} from "./core/services/calendar.service";
import {BodyService} from "./core/services/body.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  minDate;
  maxDate;

  constructor(
    private apiService: ApiService,
    private calendarService: CalendarService,
    private mapService: MapService,
    private bodyService: BodyService,
  ) { }

  ngOnInit(): void {
    this.loadGeo();
  }

  loadGeo(): void {
    this.apiService.getAllData({
      datiStatici : '/geo/'   + 'dati_statici',
      geoNazioni  : '/geo/'   + 'nazioni',
      geoRegioni  : '/geo/'   + 'regioni',
      geoProvince : '/geo/'   + 'province_regioni',
      nazioni     : '/data/'  +  environment.prefix1  + 'andamento-nazionale',
      regioni     : '/data/'  +  environment.prefix1  + 'regioni',
      province    : '/data/'  +  environment.prefix1   + 'province',
    }).subscribe(
      ({ datiStatici, geoNazioni, geoRegioni, geoProvince, nazioni, regioni, province}) => {
        this.mapService.province.addGeoJson(geoProvince, {idPropertyName: 'id'});
        this.mapService.regioni.addGeoJson(geoRegioni, {idPropertyName: 'id'});
        this.mapService.nazioni.addGeoJson(geoNazioni, {idPropertyName: 'id'});

        this.mapService.datiStatici = datiStatici;
        this.mapService.data.nazioni = nazioni;
        this.mapService.data.regioni = regioni;
        this.mapService.data.province = province;

        // Aggiorna i Geo con i dati Statici
        this.mapService.geoStore.setStatici('statici');

        // Standard datetime format (supported by all browsers)
        const minDateString = nazioni[0].dt + 'T00:00:00';
        const maxDateString = nazioni.slice(-1)[0].dt + 'T00:00:00';

        this.minDate = new Date(minDateString);
        this.maxDate = new Date(maxDateString);
        const startDate = new Date(maxDateString);

        // Aggiorna la data del Calendario
        this.calendarService.calendarStore.update(startDate);

        // Aggiorna i Geo con la data più recente (ora viene chiamato da: calendarStore.update)
        // this.bodyService.geoStore.update(startDate);

        const nazione = 'Italia';
        const feature = this.mapService.getGeoById('nazioni', nazione);
        this.mapService.nazioniNow = nazione;
        this.bodyService.dataStore.update(feature);
      },
      err => console.error(err),
    )
  }

}
