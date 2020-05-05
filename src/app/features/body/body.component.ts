import {Component, ViewEncapsulation, Input, OnInit, NgZone} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MapService} from "../../core/services/map.service";
import {TabService} from "../../core/services/tab.service";
import {BodyService} from "../../core/services/body.service";
import {Display} from "../../model/data";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class BodyComponent implements OnInit {

  dataName: string;
  dataPop: number;
  dataItems: any[];

  data: Display;

  bricNazione = 'Italia';
  bricRegione: string;
  bricProvincia: string;
  taber;

  @Input()  minDate: Date;
  @Input()  maxDate: Date;
  @Input()  formControlDate: FormControl;

  constructor(
    private bodyService: BodyService,
    private mapService: MapService,
    private tabService: TabService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // subscribe to home component messages

    this.subb();

  }

  subb(): void {
    // subscribe to home component messages

    this.bodyService.dataStore.getState()
      .subscribe(value => {
        // Sposta il Tab su "Regioni" quando si clicca una regione sulla mappa
        this.ngZone.run( () => {
          if (value) {
            this.data = value;
            this.dataName = value.name;
            this.dataPop = value.pop;
            this.dataItems = value.items;
            this.tabService.setTabStore.update(value.tipo);
            this.bricRegione = value.regione;
            this.bricProvincia = value.provincia;
          } else {
            // cancella l'array quando riceve un obj vuoto
            this.data = null;
            this.dataPop = null;
            this.dataItems = [];
          }
        });
      });

  }
}
