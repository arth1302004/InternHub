import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InternService } from '../../service/intern.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-security-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './security-questions.component.html',
  styleUrls: ['./security-questions.component.css']
})
export class SecurityQuestionsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private internService = inject(InternService);

  questionsForm!: FormGroup;
  questions = [
    'What was your childhood nickname?',
    'What is the name of your favorite childhood friend?',
    'What is your oldest sibling’s middle name?',
    'What was the name of your first pet?',
    'What was the name of your elementary school?',
    'In what city or town did your parents meet?'
  ];

  ngOnInit(): void {
    this.questionsForm = this.fb.group({
      questions: this.fb.array([
        this.createQuestion(),
        this.createQuestion(),
        this.createQuestion()
      ])
    });
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  get questionsArray(): FormArray {
    return this.questionsForm.get('questions') as FormArray;
  }

  onSubmit() {
    if (this.questionsForm.invalid) {
      return;
    }

    const internId = localStorage.getItem('userId');
    if (!internId) {
      Swal.fire('Error', 'User ID not found.', 'error');
      return;
    }

    const questions = this.questionsForm.value.questions.map((q: any) => ({
      Question: q.question,
      Answer: q.answer
    }));

    this.internService.setSecurityQuestions(internId, { Questions: questions }).subscribe({
      next: () => {
        Swal.fire('Success', 'Security questions set successfully.', 'success');
        this.router.navigate(['/reset-password']);
      },
      error: () => {
        Swal.fire('Error', 'Failed to set security questions.', 'error');
      }
    });
  }
}
