import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService, DocumentDto, DocumentStatsDto } from '../../service/document.service';

@Component({
    selector: 'app-documents',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
    documents: DocumentDto[] = [];
    filteredDocuments: DocumentDto[] = [];
    stats: DocumentStatsDto | null = null;
    loading = true;
    searchTerm = '';
    categoryFilter = 'all';
    viewMode: 'grid' | 'list' = 'list';
    showUploadDialog = false;

    categories: string[] = [];

    // Upload form data
    selectedFile: File | null = null;
    uploadCategory = '';
    uploadDescription = '';
    uploadIsPublic = false;
    uploading = false;

    constructor(private documentService: DocumentService) { }

    ngOnInit(): void {
        this.loadDocuments();
        this.loadStats();
    }

    loadDocuments(): void {
        this.loading = true;
        this.documentService.getAllDocuments().subscribe({
            next: (data) => {
                this.documents = data;
                this.filteredDocuments = data;
                this.extractCategories();
                this.applyFilters();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading documents:', err);
                this.loading = false;
            }
        });
    }

    loadStats(): void {
        this.documentService.getStats().subscribe({
            next: (data) => {
                this.stats = data;
            },
            error: (err) => console.error('Error loading stats:', err)
        });
    }

    extractCategories(): void {
        const cats = new Set(this.documents.map(d => d.category).filter(c => c));
        this.categories = Array.from(cats) as string[];
    }

    applyFilters(): void {
        this.filteredDocuments = this.documents.filter(doc => {
            const matchesSearch = doc.fileName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                (doc.description && doc.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
            const matchesCategory = this.categoryFilter === 'all' || doc.category === this.categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }

    onSearchChange(): void {
        this.applyFilters();
    }

    onFilterChange(): void {
        this.applyFilters();
    }

    openUploadDialog(): void {
        this.showUploadDialog = true;
    }

    closeUploadDialog(): void {
        this.showUploadDialog = false;
        this.resetUploadForm();
    }

    onFileSelected(event: any): void {
        this.selectedFile = event.target.files[0] || null;
    }

    uploadDocument(): void {
        if (!this.selectedFile) {
            alert('Please select a file');
            return;
        }
        if (!this.uploadCategory) {
            alert('Please enter a category');
            return;
        }

        this.uploading = true;
        this.documentService.uploadDocument(
            this.selectedFile,
            this.uploadCategory,
            this.uploadDescription,
            this.uploadIsPublic
        ).subscribe({
            next: (doc) => {
                this.documents.unshift(doc);
                this.applyFilters();
                this.loadStats();
                this.closeUploadDialog();
                this.uploading = false;
                alert('Document uploaded successfully');
            },
            error: (err) => {
                console.error('Error uploading document:', err);
                this.uploading = false;
                alert('Error uploading document');
            }
        });
    }

    deleteDocument(id: string): void {
        if (!confirm('Are you sure you want to delete this document?')) return;

        this.documentService.deleteDocument(id).subscribe({
            next: () => {
                this.documents = this.documents.filter(d => d.documentId !== id);
                this.applyFilters();
                this.loadStats();
                alert('Document deleted successfully');
            },
            error: (err) => {
                console.error('Error deleting document:', err);
                alert('Error deleting document');
            }
        });
    }

    downloadDocument(id: string, fileName: string): void {
        this.documentService.downloadDocument(id).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            },
            error: (err) => {
                console.error('Error downloading document:', err);
                alert('Error downloading document');
            }
        });
    }

    resetUploadForm(): void {
        this.selectedFile = null;
        this.uploadCategory = '';
        this.uploadDescription = '';
        this.uploadIsPublic = false;
    }

    formatBytes(bytes: number, decimals = 2): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getFileIcon(fileType: string): string {
        if (fileType.includes('pdf')) return 'fa-file-pdf text-red-500';
        if (fileType.includes('word') || fileType.includes('document')) return 'fa-file-word text-blue-500';
        if (fileType.includes('excel') || fileType.includes('sheet')) return 'fa-file-excel text-green-500';
        if (fileType.includes('image')) return 'fa-file-image text-purple-500';
        if (fileType.includes('text')) return 'fa-file-alt text-gray-500';
        return 'fa-file text-gray-400';
    }
}
