import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CardComponent {
  @Input()  math: string;
  @Input()  title: string;
  @Input()  img: string;
  @Input()  key1: string;
  @Input()  value1: string;
  @Input()  key2: string;
  @Input()  value2: string;

  constructor() { }

}
