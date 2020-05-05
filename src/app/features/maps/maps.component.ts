import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {GoogleMap} from "@angular/google-maps";
import MapTypeId = google.maps.MapTypeId;
import {ApiService} from "../../core/http/api.service";
import {MapService} from "../../core/services/map.service";
import {TabService} from "../../core/services/tab.service";
import {BodyService} from "../../core/services/body.service";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements AfterViewInit, OnInit {
  @ViewChild(GoogleMap, {static: true}) map: GoogleMap;

  nazioni = new google.maps.Data();
  regioni = new google.maps.Data();
  province = new google.maps.Data();

  constructor(
  private apiService: ApiService,
  private bodyService: BodyService,
  private mapService: MapService,
  private tabService: TabService
  ) { }

  ngOnInit(): void {
    this.updateGeo();
  }

  ngAfterViewInit(): void {
    this.mapService.regioni.setStyle(this.regioniStyleFeature);
    this.mapService.province.setStyle(this.provinceStyleFeature);

    this.geoFeature('regioni');
    this.geoFeature('province');
    this.mouseClick('province');
    this.mouseClick('regioni');
    this.tab();

  }

  // Aggiorna i GeoJson
  updateGeo(): void {
    this.mapService.geoStore.getState()
      .subscribe(value => {
        // console.log('geoStore', value);
        const geoId = value && value.id ? this.mapService.getGeoById(value.tipo, value.id) : null;
        if (geoId) {
          for (const key in value) {
            geoId.setProperty(key, value[key]);
          }
        }
      });
  }

  tab(): void {
    this.tabService.getTabStore.getState()
      .subscribe(value => {
        // console.log('setMapStore', value);
        this.mapService.regioni.setMap(null);
        this.mapService.province.setMap(null);
        const {regioniNow, provinceNow} = this.mapService;
        switch (value) {
          case 'italia':
            regioniNow ? this.mapService.getGeoById('regioni', regioniNow).setProperty('isColorful', false) : null;
            provinceNow ? this.mapService.getGeoById('province', provinceNow).setProperty('isColorful', false): null;
            this.mapService.regioni.setMap(this.map._googleMap);
            break;
          case 'regioni':
            regioniNow ? this.mapService.getGeoById('regioni', regioniNow).setProperty('isColorful', true) : null;
            this.mapService.regioni.setMap(this.map._googleMap);
            break;
          case 'province':
            provinceNow ? this.mapService.getGeoById('province', provinceNow).setProperty('isColorful', true): null;
            this.mapService.province.setMap(this.map._googleMap);
            break;
        }
      });
  }

  center = {lat: 41.913355, lng: 12.484130};
  zoom = 6;

  display?: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: MapTypeId.ROADMAP,
    mapTypeControl: false,
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 5,
  }

  move(event: google.maps.MouseEvent) {
    this.display = event.latLng.toJSON();
  }


  /*	Color Table:
https://toolset.mrwebmaster.it/html/colori-del-web.html
*/
  regioniStyleFeature(feature) {
    // Destrutturare i dati del giorno scelto
    const dataNew = feature.getProperty('dataNew');
    if (dataNew) {
      const {tot} = dataNew;
      let color;
      let opacity = 0.80;

      switch (true) {
        default:
          color = '#008000';  // Green
          break;
        case tot > 50 && tot < 99:
          color = '#9acd32'; // YellowGreen
          break;
        case tot > 100 && tot < 499:
          color = '#ffd700';  // Gold
          break;
        case tot > 500 && tot < 999:
          color = '#daa520'; // GoldenRod
          break;
        case tot > 1000 && tot < 4999:
          color = '#ff8c00'; // DarkOrange
          break;
        case tot > 5000 && tot < 9999:
          color = '#ff0000'; // Red
          break;
        case tot > 10000 && tot < 49999:
          color = '#8b0000'; // DarkRed
          opacity = 0.90;
          break;
        case tot >= 50000:
          color = '#000000'; // Black
          opacity = 0.90;
          break;
      }
      color = feature.getProperty('isColorful') ? '#186cb8' : color;

      return {
        strokeWeight: 0.75,
        strokeColor: '#00519e',
        zIndex: 1,
        fillColor: color,
        fillOpacity: opacity
      };
    }
  }

  reg_lineStyleFeature(feature) {
    return ({
      strokeWeight: 2.00,
      strokeColor: '#00519e',
      zIndex: 2
    });
  }

  provinceStyleFeature(feature) {
    // Destrutturare i dati covid del giorno scelto
    const dataNew = feature.getProperty('dataNew');
    if (dataNew) {
      const {tot} = dataNew;
      let color;
      switch (true) {
        default:
          color = '#008000';  // Green
          break;
        case tot > 10     && tot < 49:
          color = '#9acd32'; // YellowGreen
          break;
        case tot > 50     && tot < 99:
          color = '#ffd700';  // Gold
          break;
        case tot > 100     && tot < 499:
          color = '#daa520'; // GoldenRod
          break;
        case tot > 500     && tot < 999:
          color = '#ff8c00'; // DarkOrange
          break;
        case tot > 1000     && tot < 2999:
          color = '#ff0000'; // Red
          break;
        case tot >= 3000:
          color = '#8b0000'; // DarkRed
          break;
      }
      color = feature.getProperty('isColorful') ? '#186cb8' : color;
      return {
        strokeWeight: 0.75,
        strokeColor: '#00519e',
        zIndex: 1,
        fillColor: color,
        fillOpacity: 0.80
      };
    }
  }
  geoFeature(tipo) {
    this.mapService[tipo].addListener('mouseover', e => {
      const {feature} = e;
      const tipo = feature.getProperty('tipo');
      // Per le PROVINCE non consideriamo il perimetro della regione di appartenenza
      if (feature.getGeometry().getType() === 'LineString') {
        return;
      }
      this.mapService[tipo].overrideStyle(e.feature, {fillColor: '#186cb8'});

    });

    this.mapService[tipo].addListener('mouseout', e => {
      const {feature} = e;
      const tipo = feature.getProperty('tipo');
      // Per le PROVINCE non consideriamo il perimetro della regione di appartenenza
      if (feature.getGeometry().getType() === 'LineString') {
        return;
      }
      this.mapService[tipo].revertStyle();
    });
  }

  mouseClick(tipo) {
    this.mapService[tipo].addListener('click', e => {
      const {feature} = e;
      // console.log('feature', feature);

      // Per le PROVINCE non consideriamo il perimetro della regione di appartenenza
      if (feature.getGeometry().getType() === 'LineString') {
        return;
      }
      const {regioniNow, provinceNow} = this.mapService;
      regioniNow ? this.mapService.getGeoById('regioni', regioniNow).setProperty('isColorful', false) : null;
      provinceNow ? this.mapService.getGeoById('province', provinceNow).setProperty('isColorful', false): null;
      const id = feature.getId();
      const tipo = feature.getProperty('tipo');
      // console.log('displayData', displayData);
      feature.setProperty('isColorful', true);
      switch (tipo) {
        case 'regioni':
          // Salve il nome della REGIONE e cancella quello della PROVINCIA
          this.mapService.regioniNow = id;
          this.mapService.provinceNow = null;
          break;
        case 'province':
          const regione = feature.getProperty('regione');
          // Salve il nome della PROVINCIA e della REGIONE
          this.mapService.provinceNow = id;
          this.mapService.regioniNow = regione;
          break;
      }
      this.bodyService.dataStore.update(feature);
    });
  }


}
