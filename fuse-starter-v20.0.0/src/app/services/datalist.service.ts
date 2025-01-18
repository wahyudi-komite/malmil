import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AbstractService } from './abstract.service';

@Injectable({
    providedIn: 'root',
})
export class DatalistService extends AbstractService {
    url = `${environment.apiUrl}datalist`;
}
