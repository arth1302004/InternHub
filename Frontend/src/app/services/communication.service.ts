import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Message {
    messageId: number;
    senderId: string;
    recipientEmail: string;
    subject: string;
    body: string;
    sentAt: Date;
    status: string;
    type: string;
}

export interface MessageTemplate {
    templateId: number;
    name: string;
    subject: string;
    body: string;
    type: string;
    lastModified: Date;
}

export interface SendMessageDto {
    recipientEmail: string;
    subject: string;
    body: string;
    type: string;
}

export interface CreateTemplateDto {
    name: string;
    subject: string;
    body: string;
    type: string;
}

@Injectable({
    providedIn: 'root'
})
export class CommunicationService {
    private apiUrl = 'http://localhost:5101/api/communication';

    constructor(private http: HttpClient) { }

    sendMessage(message: SendMessageDto): Observable<Message> {
        return this.http.post<Message>(`${this.apiUrl}/send`, message);
    }

    getHistory(): Observable<Message[]> {
        return this.http.get<Message[]>(`${this.apiUrl}/history`);
    }

    getTemplates(): Observable<MessageTemplate[]> {
        return this.http.get<MessageTemplate[]>(`${this.apiUrl}/templates`);
    }

    createTemplate(template: CreateTemplateDto): Observable<MessageTemplate> {
        return this.http.post<MessageTemplate>(`${this.apiUrl}/templates`, template);
    }

    updateTemplate(id: number, template: CreateTemplateDto): Observable<MessageTemplate> {
        return this.http.put<MessageTemplate>(`${this.apiUrl}/templates/${id}`, template);
    }

    deleteTemplate(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/templates/${id}`);
    }
}
