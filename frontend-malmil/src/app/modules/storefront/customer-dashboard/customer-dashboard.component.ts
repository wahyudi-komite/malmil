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

    // Region cascading
    provinces: any[] = [];
    cities: any[] = [];
    districts: any[] = [];
    selectedProvinceId: string = '';
    selectedCityId: string = '';

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

    toggleAddressForm() {
        this.showAddressForm = !this.showAddressForm;
        if (this.showAddressForm) {
            this.loadProvinces();
        }
    }

    loadProvinces() {
        this.shippingService.getProvinces().subscribe((data) => (this.provinces = data));
    }

    onProvinceChange(event: any) {
        const id = event.target.value;
        const province = this.provinces.find((p) => p.id === id);
        if (!province) return;
        this.selectedProvinceId = province.id;
        this.addressForm.province = province.name;
        this.addressForm.city = '';
        this.addressForm.district = '';
        this.addressForm.subdistrict = '';
        this.cities = [];
        this.districts = [];
        this.selectedCityId = '';
        this.shippingService.getCities(province.id).subscribe((data) => (this.cities = data));
    }

    onCityChange(event: any) {
        const id = event.target.value;
        const city = this.cities.find((c) => c.id === id);
        if (!city) return;
        this.selectedCityId = city.id;
        this.addressForm.city = city.name;
        this.addressForm.district = '';
        this.addressForm.subdistrict = '';
        this.districts = [];
        this.shippingService.getDistricts(city.id).subscribe((data) => (this.districts = data));
    }

    onDistrictChange(event: any) {
        const id = event.target.value;
        const district = this.districts.find((d) => d.id === id);
        if (!district) return;
        this.addressForm.district = district.name;
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
