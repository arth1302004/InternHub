import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { AnalyticsService, AnalyticsStats, PerformanceData, DepartmentDistribution, TaskCompletionData, ApplicationTrend } from '../../service/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit {
  stats: AnalyticsStats | null = null;
  performanceData: PerformanceData[] = [];
  departmentData: DepartmentDistribution[] = [];
  taskCompletionData: TaskCompletionData[] = [];
  applicationTrendData: ApplicationTrend[] = [];
  loading = true;
  selectedPeriod = '6months';

  // Performance Trend Chart
  performanceChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Average Rating',
      data: [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  performanceChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { min: 0, max: 5, ticks: { stepSize: 1 } }
    }
  };

  // Department Distribution Chart
  departmentChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  };

  departmentChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  // Task Completion Chart
  taskChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Completed',
        data: [],
        backgroundColor: '#10b981'
      },
      {
        label: 'Total',
        data: [],
        backgroundColor: '#e5e7eb'
      }
    ]
  };

  taskChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

  // Application Trend Chart
  applicationChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Total Applications',
      data: [],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      fill: true,
      tension: 0.4
    }]
  };

  applicationChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  loadAnalyticsData(): void {
    this.loading = true;

    // Load all analytics data
    this.analyticsService.getAnalyticsStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading stats:', err)
    });

    this.analyticsService.getPerformanceTrends(6).subscribe({
      next: (data) => {
        this.performanceData = data;
        this.updatePerformanceChart();
      },
      error: (err) => console.error('Error loading performance trends:', err)
    });

    this.analyticsService.getDepartmentDistribution().subscribe({
      next: (data) => {
        this.departmentData = data;
        this.updateDepartmentChart();
      },
      error: (err) => console.error('Error loading department distribution:', err)
    });

    this.analyticsService.getTaskCompletionData(6).subscribe({
      next: (data) => {
        this.taskCompletionData = data;
        this.updateTaskChart();
      },
      error: (err) => console.error('Error loading task completion:', err)
    });

    this.analyticsService.getApplicationTrends(6).subscribe({
      next: (data) => {
        this.applicationTrendData = data;
        this.updateApplicationChart();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading application trends:', err);
        this.loading = false;
      }
    });
  }

  updatePerformanceChart(): void {
    this.performanceChartData = {
      labels: this.performanceData.map(d => d.month),
      datasets: [{
        label: 'Average Rating',
        data: this.performanceData.map(d => d.rating),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }

  updateDepartmentChart(): void {
    this.departmentChartData = {
      labels: this.departmentData.map(d => d.name),
      datasets: [{
        data: this.departmentData.map(d => d.value),
        backgroundColor: this.departmentData.map(d => d.color)
      }]
    };
  }

  updateTaskChart(): void {
    this.taskChartData = {
      labels: this.taskCompletionData.map(d => d.week),
      datasets: [
        {
          label: 'Completed',
          data: this.taskCompletionData.map(d => d.completed),
          backgroundColor: '#10b981'
        },
        {
          label: 'Total',
          data: this.taskCompletionData.map(d => d.total),
          backgroundColor: '#e5e7eb'
        }
      ]
    };
  }

  updateApplicationChart(): void {
    this.applicationChartData = {
      labels: this.applicationTrendData.map(d => d.month),
      datasets: [{
        label: 'Total Applications',
        data: this.applicationTrendData.map(d => d.applications),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        fill: true,
        tension: 0.4
      }]
    };
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod = period;
    // Reload data based on selected period
    const months = period === '1month' ? 1 : period === '3months' ? 3 : period === '6months' ? 6 : 12;
    this.loadAnalyticsData();
  }

  exportReport(): void {
    // TODO: Implement export functionality
    console.log('Export report functionality to be implemented');
  }

  getChangeClass(change: number): string {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  }

  getChangeIcon(change: number): string {
    return change >= 0 ? '↑' : '↓';
  }
}
