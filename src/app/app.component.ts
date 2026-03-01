import { Component } from '@angular/core';
import { WebsocketService } from './core/services/websocket.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoading$ = this.loadingService.isLoading$;

  constructor(
    private websocketService: WebsocketService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.websocketService.connect()
  }
}
