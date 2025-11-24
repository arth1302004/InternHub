import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalStateService {
  private _isModalOpen = new BehaviorSubject<boolean>(false);
  isModalOpen$: Observable<boolean> = this._isModalOpen.asObservable();

  setModalState(isOpen: boolean): void {
    this._isModalOpen.next(isOpen);
  }
}
