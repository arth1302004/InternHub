import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface DocumentDto {
    documentId: string;
    fileName: string;
    storedFileName: string;
    fileSize: number;
    fileType: string;
    category: string;
    description: string;
    uploadedBy: string;
    uploadedByName: string;
    uploadedDate: string;
    version: number;
    parentDocumentId?: string;
    isLatestVersion: boolean;
    tags: string[];
    sharedWith: string[];
    isPublic: boolean;
    lastModifiedDate: string;
    downloadUrl: string;
}

export interface DocumentStatsDto {
    totalDocuments: number;
    sharedDocuments: number;
    publicDocuments: number;
    recentDocuments: number;
    totalStorageUsed: number;
    documentsByCategory: { [key: string]: number };
    documentsByType: { [key: string]: number };
}

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:5101';

    uploadDocument(file: File, category: string, description?: string, isPublic: boolean = false): Observable<DocumentDto> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        if (description) {
            formData.append('description', description);
        }
        formData.append('isPublic', String(isPublic));

        return this.http.post<DocumentDto>(`${this.baseUrl}/api/documents/upload`, formData);
    }

    getAllDocuments(): Observable<DocumentDto[]> {
        return this.http.get<DocumentDto[]>(`${this.baseUrl}/api/documents`);
    }

    getDocumentById(id: string): Observable<DocumentDto> {
        return this.http.get<DocumentDto>(`${this.baseUrl}/api/documents/${id}`);
    }

    getDocumentsByCategory(category: string): Observable<DocumentDto[]> {
        return this.http.get<DocumentDto[]>(`${this.baseUrl}/api/documents/category/${category}`);
    }

    getStats(): Observable<DocumentStatsDto> {
        return this.http.get<DocumentStatsDto>(`${this.baseUrl}/api/documents/stats`);
    }

    deleteDocument(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/documents/${id}`);
    }

    downloadDocument(id: string): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/api/documents/download/${id}`, { responseType: 'blob' });
    }

    shareDocument(id: string, userIds: string[]): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/documents/${id}/share`, userIds);
    }
}
