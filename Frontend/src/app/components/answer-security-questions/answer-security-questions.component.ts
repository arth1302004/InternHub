import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InternService } from '../../service/intern.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-answer-security-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './answer-security-questions.component.html',
  styleUrls: ['./answer-security-questions.component.css']
})
export class AnswerSecurityQuestionsComponent implements OnInit {
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
 
     const questions = this.questionsForm.value.questions.map((q: any) => ({
       Question: q.question,
       Answer: q.answer
     }));
 
     this.internService.verifySecurityQuestions({ Questions: questions }).subscribe({
       next: (response: any) => {
         if (response.resetToken) {
           Swal.fire('Success', 'Security questions verified successfully.', 'success');
           this.router.navigate(['/reset-password'], { queryParams: { token: response.resetToken } });
         } else {
           Swal.fire('Error', 'Invalid answers.', 'error');
         }
       },
       error: (err: any) => {
         console.error('Error verifying security questions:', err);
         Swal.fire('Error', err.error.message || 'Something went wrong while verifying security questions.', 'error');
       }
     });
   }
}