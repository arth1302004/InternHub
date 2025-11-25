import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
    toasts: (Toast & { id: number })[] = [];
    private nextId = 0;

    constructor(private toastService: ToastService) { }

    ngOnInit() {
        this.toastService.toast$.subscribe(toast => {
            const id = this.nextId++;
            const toastWithId = { ...toast, id };
            this.toasts.push(toastWithId);

            setTimeout(() => {
                this.removeToast(id);
            }, toast.duration || 3000);
        });
    }

    removeToast(id: number) {
        this.toasts = this.toasts.filter(t => t.id !== id);
    }
}
