import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { NewsletterService } from '../../../services/newsletter.service';
import { BannerService } from '../../../services/banner.service';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { CurrencyIdrPipe } from '../../../shared/pipes/currency-idr.pipe';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    standalone: true,
    imports: [RouterLink, NgForOf, NgIf, FormsModule, ProductCardComponent],
})
export class LandingComponent implements OnInit {
    featuredProducts: any[] = [];
    banners: any[] = [];
    newsletterEmail = '';
    subscribed = false;
    subscriberror = '';

    constructor(
        private productService: ProductService,
        private newsletterService: NewsletterService,
        private bannerService: BannerService,
    ) {}

    ngOnInit() {
        this.productService.getFeatured(4).subscribe((products) => {
            this.featuredProducts = products;
        });
        this.bannerService.getActive('hero').subscribe((banners) => {
            this.banners = banners;
        });
    }

    subscribeNewsletter() {
        if (!this.newsletterEmail) return;
        this.newsletterService.subscribe(this.newsletterEmail).subscribe({
            next: () => {
                this.subscribed = true;
                this.subscriberror = '';
                this.newsletterEmail = '';
            },
            error: (err) => {
                this.subscriberror = err.error?.message || 'Gagal mendaftar';
            },
        });
    }

    testimonials = [
        { name: 'Rina', city: 'Jakarta', text: 'Enak banget! Popcorn-nya renyah dan rasa karamelnya pas. Jadi camilan favorit keluarga.', rating: 5 },
        { name: 'Budi', city: 'Bandung', text: 'Kemasan cantik, cocok buat oleh-oleh. Sudah repeat order 3 kali!', rating: 5 },
        { name: 'Sari', city: 'Surabaya', text: 'Cheddar-nya juara. Gak norak, gurihnya pas. Recommended!', rating: 5 },
    ];
}
