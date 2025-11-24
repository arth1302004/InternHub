export interface IApplication {
  fullName: string;
  dateOfBirth: string; // Assuming string for simplicity, can be Date
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  nationality: string;
  educationLevel: string;
  universityName: string;
  degree: string;
  yearOfStudy: string;
  enrollmentNumber: string;
  cgpa?: number;
  internshipRole: string;
  preferredStartDate: string; // Assuming string for simplicity, can be Date
  preferredEndDate: string; // Assuming string for simplicity, can be Date
  modeOfInternship: string;
  locationPreference: string;
  technicalSkills: string;
  softSkills: string;
  previousExperience: string;
  portfolioUrl: string;
  linkedInUrl: string;
  gitHubUrl: string;
  motivationStatement: string;
  sourceOfApplication: string;
  availability: string;
  emergencyContact: string;
  agreementAccepted: boolean;
}
