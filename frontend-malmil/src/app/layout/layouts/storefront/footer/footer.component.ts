import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteConfigService } from '../../../../services/site-config.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    standalone: true,
    imports: [RouterLink],
})
export class FooterComponent {
    currentYear = new Date().getFullYear();

    constructor(public config: SiteConfigService) {}
}
