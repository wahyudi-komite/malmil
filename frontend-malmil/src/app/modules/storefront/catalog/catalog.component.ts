import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
    selector: 'app-catalog',
    templateUrl: './catalog.component.html',
    standalone: true,
    host: { class: 'block w-full' },
    imports: [FormsModule, NgForOf, NgIf, ProductCardComponent],
})
export class CatalogComponent implements OnInit {
    products: any[] = [];
    categories: any[] = [];
    meta: any = {};
    keyword = '';
    selectedCategory = '';
    sort = 'newest';
    page = 1;

    constructor(
        private productService: ProductService,
        private cartService: CartService,
    ) {}

    ngOnInit() {
        this.productService.getCategories().subscribe((cats) => {
            this.categories = cats;
        });
        this.loadProducts();
    }

    loadProducts() {
        const params: any = {
            page: this.page,
            limit: 12,
            sort: this.sort,
        };
        if (this.keyword) params.keyword = this.keyword;
        if (this.selectedCategory) params.category = this.selectedCategory;

        this.productService.getProducts(params).subscribe((res) => {
            this.products = res.data;
            this.meta = res.meta;
        });
    }

    search() {
        this.page = 1;
        this.loadProducts();
    }

    filterByCategory(slug: string) {
        this.selectedCategory = slug;
        this.page = 1;
        this.loadProducts();
    }

    changeSort(sort: string) {
        this.sort = sort;
        this.loadProducts();
    }

    goToPage(p: number) {
        this.page = p;
        this.loadProducts();
    }

    addToCart(variantId: string) {
        this.cartService.addItem(variantId, 1).subscribe();
    }

    get pages(): number[] {
        return Array.from({ length: this.meta.last_page || 1 }, (_, i) => i + 1);
    }
}
