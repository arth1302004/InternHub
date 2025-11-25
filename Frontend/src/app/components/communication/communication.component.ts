import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunicationService, Message, MessageTemplate, SendMessageDto, CreateTemplateDto } from '../../services/communication.service';

@Component({
    selector: 'app-communication',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './communication.component.html',
    styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {
    activeTab: 'compose' | 'history' | 'templates' = 'compose';

    // Data
    messages: Message[] = [];
    templates: MessageTemplate[] = [];

    // Compose Form
    newMessage: SendMessageDto = {
        recipientEmail: '',
        subject: '',
        body: '',
        type: 'Email'
    };
    selectedTemplateId: number | null = null;

    // Template Form
    isEditingTemplate = false;
    currentTemplate: CreateTemplateDto = {
        name: '',
        subject: '',
        body: '',
        type: 'Email'
    };
    editingTemplateId: number | null = null;

    // Loading/Error states
    isLoading = false;
    error: string | null = null;
    successMessage: string | null = null;

    constructor(private communicationService: CommunicationService) { }

    ngOnInit(): void {
        this.loadTemplates();
        this.loadHistory();
    }

    setActiveTab(tab: 'compose' | 'history' | 'templates'): void {
        this.activeTab = tab;
        this.error = null;
        this.successMessage = null;
    }

    loadHistory(): void {
        this.isLoading = true;
        this.communicationService.getHistory().subscribe({
            next: (data) => {
                this.messages = data;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load message history.';
                this.isLoading = false;
            }
        });
    }

    loadTemplates(): void {
        this.communicationService.getTemplates().subscribe({
            next: (data) => {
                this.templates = data;
            },
            error: (err) => {
                console.error('Failed to load templates', err);
            }
        });
    }

    onTemplateSelect(): void {
        if (this.selectedTemplateId) {
            const template = this.templates.find(t => t.templateId == this.selectedTemplateId);
            if (template) {
                this.newMessage.subject = template.subject;
                this.newMessage.body = template.body;
                this.newMessage.type = template.type;
            }
        }
    }

    sendMessage(): void {
        if (!this.newMessage.recipientEmail || !this.newMessage.subject || !this.newMessage.body) {
            this.error = 'Please fill in all fields.';
            return;
        }

        this.isLoading = true;
        this.error = null;
        this.successMessage = null;

        this.communicationService.sendMessage(this.newMessage).subscribe({
            next: () => {
                this.successMessage = 'Message sent successfully!';
                this.isLoading = false;
                this.newMessage = { recipientEmail: '', subject: '', body: '', type: 'Email' };
                this.selectedTemplateId = null;
                this.loadHistory(); // Refresh history
            },
            error: (err) => {
                this.error = 'Failed to send message. Please try again.';
                this.isLoading = false;
            }
        });
    }

    // Template Management
    startNewTemplate(): void {
        this.isEditingTemplate = true;
        this.editingTemplateId = null;
        this.currentTemplate = { name: '', subject: '', body: '', type: 'Email' };
    }

    editTemplate(template: MessageTemplate): void {
        this.isEditingTemplate = true;
        this.editingTemplateId = template.templateId;
        this.currentTemplate = {
            name: template.name,
            subject: template.subject,
            body: template.body,
            type: template.type
        };
    }

    cancelEditTemplate(): void {
        this.isEditingTemplate = false;
        this.editingTemplateId = null;
    }

    saveTemplate(): void {
        if (!this.currentTemplate.name || !this.currentTemplate.subject || !this.currentTemplate.body) {
            this.error = 'Please fill in all template fields.';
            return;
        }

        this.isLoading = true;

        if (this.editingTemplateId) {
            this.communicationService.updateTemplate(this.editingTemplateId, this.currentTemplate).subscribe({
                next: () => {
                    this.successMessage = 'Template updated successfully!';
                    this.isLoading = false;
                    this.isEditingTemplate = false;
                    this.loadTemplates();
                },
                error: () => {
                    this.error = 'Failed to update template.';
                    this.isLoading = false;
                }
            });
        } else {
            this.communicationService.createTemplate(this.currentTemplate).subscribe({
                next: () => {
                    this.successMessage = 'Template created successfully!';
                    this.isLoading = false;
                    this.isEditingTemplate = false;
                    this.loadTemplates();
                },
                error: () => {
                    this.error = 'Failed to create template.';
                    this.isLoading = false;
                }
            });
        }
    }

    deleteTemplate(id: number): void {
        if (confirm('Are you sure you want to delete this template?')) {
            this.communicationService.deleteTemplate(id).subscribe({
                next: () => {
                    this.loadTemplates();
                },
                error: () => {
                    this.error = 'Failed to delete template.';
                }
            });
        }
    }
}
