import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CurrencyIdrPipe } from '../../../shared/pipes/currency-idr.pipe';

@Component({
    selector: 'app-cart-page',
    templateUrl: './cart-page.component.html',
    standalone: true,
    imports: [RouterLink, NgForOf, NgIf, CurrencyIdrPipe],
})
export class CartPageComponent implements OnInit {
    cart: any = null;
    couponCode = '';
    couponApplied = false;

    constructor(private cartService: CartService) {}

    ngOnInit() {
        this.cartService.getCart().subscribe((cart) => {
            this.cart = cart;
            if (cart.coupon_code) {
                this.couponCode = cart.coupon_code;
                this.couponApplied = true;
            }
        });
    }

    updateQty(itemId: string, qty: number) {
        if (qty < 1) return;
        this.cartService.updateItem(itemId, qty).subscribe((cart) => (this.cart = cart));
    }

    removeItem(itemId: string) {
        this.cartService.removeItem(itemId).subscribe((cart) => (this.cart = cart));
    }

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
}
