import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShippingService } from '../../../services/shipping.service';
import { OrderService } from '../../../services/order.service';
import { WishlistService } from '../../../services/wishlist.service';
import { ProductService } from '../../../services/product.service';
import { CurrencyIdrPipe } from '../../../shared/pipes/currency-idr.pipe';

@Component({
    selector: 'app-customer-dashboard',
    templateUrl: './customer-dashboard.component.html',
    standalone: true,
    imports: [RouterLink, NgForOf, NgIf, FormsModule, CurrencyIdrPipe],
})
export class CustomerDashboardComponent implements OnInit {
    activeTab: 'orders' | 'addresses' | 'wishlist' = 'orders';
    orders: any[] = [];
    addresses: any[] = [];
    wishlist: any[] = [];
    loading = true;

    // Address form
    showAddressForm = false;
    addressForm: any = {
        label: '', recipient_name: '', phone: '', province: '', city: '',
        district: '', subdistrict: '', postal_code: '', full_address: '', is_default: false,
    };

    constructor(
        private orderService: OrderService,
        private shippingService: ShippingService,
        private wishlistService: WishlistService,
        private productService: ProductService,
    ) {}

    ngOnInit() {
        this.loadOrders();
        this.loadAddresses();
        this.loadWishlist();
    }

    loadOrders() {
        this.orderService.getMyOrders(1, 10).subscribe({
            next: (res) => { this.orders = res.data; this.loading = false; },
            error: () => (this.loading = false),
        });
    }

    loadAddresses() {
        this.shippingService.getAddresses().subscribe((addr) => (this.addresses = addr));
    }

    loadWishlist() {
        this.wishlistService.getAll().subscribe((items) => (this.wishlist = items));
    }

    saveAddress() {
        this.shippingService.createAddress(this.addressForm).subscribe(() => {
            this.loadAddresses();
            this.showAddressForm = false;
            this.addressForm = {
                label: '', recipient_name: '', phone: '', province: '', city: '',
                district: '', subdistrict: '', postal_code: '', full_address: '', is_default: false,
            };
        });
    }

    deleteAddress(id: string) {
        this.shippingService.deleteAddress(id).subscribe(() => this.loadAddresses());
    }

    removeWishlist(productId: string) {
        this.wishlistService.remove(productId).subscribe(() => this.loadWishlist());
    }
}
