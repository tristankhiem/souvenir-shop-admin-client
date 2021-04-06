export class CustomerGroupModel {
  public id: number;
  public name: string;
  public createdDate: string;
  public updatedDate: string;
  public constructor(
    data?: CustomerGroupModel
  ) {
    const customerGroup = data == null ? this : data;

    this.id = customerGroup.id;
    this.name = customerGroup.name;
    this.createdDate = customerGroup.createdDate;
    this.updatedDate = customerGroup.updatedDate;
  }
}
