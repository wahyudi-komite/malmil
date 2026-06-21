import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Observable } from 'rxjs';

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [NgForOf, AsyncPipe],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  categories$: Observable<Category[]>;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.categories$ = this.productService.getCategories();
  }
}
