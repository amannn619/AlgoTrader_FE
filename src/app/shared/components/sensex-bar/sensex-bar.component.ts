import { Component, Input } from '@angular/core';
import { Sensex } from 'src/app/core/models/sensex.model';
import { SensexService } from 'src/app/core/services/sensex.service';

@Component({
  selector: 'app-sensex-bar',
  templateUrl: './sensex-bar.component.html',
  styleUrls: ['./sensex-bar.component.scss']
})
export class SensexBarComponent {

  sensex!: Sensex;

  constructor(private sensexService: SensexService) { }

  ngOnInit(): void {
    this.sensexService.sensex$.subscribe(sensex => {
      this.sensex = sensex; // update UI
    });
  }

}
