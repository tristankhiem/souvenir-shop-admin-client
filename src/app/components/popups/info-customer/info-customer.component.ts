import {Component, ViewChild} from '@angular/core';
import {CustomerModel} from '../../../data-services/customer.model';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';

@Component({
  selector: 'app-info-customer',
  templateUrl: './info-customer.component.html'
})
export class InfoCustomerComponent {
  constructor() {
  }

  @ViewChild('infoCustomerModalWrapper') infoCustomerModalWrapper: ModalWrapperComponent;

  public customer: CustomerModel = new CustomerModel();

  public show(customer: CustomerModel, event: Event): void {
    event.preventDefault();

    this.customer = new CustomerModel(customer);
    console.log(customer);
    this.infoCustomerModalWrapper.show();
  }

}
