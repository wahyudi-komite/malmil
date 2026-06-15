import { Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'storefront',
    templateUrl: './storefront.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterOutlet],
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
