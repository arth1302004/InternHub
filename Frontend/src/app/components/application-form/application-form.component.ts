import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IApplication } from '../../models/application.model';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Router } from '@angular/router'; // Import Router
import Swal from 'sweetalert2'; // Import Swal for alerts

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {

  applicationForm!: FormGroup;
  private fb = inject(FormBuilder);
  private http = inject(HttpClient); // Inject HttpClient
  private router = inject(Router); // Inject Router

  currentStep: number = 1;
        isSubmitting: boolean = false;
      resumeFile: File | null = null;
      profilePicFile: File | null = null;
      departments: string[] = ['HR', 'Engineering', 'Marketing', 'Finance', 'Operations', 'Sales', 'Research and Development'];

  stepTitles: string[] = [
    'Personal Information',
    'Educational Information',
    'Internship Details',
    'Skills and Experience',
    'Additional Information',
    'Agreement and Submit'
  ];

  constructor() { }

  ngOnInit(): void {
    this.applicationForm = this.fb.group({
      // Personal Information
      fullName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      nationality: ['', Validators.required],

      // Educational Information
      educationLevel: ['', Validators.required],
      universityName: ['', Validators.required],
      degree: ['', Validators.required],
      yearOfStudy: ['', Validators.required],
      enrollmentNumber: ['', Validators.required],
      cgpa: [null, [Validators.min(0), Validators.max(4)]],

      // Internship Details
      internshipRole: ['', Validators.required],
      preferredStartDate: ['', Validators.required],
      preferredEndDate: ['', Validators.required],
      modeOfInternship: ['', Validators.required],
      locationPreference: ['', Validators.required],
      department:['',Validators.required],

      // Skills and Experience
      technicalSkills: [''],
      softSkills: [''],
      previousExperience: [''],
      portfolioUrl: ['', Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)],
      linkedInUrl: ['', Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)],
      gitHubUrl: ['', Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)],

      // Additional Information
      motivationStatement: ['', Validators.required],
      sourceOfApplication: ['', Validators.required],
      availability: ['', Validators.required],
      emergencyContact: ['', Validators.required],
      agreementAccepted: [false, Validators.requiredTrue],
    });
  }

  getStepTitle(): string {
    return this.stepTitles[this.currentStep - 1];
  }

  nextStep() {
    // Validate current step's fields before moving to the next step
    let currentStepFields: string[] = [];
    switch (this.currentStep) {
      case 1: // Personal Information
        currentStepFields = ['fullName', 'dateOfBirth', 'gender', 'contactNumber', 'email', 'address', 'nationality'];
        break;
      case 2: // Educational Information
        currentStepFields = ['educationLevel', 'universityName', 'degree', 'yearOfStudy', 'enrollmentNumber'];
        break;
      case 3: // Internship Details
        currentStepFields = ['internshipRole', 'preferredStartDate', 'preferredEndDate', 'modeOfInternship', 'locationPreference'];
        break;
      case 4: // Skills and Experience (only validate file uploads if required)
        // For now, no specific validation for this step's fields, as they are optional or handled by file selection
        break;
      case 5: // Additional Information
        currentStepFields = ['motivationStatement', 'sourceOfApplication', 'availability', 'emergencyContact'];
        break;
      case 6: // Agreement and Submit
        currentStepFields = ['agreementAccepted'];
        break;
    }

    let isStepValid = true;
    for (const field of currentStepFields) {
      const control = this.applicationForm.get(field);
      if (control && control.invalid && control.touched) { // Check if touched to avoid validating untouched fields
        isStepValid = false;
        break;
      }
    }

    // Special validation for files in step 4
    if (this.currentStep === 4) {
      // If resume is required, check if it's selected
      // if (!this.resumeFile) {
      //   isStepValid = false;
      //   // Display error for resume file
      // }
    }


    if (isStepValid && this.currentStep < this.stepTitles.length) {
      this.currentStep++;
    } else {
      // Mark all controls in the current step as touched to show validation errors
      currentStepFields.forEach(field => {
        this.applicationForm.get(field)?.markAsTouched();
      });
      console.log('Current step is invalid. Please fill all required fields.');
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields in the current section.',
      });
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onFileSelected(event: any, fileType: 'resume' | 'profilePic') {
    const file: File = event.target.files[0];
    if (file) {
      if (fileType === 'resume') {
        this.resumeFile = file;
      } else if (fileType === 'profilePic') {
        this.profilePicFile = file;
      }
    }
  }

  onSubmit() {
    if (this.applicationForm.valid) {
      this.isSubmitting = true;
      const formData = new FormData();

      // Append all form fields to formData
      Object.keys(this.applicationForm.value).forEach(key => {
        // Handle Date objects for backend
        if (this.applicationForm.value[key] instanceof Date) {
          formData.append(key, this.applicationForm.value[key].toISOString());
        } else {
          formData.append(key, this.applicationForm.value[key]);
        }
      });

      // Append files
      if (this.resumeFile) {
        formData.append('ResumeFile', this.resumeFile, this.resumeFile.name);
      }
      if (this.profilePicFile) {
        formData.append('ProfilePicFile', this.profilePicFile, this.profilePicFile.name);
      }

      this.http.post('https://localhost:7140/api/Applications', formData).subscribe({
        next: (response: any) => {
          this.isSubmitting = false;
          Swal.fire({
            icon: 'success',
            title: 'Application Submitted!',
            text: 'Your application has been successfully submitted.',
          }).then(() => {
            this.router.navigate(['/login']); // Redirect to login or a success page
          });
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Application submission failed', error);
          let errorMessage = 'Something went wrong! Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          Swal.fire({
            icon: 'error',
            title: 'Submission Failed',
            text: errorMessage,
          });
        }
      });

    } else {
      console.log('Form is invalid');
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill all required fields before submitting.',
      });
      // Mark all fields as touched to display validation errors
      this.applicationForm.markAllAsTouched();
    }
  }

}
