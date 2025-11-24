import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Evaluation, EvaluationService, EvaluationStats } from '../../services/evaluation.service';

@Component({
  selector: 'app-evaluation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluation.html',
  styleUrls: ['./evaluation.css']
})
export class EvaluationComponent implements OnInit {
  stats: EvaluationStats | null = null;
  evaluations: Evaluation[] = [];
  selectedStatus: string = 'All Statuses';

  constructor(private evaluationService: EvaluationService) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadEvaluations();
  }

  loadStats(): void {
    this.evaluationService.getEvaluationStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  loadEvaluations(): void {
    this.evaluationService.getEvaluations(this.selectedStatus).subscribe(evaluations => {
      this.evaluations = evaluations;
    });
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus = target.value;
    this.loadEvaluations();
  }
}