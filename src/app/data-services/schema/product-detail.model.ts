import {SubCategoryModel} from './sub-category.model';
import {ColorModel} from './color.model';
import {SizeModel} from './size.model';
import {ProductModel} from './product.model';

export class ProductDetailModel {
  public id: number;
  public name: string;
  public quantity: number;
  public sellingPrice: number;
  public importingPrice: number;
  public imageUrl: string;
  public subCategory: SubCategoryModel;
  public color: ColorModel;
  public size: SizeModel;
  public product: ProductModel;

  public constructor(
    data?: ProductDetailModel
  ) {
    const productDetail = data == null ? this : data;

    this.id = productDetail.id;
    this.name = productDetail.name;
    this.quantity = productDetail.quantity;
    this.sellingPrice = productDetail.sellingPrice;
    this.importingPrice = productDetail.importingPrice;
    this.imageUrl = productDetail.imageUrl;
    this.subCategory = new SubCategoryModel(productDetail.subCategory);
    this.color = new ColorModel(productDetail.color);
    this.size = new SizeModel(productDetail.size);
    this.product = new ProductModel(productDetail.product);
  }
}
