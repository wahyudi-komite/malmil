import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { CartService } from '../../../../services/cart.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [RouterLink, NgIf],
})
export class HeaderComponent implements OnInit {
    cartCount = 0;
    menuOpen = false;

    constructor(private cartService: CartService) {}

    ngOnInit() {
        this.cartService.cart$.subscribe((cart) => {
            this.cartCount = cart?.total_items || 0;
        });
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }
}
