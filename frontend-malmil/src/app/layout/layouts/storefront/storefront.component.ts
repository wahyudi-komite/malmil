import { Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SiteConfigService } from '../../../services/site-config.service';

@Component({
    selector: 'storefront',
    templateUrl: './storefront.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
})
export class StorefrontComponent implements OnInit, OnDestroy {
    @HostBinding('class') class = 'storefront';

    constructor(public config: SiteConfigService) {}

    ngOnInit() {
        document.body.classList.add('storefront-scroll');
        this.config.load();
    }

    ngOnDestroy() {
        document.body.classList.remove('storefront-scroll');
    }
}
