export class SupplierModel {
  public id: number;
  public name: string;
  public address: string;

  public constructor(
    data?: SupplierModel
  ) {
    const supplier = data == null ? this : data;

    this.id = supplier.id;
    this.name = supplier.name;
    this.address = supplier.address;
  }
}
