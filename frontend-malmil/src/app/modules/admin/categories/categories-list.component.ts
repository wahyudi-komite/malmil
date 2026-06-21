import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AdminProductsService, Category } from '../products/products.service';

@Component({
    selector: 'app-categories-list',
    standalone: true,
    imports: [
        NgIf, DatePipe, FormsModule,
        MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule,
        MatFormFieldModule, MatInputModule, MatMenuModule,
    ],
    templateUrl: './categories-list.component.html',
    styleUrls: ['./categories-list.component.scss'],
})
export class CategoriesListComponent implements OnInit {
    data: Category[] = [];
    total = 0;
    page = 1;
    pageSize = 10;
    keyword = '';
    displayedColumns = ['name', 'slug', 'status', 'created', 'actions'];

    showForm = false;
    editId: string | null = null;
    formName = '';
    saving = false;

    constructor(private service: AdminProductsService) {}

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.service.getCategories().subscribe({
            next: (res) => {
                this.data = res;
                this.total = res.length;
            },
        });
    }

    get filtered(): Category[] {
        if (!this.keyword.trim()) return this.data;
        const kw = this.keyword.toLowerCase();
        return this.data.filter((c) => c.name.toLowerCase().includes(kw));
    }

    get paged(): Category[] {
        const start = (this.page - 1) * this.pageSize;
        return this.filtered.slice(start, start + this.pageSize);
    }

    onPage(e: PageEvent): void {
        this.page = e.pageIndex + 1;
        this.pageSize = e.pageSize;
    }

    openNew(): void {
        this.editId = null;
        this.formName = '';
        this.showForm = true;
    }

    openEdit(cat: Category): void {
        this.editId = cat.id;
        this.formName = cat.name;
        this.showForm = true;
    }

    save(): void {
        if (!this.formName.trim() || this.saving) return;
        this.saving = true;
        const obs = this.editId
            ? this.service.updateCategory(this.editId, { name: this.formName })
            : this.service.createCategory({ name: this.formName });

        obs.subscribe({
            next: () => {
                this.saving = false;
                this.showForm = false;
                this.load();
            },
            error: () => (this.saving = false),
        });
    }

    delete(cat: Category): void {
        this.service.deleteCategory(cat.id).subscribe({
            next: () => this.load(),
        });
    }
}
