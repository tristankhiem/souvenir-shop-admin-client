
import {ProductDetailModel} from './product-detail.model';
import {ImportingOrderModel} from './importing-order.model';
export class ImportingTransactionModel {
  public id: string;
  public productDetail: ProductDetailModel;
  public quantity: number;
  public price: number;
  public importingOrder: ImportingOrderModel;

  public constructor(
    data?: ImportingTransactionModel
  ) {
    const transaction = data == null ? this : data;

    this.id = transaction.id;
    this.productDetail = new ProductDetailModel(transaction.productDetail);
    this.quantity = transaction.quantity;
    this.price = transaction.price;
    this.importingOrder = new ImportingOrderModel(transaction.importingOrder);
  }
}
