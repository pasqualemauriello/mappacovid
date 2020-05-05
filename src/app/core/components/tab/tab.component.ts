import {Component, Input, OnInit} from '@angular/core';
import {MatTabChangeEvent} from "@angular/material/tabs";
import {MapService} from "../../services/map.service";
import {TabService} from "../../services/tab.service";
import {CalendarService} from "../../services/calendar.service";
import {BodyService} from "../../services/body.service";

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  @Input()  bricNazione: string;
  @Input()  bricRegione: string;
  @Input()  bricProvincia: string;

  tabId: number;
  legendDisplayTipo;

  constructor(
    private calendarService: CalendarService,
    private bodyService: BodyService,
    private mapService: MapService,
    private tabService: TabService
  ) { }

  ngOnInit(): void {
    this.bricNazione = 'Italia';
    this.legendDisplayTipo = 'regioni';
    this.setTab();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    let tabSelect = tabChangeEvent.tab.textLabel.toLowerCase();
    // Setta la Legenda
    this.legendDisplayTipo = tabSelect;
    this.tabService.getTabStore.update(tabSelect);
    this.setObjFromTabSelect(tabSelect);
  }

  // Aggiorna il DISPLAY in base al Tab selezionato e al GEO selezionato (se attivo)
  setObjFromTabSelect(tabSelect): void {
    tabSelect = tabSelect === 'italia' ? 'nazioni' : tabSelect;
    // Salva il tabSelect per utilizzarlo col Calendario
    this.bodyService.tabSelect = tabSelect;
    const geoNow = this.mapService[tabSelect + 'Now'];
    if (geoNow) {
      const feature = this.mapService.getGeoById(tabSelect, geoNow);
      this.bodyService.dataStore.update(feature);
    } else {
      this.bodyService.dataStore.update(null);
    }
  }

  // Setta come attivo il Tab specificato
  setTab(): void {
    this.tabService.setTabStore.getState()
      .subscribe(value => {
        switch (value) {
          case 'italia':
            this.tabId = 0;
            break;
          case 'regioni':
            this.tabId = 1;
            break;
          case 'province':
            this.tabId = 2;
            break;
        }
      });
  }

}
