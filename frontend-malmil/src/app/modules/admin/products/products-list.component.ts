import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminProductsService } from './products.service';

@Component({
    selector: 'admin-products',
    standalone: true,
    templateUrl: './products-list.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        RouterLink, FormsModule, NgForOf, NgIf,
        MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
        MatTableModule, MatPaginatorModule, MatSelectModule, MatMenuModule,
    ],
})
export class ProductsListComponent implements OnInit {
    displayedColumns = ['image', 'name', 'category', 'price', 'stock', 'status', 'actions'];
    data: any[] = [];
    total = 0;
    page = 1;
    pageSize = 25;
    keyword = '';
    categoryFilter = '';
    categories: any[] = [];

    constructor(
        private service: AdminProductsService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnInit() {
        this.load();
        this.service.getCategories().subscribe((c) => (this.categories = c));
    }

    load() {
        const params: any = { page: this.page, limit: this.pageSize };
        if (this.keyword) params.keyword = this.keyword;
        if (this.categoryFilter) params.category = this.categoryFilter;
        this.service.getProducts(params).subscribe((res) => {
            this.data = res.data || res;
            this.total = res.total || res.meta?.total || 0;
        });
    }

    search() { this.page = 1; this.load(); }

    onPage(e: PageEvent) {
        this.page = e.pageIndex + 1;
        this.pageSize = e.pageSize;
        this.load();
    }

    delete(id: string) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Hapus Produk',
            message: 'Hapus produk ini?',
            icon: { show: true, name: 'heroicons_outline:exclamation-triangle', color: 'warn' },
            actions: { confirm: { show: true, label: 'Hapus', color: 'warn' }, cancel: { show: true, label: 'Batal' } },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') this.service.deleteProduct(id).subscribe(() => this.load());
        });
    }

    getStockLabel(v: any): string {
        const total = v.variants?.reduce((s: number, v: any) => s + (v.stock_qty || 0), 0) ?? 0;
        return total === 0 ? 'Habis' : total < 10 ? 'Sisa ' + total : String(total);
    }

    getStockClass(v: any): string {
        const total = v.variants?.reduce((s: number, v: any) => s + (v.stock_qty || 0), 0) ?? 0;
        return total === 0 ? 'text-red-600' : total < 10 ? 'text-amber-600' : 'text-green-600';
    }

    getPrimaryImage(v: any): string | null {
        return v.images?.find((i: any) => i.is_primary)?.url || v.images?.[0]?.url || null;
    }
}
