import {SubCategoryModel} from './sub-category.model';

export class ProductModel {
  public id: number;
  public name: string;
  public quantity: number;
  public description: string;
  public imageUrl: string;
  public sellingPrice: number;
  public subCategory: SubCategoryModel;

  public constructor(
    data?: ProductModel
  ) {
    const product = data == null ? this : data;

    this.id = product.id;
    this.name = product.name;
    this.quantity = product.quantity;
    this.description = product.description;
    this.imageUrl = product.imageUrl;
    this.sellingPrice = product.sellingPrice;
    this.subCategory = new SubCategoryModel(product.subCategory);
  }
}
