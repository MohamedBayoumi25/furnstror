import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-products-title',
  templateUrl: './products-title.component.html',
  styleUrls: ['./products-title.component.css']
})
export class ProductsTitleComponent {
  layoutGrid: boolean = true;

  @Input() productCategory: string = "";
  @Input() productsInCart:any;
  @Output() changeLayout = new EventEmitter();
  ngOnInit() {
    if (this.productsInCart && isNaN(this.productsInCart[0])) {
      this.productsInCart = [];
    }
  }
  toggleLayout() {
    this.layoutGrid = !this.layoutGrid;
    this.changeLayout.emit();
  }

  
}
