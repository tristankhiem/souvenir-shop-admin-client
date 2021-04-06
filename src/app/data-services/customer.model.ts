import {CustomerGroupModel} from './customer-group.model';

export class CustomerModel {
  public id: string;
  public fullName: string;
  public fullNameSlug: string;
  public cardId: string;
  public email: string;
  public password: string;
  public phone: string;
  public address: string;
  public birthDate: string;
  public customerGroup: CustomerGroupModel = new CustomerGroupModel();
  public isActive: boolean;
  public createdDate: string;
  public updatedDate: string;


  public constructor(
    data?: CustomerModel
  ) {
    const customer = data == null ? this : data;

    this.id = customer.id;
    this.fullName = customer.fullName;
    this.fullNameSlug = customer.fullNameSlug;
    this.cardId = customer.cardId;
    this.email = customer.email;
    this.password = customer.password;
    this.phone = customer.phone;
    this.address = customer.address;
    this.birthDate = customer.birthDate;
    this.customerGroup = new CustomerGroupModel(customer.customerGroup);
    this.isActive = customer.isActive;
    this.createdDate = customer.createdDate;
    this.updatedDate = customer.updatedDate;
  }
}
