import { Component, Output, EventEmitter, inject } from '@angular/core'; // Add inject
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { InternService } from '../../service/intern.service'; // Import InternService

@Component({
  selector: 'app-add-intern',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add FormsModule and CommonModule here
  templateUrl: './add-intern.html',
  styleUrl: './add-intern.css'
})
export class AddIntern {
  internEmail: string = '';
  private internService = inject(InternService); // Inject InternService

  @Output() emailSubmitted = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  sendRegistrationLink() {
    if (this.internEmail) {
      this.internService.sendRegistrationLink(this.internEmail).subscribe({
        next: (response) => {
          console.log('Registration link sent successfully:', response);
          this.emailSubmitted.emit(this.internEmail); // Emit on success
        },
        error: (error) => {
          console.error('Error sending registration link:', error);
          // Optionally, show an error message to the user
        }
      });
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
