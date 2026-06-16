import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { CartService } from '../../../../services/cart.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { UserService } from '../../../../core/user/user.service';
import { FuseConfigService } from '../../../../../@fuse/services/config/config.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: true,
    imports: [RouterLink, NgIf],
})
export class HeaderComponent implements OnInit {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private fuseConfig = inject(FuseConfigService);

    cartCount = 0;
    menuOpen = false;
    userMenuOpen = false;
    isAuthenticated = false;
    user: any = null;
    darkMode = false;

    constructor(private cartService: CartService) {}

    ngOnInit() {
        this.cartService.cart$.subscribe((cart) => {
            this.cartCount = cart?.total_items || 0;
        });

        this.userService.user$.subscribe((u) => {
            this.user = u;
            this.isAuthenticated = !!u;
        });

        this.authService.check().subscribe();

        this.fuseConfig.config$.subscribe((config) => {
            this.darkMode = config.scheme === 'dark';
        });
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    toggleUserMenu() {
        this.userMenuOpen = !this.userMenuOpen;
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        this.fuseConfig.config = { scheme: this.darkMode ? 'dark' : 'light' };
    }

    logout() {
        this.authService.signOut().subscribe(() => {
            this.isAuthenticated = false;
            this.user = null;
            this.userMenuOpen = false;
        });
    }
}
