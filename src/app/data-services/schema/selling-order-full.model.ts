import {CustomerModel} from './customer.model';
import {SellingTransactionModel} from './selling-transaction.model';
export class SellingOrderFullModel {
  public id: number;
  public customer: CustomerModel;
  public invoiceDate: string;
  public total: number;
  public address: string;
  public deliveryDate: string;
  public receivePerson: string;
  public status: string;
  public sellingTransactions: SellingTransactionModel[] = [];

  public constructor(
    data?: SellingOrderFullModel
  ) {
    const sellingOrder = data == null ? this : data;

    this.id = sellingOrder.id;
    this.customer = new CustomerModel(sellingOrder.customer);
    this.invoiceDate = sellingOrder.invoiceDate;
    this.total = sellingOrder.total;
    this.address = sellingOrder.address;
    this.deliveryDate = sellingOrder.deliveryDate;
    this.receivePerson = sellingOrder.receivePerson;
    this.status = sellingOrder.status;
    const sellingTransactions = sellingOrder.sellingTransactions || [];
    for (const sellingTransaction of sellingTransactions) {
      this.sellingTransactions.push(new SellingTransactionModel(sellingTransaction));
    }
  }
}
