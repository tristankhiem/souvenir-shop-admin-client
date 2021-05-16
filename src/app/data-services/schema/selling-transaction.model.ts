
import {ProductDetailModel} from './product-detail.model';
import {SellingOrderModel} from './selling-order.model';
export class SellingTransactionModel {
  public id: number;
  public productDetail: ProductDetailModel;
  public quantity: number;
  public price: number;
  public sellingOrder: SellingOrderModel;

  public constructor(
    data?: SellingTransactionModel
  ) {
    const transaction = data == null ? this : data;

    this.id = transaction.id;
    this.productDetail = new ProductDetailModel(transaction.productDetail);
    this.quantity = transaction.quantity;
    this.price = transaction.price;
    this.sellingOrder = new SellingOrderModel(transaction.sellingOrder);
  }
}
