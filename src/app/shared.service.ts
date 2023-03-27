import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {Board} from "./board.model";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private buttonClickSource = new BehaviorSubject<boolean>(false);
  private buttonClickStatsSource = new BehaviorSubject<boolean>(false);
  buttonClickChangeView$ = this.buttonClickSource.asObservable();
  buttonClickStats$ = this.buttonClickStatsSource.asObservable();

  notifyButtonClickChangeView(value:boolean) {
    this.buttonClickSource.next(value);
  }

  notifyOpenStats(value: boolean) {
    this.buttonClickStatsSource.next(value);
  }
}
