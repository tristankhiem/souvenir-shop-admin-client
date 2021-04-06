import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html'
})
export class DatePickerComponent implements AfterViewInit {
  constructor() {}

  @Input() parentEl: string;
  @Input() singleDatePicker = true;
  @Input() startDate = new Date().getTime();
  @Input() endDate = new Date().getTime();
  @Input() disabled = false;

  @Output() startDateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() endDateChange: EventEmitter<any> = new EventEmitter<any>();

  public id = 'date_picker_' + Math.floor(new Date().getTime() * Math.random());

  ngAfterViewInit(): void {
    $('#' + this.id).daterangepicker({
      singleDatePicker: this.singleDatePicker,
      showDropdowns: true,
      autoApply: true,
      locale: {
        format: 'DD/MM/YYYY',
        separator: `'' - ''`,
        applyLabel: 'Đồng ý',
        cancelLabel: 'Hủy',
        fromLabel: 'Từ',
        toLabel: 'Đến',
        customRangeLabel: 'Custom',
        weekLabel: 'W',
        daysOfWeek: [
          'CN',
          'T2',
          'T3',
          'T4',
          'T5',
          'T6',
          'T7'
        ],
        monthNames: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 4',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
          'Tháng 8',
          'Tháng 9',
          'Tháng 10',
          'Tháng 11',
          'Tháng 12'
        ],
        firstDay: 1
      },
      parentEl: '#' + this.parentEl,
      startDate: +this.startDate,
      endDate: +this.endDate
    }, (start, end, label) => {
      this.startDate = start;
      this.endDate = end;

      this.startDateChange.emit(this.startDate);
      this.endDateChange.emit(this.endDate);
    });
  }
}
