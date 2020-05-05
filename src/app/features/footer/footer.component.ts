import {Component, OnInit} from '@angular/core';
import {MapService} from "../../core/services/map.service";
import {TabService} from "../../core/services/tab.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit{

  legendDisplayTipo;

  // The min / max values for each bucket and the associated color.
  regioni = [
    {min: 0,		  max: 50,		color: '#008000'},
    {min: 51,		  max: 100,		color: '#9acd32'},
    {min: 101,	  max: 500,		color: '#ffd700'},
    {min: 501,	  max: 1000,	color: '#daa520'},
    {min: 1001,	  max: 5000,	color: '#ff8c00'},
    {min: 5001,	  max: 10000,	color: '#ff0000'},
    {min: 10001,  max: 50000, color: '#8b0000'},
    {min: 50000,	max: null,  color: '#000000'}
  ];
  province = [
    {min: 0,		  max: 9,		  color: '#008000'},
    {min: 10,		  max: 49,		color: '#9acd32'},
    {min: 50,		  max: 99,		color: '#ffd700'},
    {min: 100,	  max: 499,		color: '#daa520'},
    {min: 500,	  max: 999,		color: '#ff8c00'},
    {min: 1000,	  max: 9999,	color: '#ff0000'},
    {min: 10000,	max: null,  color: '#8b0000'}
  ];
  italia = this.regioni;

  constructor(
    private mapService: MapService,
    private tabService: TabService

  ) { }

  ngOnInit(): void {
    this.updateTab();
  }

  // Modifica la Legenda in base al Tab (usa lo stesso osservable del SetMap)
  updateTab(): void {
    this.tabService.getTabStore.getState()
      .subscribe(value => {
        switch (value) {
          case 'italia':
          case 'regioni':
            this.legendDisplayTipo = this.regioni;
            break;
          case 'province':
            this.legendDisplayTipo = this.province;
            break;
        }
      });
  }

}
