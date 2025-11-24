export interface ApplicationDto {
  fullName: string;
  dateOfBirth: Date;
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
  preferredStartDate: Date;
  preferredEndDate: Date;
  modeOfInternship: string;
  locationPreference: string;
  technicalSkills: string;
  softSkills: string;
  previousExperience: string;
  resumeUrl: string;
  portfolioUrl: string;
  linkedInUrl: string;
  gitHubUrl: string;
  motivationStatement: string;
  sourceOfApplication: string;
  availability: string;
  emergencyContact: string;
  agreementAccepted: boolean;
  requestDate: Date;
}

export interface ApplicationResponseDto {
  applicationId: string;
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  nationality: string;
  status: string; // e.g., Pending, Reviewed, Accepted, Rejected
  educationLevel: string;
  universityName: string;
  degree: string;
  yearOfStudy: string;
  enrollmentNumber: string;
  cgpa?: number;
  internshipRole: string;
  preferredStartDate: Date;
  preferredEndDate: Date;
  modeOfInternship: string;
  locationPreference: string;
  technicalSkills: string;
  softSkills: string;
  previousExperience: string;
  resumeUrl: string;
  profilePicUrl: string;
  portfolioUrl: string;
  linkedInUrl: string;
  gitHubUrl: string;
  motivationStatement: string;
  sourceOfApplication: string;
  availability: string;
  emergencyContact: string;
  agreementAccepted: boolean;
  requestDate: Date;
}

export interface CreateApplicationDto {
  fullName: string;
  dateOfBirth: Date;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  nationality: string;
  educationLevel: string;
  department: string; // Added this line
  universityName: string;
  degree: string;
  yearOfStudy: string;
  enrollmentNumber: string;
  cgpa?: number;
  internshipRole: string;
  preferredStartDate: Date;
  preferredEndDate: Date;
  modeOfInternship: string;
  locationPreference: string;
  technicalSkills: string;
  softSkills: string;
  previousExperience: string;
  resumeFile?: File; // For file upload
  profilePicFile?: File; // For file upload
  portfolioUrl: string;
  linkedInUrl: string;
  gitHubUrl: string;
  motivationStatement: string;
  sourceOfApplication: string;
  availability: string;
  emergencyContact: string;
  agreementAccepted: boolean;
}

export interface UpdateApplicationDto {
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  contactNumber?: string;
  email?: string;
  status?: string; // e.g., Pending, Reviewed, Accepted, Rejected
  address?: string;
  nationality?: string;
  educationLevel?: string;
  universityName?: string;
  degree?: string;
  yearOfStudy?: string;
  enrollmentNumber?: string;
  cgpa?: number;
  internshipRole?: string;
  preferredStartDate?: Date;
  preferredEndDate?: Date;
  modeOfInternship?: string;
  locationPreference?: string;
  technicalSkills?: string;
  softSkills?: string;
  previousExperience?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  motivationStatement?: string;
  sourceOfApplication?: string;
  availability?: string;
  emergencyContact?: string;
  agreementAccepted?: boolean;
}

export interface UpdateApplicationStatusDto {
  status: string;
}
