export class CustomerModel {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public phone: string;
  public address: string;
  public birthDate: string;
  public isValid: boolean;

  public constructor(
    data?: CustomerModel
  ) {
    const customer = data == null ? this : data;

    this.id = customer.id;
    this.name = customer.name;
    this.email = customer.email;
    this.password = customer.password;
    this.phone = customer.phone;
    this.address = customer.address;
    this.birthDate = customer.birthDate;
    this.isValid = customer.isValid;
  }
}
