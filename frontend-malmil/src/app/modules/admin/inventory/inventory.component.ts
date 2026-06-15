import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { InventoryService, StockSummary, VariantStock, InventoryLogEntry } from './inventory.service';

@Component({
    selector: 'admin-inventory',
    standalone: true,
    templateUrl: './inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule, DatePipe, NgIf, NgForOf,
        MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
        MatTableModule, MatPaginatorModule,
    ],
})
export class InventoryComponent implements OnInit {
    summary: StockSummary = { total_variants: 0, total_stock: 0, low_stock_count: 0 };
    lowStock: VariantStock[] = [];

    displayedColumns = ['product', 'sku', 'variant', 'stock', 'threshold', 'status'];
    variants: VariantStock[] = [];
    total = 0;
    page = 1;
    pageSize = 25;
    keyword = '';
    showHistory = false;
    history: InventoryLogEntry[] = [];
    historyVariant = '';

    constructor(private service: InventoryService) {}

    ngOnInit() {
        this.loadSummary();
        this.loadLowStock();
        this.loadVariants();
    }

    loadSummary() {
        this.service.getSummary().subscribe((s) => (this.summary = s));
    }

    loadLowStock() {
        this.service.getLowStock().subscribe((d) => (this.lowStock = d));
    }

    loadVariants() {
        const params: any = { page: this.page, limit: this.pageSize };
        if (this.keyword) params.keyword = this.keyword;
        this.service.getVariants(params).subscribe((res) => {
            this.variants = res.data || [];
            this.total = res.meta?.total || 0;
        });
    }

    search() { this.page = 1; this.loadVariants(); }

    onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.loadVariants(); }

    openHistory(v: VariantStock) {
        this.historyVariant = `${v.product_name} - ${v.name}`;
        this.service.getHistory(v.id).subscribe((h) => {
            this.history = h;
            this.showHistory = true;
        });
    }

    closeHistory() { this.showHistory = false; this.history = []; }

    isLowStock(qty: number, threshold: number): boolean { return qty < threshold; }
}
