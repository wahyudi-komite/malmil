import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Observable } from 'rxjs';

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categories$: Observable<Category[]>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Assuming ProductsService has a method getCategories returning Observable<Category[]>
    this.categories$ = this.productService.getCategories();
  }
}
