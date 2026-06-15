import { Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
    selector: 'storefront',
    templateUrl: './storefront.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
})
export class StorefrontComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'storefront';

    ngOnInit() {
        document.body.classList.add('storefront-scroll');
    }

    ngOnDestroy() {
        document.body.classList.remove('storefront-scroll');
    }
}
