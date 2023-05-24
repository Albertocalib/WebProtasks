import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private buttonClickSource = new BehaviorSubject<string>("");
  private buttonClickStatsSource = new BehaviorSubject<boolean>(false);
  buttonClickChangeView$ = this.buttonClickSource.asObservable();
  buttonClickStats$ = this.buttonClickStatsSource.asObservable();

  notifyButtonClickChangeView(value:string) {
    this.buttonClickSource.next(value);
  }

  notifyOpenStats(value: boolean) {
    this.buttonClickStatsSource.next(value);
  }

  resetObservers(){
    this.buttonClickSource = new BehaviorSubject<string>('')
    this.buttonClickStatsSource = new BehaviorSubject<boolean>(false)
    this.buttonClickChangeView$ = this.buttonClickSource.asObservable();
    this.buttonClickStats$ = this.buttonClickStatsSource.asObservable();
  }
}
