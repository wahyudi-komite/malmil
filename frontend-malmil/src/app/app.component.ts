import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor() {
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            console.log('CLICKED ELEMENT:', {
                tagName: target.tagName,
                id: target.id,
                className: target.className,
                innerText: target.innerText,
                outerHTML: target.outerHTML.substring(0, 200),
                pointerEvents: window.getComputedStyle(target).pointerEvents
            });
        });
    }
}
