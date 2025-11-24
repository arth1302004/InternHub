import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Header } from "../header/header";
import { RouterOutlet, RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { Sidebar } from '../sidebar/sidebar';
import { ModalStateService } from '../../services/modal-state.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [CommonModule,Header, RouterModule, LoadingSpinnerComponent, Sidebar],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit, OnDestroy {
  modalStateService = inject(ModalStateService);
  isModalOpen: boolean = false;
  private modalSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.modalSubscription = this.modalStateService.isModalOpen$.subscribe(isOpen => {
      this.isModalOpen = isOpen;
    });
  }

  ngOnDestroy(): void {
    this.modalSubscription?.unsubscribe();
  }
}
