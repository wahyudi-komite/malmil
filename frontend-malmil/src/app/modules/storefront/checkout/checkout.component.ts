import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { ShippingService } from '../../../services/shipping.service';
import { PaymentService } from '../../../services/payment.service';
import { RegionService } from '../../../services/region.service';
import { CurrencyIdrPipe } from '../../../shared/pipes/currency-idr.pipe';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    standalone: true,
    imports: [NgForOf, NgIf, FormsModule, CurrencyIdrPipe],
})
export class CheckoutComponent implements OnInit {
    cart: any = null;

    // Step 1 — Customer
    guest_name = '';
    guest_email = '';
    guest_phone = '';

    // Step 2 — Address
    provinces: any[] = [];
    cities: any[] = [];
    districts: any[] = [];
    selectedProvince = '';
    selectedCity = '';
    selectedDistrict = '';
    postal_code = '';
    full_address = '';
    recipient_name = '';
    recipient_phone = '';
    addresses: any[] = [];
    selectedAddressId = '';
    useNewAddress = true;

    // Step 3 — Shipping
    couriers: any[] = [];
    rates: any[] = [];
    selectedRate: any = null;
    calculating = false;

    // Step 4 — Review & Pay
    couponCode = '';
    couponApplied = false;
    couponDiscount = 0;
    processing = false;
    error = '';

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private shippingService: ShippingService,
        private paymentService: PaymentService,
        private regionService: RegionService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.cartService.getCart().subscribe((cart) => {
            this.cart = cart;
            if (cart.coupon_code) {
                this.couponCode = cart.coupon_code;
                this.couponApplied = true;
            }
        });
        this.regionService.getProvinces().subscribe((p) => (this.provinces = p));
        this.shippingService.getAddresses().subscribe({
            next: (addr) => {
                this.addresses = addr;
                if (addr.length > 0) this.useNewAddress = false;
            },
            error: () => {},
        });
    }

    // ─── Address ─────────────────────────────────────

    onProvinceChange() {
        this.selectedCity = '';
        this.selectedDistrict = '';
        this.cities = [];
        this.districts = [];
        if (this.selectedProvince) {
            this.regionService.getCities(this.selectedProvince).subscribe((c) => (this.cities = c));
        }
    }

    onCityChange() {
        this.selectedDistrict = '';
        this.districts = [];
        if (this.selectedCity) {
            this.regionService.getDistricts(this.selectedCity).subscribe((d) => (this.districts = d));
        }
    }

    selectExistingAddress(addr: any) {
        this.selectedAddressId = addr.id;
        this.useNewAddress = false;
        this.recipient_name = addr.recipient_name;
        this.recipient_phone = addr.phone;
    }

    // ─── Shipping ────────────────────────────────────

    calculateRates() {
        if (!this.cart || !this.cart.total_weight) return;

        this.calculating = true;
        const destination = this.selectedCity || 'jakarta';

        this.shippingService.calculateRates({
            destination,
            weight: this.cart.total_weight,
        }).subscribe({
            next: (res) => {
                this.rates = res.rates;
                this.calculating = false;
            },
            error: () => (this.calculating = false),
        });
    }

    // ─── Coupon ──────────────────────────────────────

    applyCoupon() {
        if (!this.couponCode) return;
        this.cartService.applyCoupon(this.couponCode).subscribe((cart) => {
            this.cart = cart;
            this.couponApplied = true;
        });
    }

    removeCoupon() {
        this.cartService.removeCoupon().subscribe((cart) => {
            this.cart = cart;
            this.couponCode = '';
            this.couponApplied = false;
        });
    }

    // ─── Place Order ────────────────────────────────

    get subtotal(): number {
        return this.cart?.subtotal || 0;
    }

    get shippingCost(): number {
        return this.selectedRate?.cost || 0;
    }

    get total(): number {
        return this.subtotal + this.shippingCost;
    }

    placeOrder() {
        if (!this.guest_name || !this.guest_phone || !this.guest_email) {
            this.error = 'Lengkapi informasi penerima';
            return;
        }
        if (this.useNewAddress && (!this.full_address || !this.selectedCity)) {
            this.error = 'Lengkapi alamat pengiriman';
            return;
        }
        if (!this.selectedRate) {
            this.error = 'Pilih metode pengiriman';
            return;
        }

        this.processing = true;
        this.error = '';

        const addressPayload = this.useNewAddress ? {
            recipient_name: this.guest_name,
            phone: this.guest_phone,
            province: this.provinces.find((p) => p.id === this.selectedProvince)?.name || '',
            city: this.cities.find((c) => c.id === this.selectedCity)?.name || '',
            district: this.districts.find((d) => d.id === this.selectedDistrict)?.name || '',
            postal_code: this.postal_code,
            full_address: this.full_address,
        } : { id: this.selectedAddressId };

        // Create address first if new
        const address$ = this.useNewAddress
            ? this.shippingService.createAddress(addressPayload)
            : new Promise((resolve) => resolve(null));

        // For guest, create address first then order
        const doOrder = () => {
            this.orderService.createOrder({
                address_id: this.useNewAddress ? '' : this.selectedAddressId,
                courier_code: this.selectedRate.courier_code,
                courier_service: this.selectedRate.service_type,
                guest_name: this.guest_name,
                guest_email: this.guest_email,
                guest_phone: this.guest_phone,
                coupon_code: this.cart.coupon_code || undefined,
                notes: '',
            }).subscribe({
                next: (order) => {
                    this.processing = false;
                    // Redirect to payment
                    this.router.navigate(['/payment-status', order.order_number]);
                },
                error: (err) => {
                    this.processing = false;
                    this.error = err.error?.message || 'Gagal membuat pesanan';
                },
            });
        };

        if (this.useNewAddress) {
            (address$ as any).subscribe({
                next: (addr: any) => {
                    if (addr) this.selectedAddressId = addr.id;
                    doOrder();
                },
                error: () => (this.processing = false),
            });
        } else {
            doOrder();
        }
    }
}
