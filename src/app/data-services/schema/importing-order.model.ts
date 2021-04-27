import {SupplierModel} from './supplier.model';
import {EmployeeModel} from './employee.model';
export class ImportingOrderModel {
  public id: number;
  public supplier: SupplierModel;
  public invoiceDate: string;
  public employee: EmployeeModel;
  public total: number;
  public deliveryDate: string;
  public status: string;

  public constructor(
    data?: ImportingOrderModel
  ) {
    const importingOrder = data == null ? this : data;

    this.id = importingOrder.id;
    this.supplier = new SupplierModel(importingOrder.supplier);
    this.invoiceDate = importingOrder.invoiceDate;
    this.employee = new EmployeeModel(importingOrder.employee);
    this.total = importingOrder.total;
    this.deliveryDate = importingOrder.deliveryDate;
    this.status = importingOrder.status;
  }
}
