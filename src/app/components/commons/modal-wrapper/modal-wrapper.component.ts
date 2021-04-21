import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-modal-wrapper',
  templateUrl: './modal-wrapper.component.html'
})

export class ModalWrapperComponent implements AfterViewInit {
  @Input() title = '';
  // modal-sm, modal-lg or modal-xl
  @Input() size = 'modal-lg';
  @Input() appendToBody = false;

  @Output() hideEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() showEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();

  public id = 'modal_wrapper_' + Math.floor(new Date().getTime() * Math.random());

  private el: any;

  ngAfterViewInit(): void {
    this.el = $('#' + this.id);

    this.el.on('shown.bs.modal', () => {
      this.showEvent.emit();
    });

    this.el.on('shown.bs.modal', () => {
      this.showEvent.emit();
    });

    this.el.on('hidden.bs.modal', (e) => {
      this.hideEvent.emit();
      // To fix miss scroll popup when open many popup
      $('.modal').css('overflow-y', 'auto');
    });
  }

  public hide(): void {
    this.el.modal('hide');
  }

  public show(): void {
    this.el.modal('show');
    if (this.appendToBody) {
      this.el.appendTo('body');
    }
  }
}
