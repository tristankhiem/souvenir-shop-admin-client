import {SupplierModel} from './supplier.model';
import {EmployeeModel} from './employee.model';
import {ImportingTransactionModel} from './importing-transaction.model';
export class ImportingOrderFullModel {
  public id: number;
  public supplier: SupplierModel;
  public invoiceDate: string;
  public employee: EmployeeModel;
  public total: number;
  public deliveryDate: string;
  public status: string;
  public importingTransactions: ImportingTransactionModel[] = [];

  public constructor(
    data?: ImportingOrderFullModel
  ) {
    const importingOrder = data == null ? this : data;

    this.id = importingOrder.id;
    this.supplier = new SupplierModel(importingOrder.supplier);
    this.invoiceDate = importingOrder.invoiceDate;
    this.employee = new EmployeeModel(importingOrder.employee);
    this.total = importingOrder.total;
    this.deliveryDate = importingOrder.deliveryDate;
    this.status = importingOrder.status;
    const importingTransactions = importingOrder.importingTransactions || [];
    for (const sellingTransaction of importingTransactions) {
      this.importingTransactions.push(new ImportingTransactionModel(sellingTransaction));
    }
  }
}