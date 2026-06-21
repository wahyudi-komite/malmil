import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { resolveImageUrl } from 'app/core/utils/image-url';
import { AdminProductsService } from './products.service';

@Component({
    selector: 'admin-product-form',
    standalone: true,
    templateUrl: './product-form.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule, NgForOf, NgIf,
        MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
        MatSelectModule, MatSlideToggleModule,
    ],
})
export class ProductFormComponent implements OnInit {
    isEdit = false;
    loading = false;
    product: any = {
        name: '',
        category_id: '',
        description: '',
        base_price: 0,
        weight_grams: 0,
        is_active: true,
        is_featured: false,
        meta_title: '',
        meta_description: '',
        sort_order: 0,
        images: [],
        variants: [{ sku: '', name: '', price_override: null, stock_qty: 0, is_active: true }],
    };
    categories: any[] = [];
    uploadProgress = false;
    resolveImageUrl = resolveImageUrl;

    constructor(
        private service: AdminProductsService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        this.service.getCategories().subscribe((c) => (this.categories = c));
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.service.getProduct(id).subscribe((p) => {
                this.product = {
                    ...p,
                    category_id: p.category?.id || '',
                    images: p.images || [],
                    variants: p.variants && p.variants.length > 0
                        ? p.variants.map((v: any) => ({ ...v, price_override: v.price_override ?? null }))
                        : [{ sku: '', name: '', price_override: null, stock_qty: 0, is_active: true }],
                };
            });
        }
    }

    save() {
        this.loading = true;
        const payload = {
            name: this.product.name,
            category_id: this.product.category_id || undefined,
            description: this.product.description,
            base_price: Number(this.product.base_price),
            weight_grams: Number(this.product.weight_grams) || undefined,
            is_active: this.product.is_active,
            is_featured: this.product.is_featured,
            meta_title: this.product.meta_title || undefined,
            meta_description: this.product.meta_description || undefined,
            sort_order: Number(this.product.sort_order) || 0,
            images: this.product.images.filter((i: any) => i.url).map((i: any) => ({
                url: i.url, alt_text: i.alt_text, sort_order: i.sort_order || 0, is_primary: i.is_primary || false,
            })),
            variants: this.product.variants.filter((v: any) => v.sku).map((v: any) => ({
                sku: v.sku, name: v.name, price_override: v.price_override ? Number(v.price_override) : undefined,
                stock_qty: Number(v.stock_qty) || 0, is_active: v.is_active ?? true,
            })),
        };

        const obs = this.isEdit
            ? this.service.updateProduct(this.route.snapshot.paramMap.get('id')!, payload)
            : this.service.createProduct(payload);

        obs.subscribe({
            next: () => this.router.navigate(['/products']),
            error: () => (this.loading = false),
        });
    }

    addVariant() {
        this.product.variants.push({ sku: '', name: '', price_override: null, stock_qty: 0, is_active: true });
    }

    removeVariant(i: number) {
        this.product.variants.splice(i, 1);
    }

    addImage() {
        this.product.images.push({ url: '', alt_text: '', sort_order: 0, is_primary: this.product.images.length === 0 });
    }

    removeImage(i: number) {
        this.product.images.splice(i, 1);
    }

    uploadImage(index: number, event: any) {
        const file = event.target.files?.[0];
        if (!file) return;
        this.uploadProgress = true;
        this.service.uploadFile(file).subscribe({
            next: (res) => {
                this.product.images[index].url = res.url;
                this.uploadProgress = false;
            },
            error: () => (this.uploadProgress = false),
        });
    }
}
