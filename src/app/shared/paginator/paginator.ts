import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-paginator',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './paginator.html'
})
export class PaginatorComponent {
    currentPage = input.required<number>();
    pageSize = input.required<number>();
    totalItems = input.required<number>();
    pageSizeOptions = input<number[]>([12, 24, 48]);

    pageChanged = output<number>();
    pageSizeChanged = output<number>();

    totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

    pages = computed(() => {
        const current = this.currentPage();
        const total = this.totalPages();
        const delta = 2; // Mostrar 2 paginas a cada lado
        const range = [];
        for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
            range.push(i);
        }

        if (current - delta > 2) {
            range.unshift('...');
        }
        if (current + delta < total - 1) {
            range.push('...');
        }

        range.unshift(1);
        if (total > 1) {
            range.push(total);
        }

        return range;
    });

    onPageChange(page: number | string) {
        if (typeof page === 'number' && page !== this.currentPage() && page >= 1 && page <= this.totalPages()) {
            this.pageChanged.emit(page);
        }
    }

    prev() {
        if (this.currentPage() > 1) {
            this.pageChanged.emit(this.currentPage() - 1);
        }
    }

    next() {
        if (this.currentPage() < this.totalPages()) {
            this.pageChanged.emit(this.currentPage() + 1);
        }
    }

    onPageSizeChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const newSize = Number(select.value);
        if (!isNaN(newSize)) {
            this.pageSizeChanged.emit(newSize);
        }
    }
}
