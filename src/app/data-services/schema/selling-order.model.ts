import {CustomerModel} from './customer.model';
export class SellingOrderModel {
  public id: string;
  public customer: CustomerModel;
  public invoiceDate: string;
  public total: number;
  public address: string;
  public deliveryDate: string;
  public receivePerson: string;
  public status: string;

  public constructor(
    data?: SellingOrderModel
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
  }
}
