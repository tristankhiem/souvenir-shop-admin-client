import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {MonthCostModel} from '../../data-services/schema/month-cost.model';
import {SellingOrderService} from '../../services/store/selling-order.service';
import {MonthRevenueModel} from '../../data-services/schema/month-revenue.model';
import {DateRevenueModel} from '../../data-services/schema/date-revenue.model';
import {YearRevenueModel} from '../../data-services/schema/year-revenue.model';

@Component({
  selector: 'app-home-customer',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  private today: Date = new Date();
  public costData: any;
  public revenueAndOrderData: any;
  public revenueType = '2';
  private revenueData: any;
  public revenueStartDate = new Date(this.today.getFullYear(), 0, 1);
  public revenueEndDate = new Date(this.today.getFullYear(), 12, 0);
  private rangeDate: any;
  public monthCostTests: MonthCostModel[] = [];

  public revenueOption = {
    tooltips: {
      callbacks: {
        // tslint:disable-next-line:typedef
        label(tooltipItem, data) {
          tooltipItem.yLabel = tooltipItem.yLabel.toString();
          tooltipItem.yLabel = tooltipItem.yLabel.split('.');

          tooltipItem.yLabel[0] = tooltipItem.yLabel[0].split(/(?=(?:...)*$)/);
          if (tooltipItem.yLabel[1]) {
            tooltipItem.yLabel[1] = tooltipItem.yLabel[1].split(/(?=(?:...)*$)/);
            return tooltipItem.yLabel.join('.') + ' VNĐ';
          }
          return tooltipItem.yLabel[0] + ' VNĐ';
        },
      }
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback(value, index, values) {

            value = value.toString();
            value = value.split(/(?=(?:...)*$)/);
            switch (value.length) {
              case 4:
                value = parseFloat(`${value[0]}.${value[1]}`) + ' tỷ';
                break;
              case 3:
                value = parseFloat(`${value[0]}.${value[1]}`) + ' triệu';
                break;
              case 2:
                value = parseFloat(`${value[0]}.${value[1]}`) + ' ngàn';
                break;
              default:
                value = value.join('.');
                break;
            }

            return value;
          }
        },
        scaleLabel: {
          display: true,
          labelString: 'VNĐ'
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false,
          fontSize: 11
        }
      }]
    }
  };

  constructor(
    private alert: AppAlert,
    private loading: AppLoading,
    private modal: AppModals,
    private cdr: ChangeDetectorRef,
    private sellingOrderService: SellingOrderService,
  ) {
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    const m = new MonthCostModel();
    this.getRevenueAndOrder();
  }

  // tslint:disable-next-line:typedef
  private getThisQuarter(){
    const startMonth = Math.floor(this.today.getMonth() / 3) * 3;
    return startMonth;
  }

  // tslint:disable-next-line:typedef
  public getRevenueAndOrderWithOption() {
    // this.countRequest = 2;
    this.loading.show();
    let startDate: Date;
    let endDate: Date;
    const quarterStartMonth = this.getThisQuarter();
    switch (this.revenueType) {
      case '0':
        startDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
        endDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
        break;
      case '1':
        startDate = new Date(this.today.getFullYear(), quarterStartMonth, 1);
        endDate = new Date(this.today.getFullYear(), quarterStartMonth + 3, 0);
        break;
      case '2':
        startDate = new Date(this.today.getFullYear(), 0, 1);
        endDate = new Date(this.today.getFullYear(), 12, 0);
        break;
      case '4':
        startDate = new Date(this.today.getFullYear(), this.today.getMonth() - 1, 1);
        endDate = new Date(this.today.getFullYear(), this.today.getMonth(), 0);
        break;
      case '5':
        startDate = new Date(this.today.getFullYear(), quarterStartMonth - 3, 1);
        endDate = new Date(this.today.getFullYear(), quarterStartMonth, 0);
        break;
      case '6':
        startDate = new Date(this.today.getFullYear() - 1, 0, 1);
        endDate = new Date(this.today.getFullYear() - 1, 12, 0);
        break;
    }
    this.revenueStartDate = new Date(startDate);
    this.revenueEndDate = new Date(endDate);
    const rangeDate = {
      fromDate: startDate.getTime(),
      toDate: endDate.getTime()
    };
    this.rangeDate = rangeDate;

    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      this.sellingOrderService.getDateRevenue(this.rangeDate).subscribe(res => this.getDateRevenueCompleted(res));
      return;
    }

    this.sellingOrderService.getMonthRevenue(this.rangeDate).subscribe(res => this.getRevenueCompleted(res));
  }

  // tslint:disable-next-line:typedef
  public getRevenueAndOrder() {
    this.loading.show();
    const startDate = new Date(this.revenueStartDate);
    const endDate = new Date(this.revenueEndDate);
    // this.countRequest = 2;

    startDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 1, 0);
    const rangeDate = {
      fromDate: startDate.getTime(),
      toDate: endDate.getTime()
    };
    this.rangeDate = rangeDate;
    if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
      this.sellingOrderService.getDateRevenue(this.rangeDate).subscribe(res => this.getDateRevenueCompleted(res));
      return;
    }
    if (startDate.getFullYear() !== endDate.getFullYear()) {
      this.sellingOrderService.getYearRevenue(this.rangeDate).subscribe(res => this.getYearRevenueCompleted(res));
      return;
    }
    this.sellingOrderService.getMonthRevenue(this.rangeDate).subscribe(res => this.getRevenueCompleted(res));
  }

  // tslint:disable-next-line:typedef
  private getRevenueCompleted(res: ResponseModel<MonthRevenueModel[]>){
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.revenueData = [];
    this.revenueData = res.result;
    this.loadRevenueAndOrderByMonthCompleted();
  }

  // tslint:disable-next-line:typedef
  private getDateRevenueCompleted(res: ResponseModel<DateRevenueModel[]>){
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.revenueData = [];
    this.revenueData = res.result;
    this.loadRevenueAndOrderByDateCompleted();
  }

  // tslint:disable-next-line:typedef
  private getYearRevenueCompleted(res: ResponseModel<YearRevenueModel[]>){
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.revenueData = [];
    this.revenueData = res.result;
    this.loadRevenueAndOrderByYearCompleted();
  }

  // tslint:disable-next-line:typedef
  private loadRevenueAndOrderByMonthCompleted() {
    // this.countRequest--;
    // if (this.countRequest === 0){
    this.updateRevenueAndOrderChartByMonth();
    // }
  }

  // tslint:disable-next-line:typedef
  private loadRevenueAndOrderByDateCompleted(){
    // this.countRequest--;
    // if (this.countRequest === 0){
    this.updateRevenueAndOrderChartByDate();
    // }
  }

  // tslint:disable-next-line:typedef
  private loadRevenueAndOrderByYearCompleted(){
    // this.countRequest--;
    // if (this.countRequest === 0){
    this.updateRevenueAndOrderChartByYear();
    // }
  }

  // tslint:disable-next-line:typedef
  private updateRevenueAndOrderChartByMonth() {
    const revenueDataSet = [];
    const label = [];
    for (const item of this.revenueData) {
      revenueDataSet.push(item.total);
      label.push(item.monthDate + '/' + item.yearDate);
    }

    this.revenueAndOrderData = {
      labels: label,
      datasets: [
        {
          label: 'Doanh thu',
          fill: !0,
          lineTension: 0.5,
          backgroundColor: 'rgb(255,192,203, 0.2)',
          borderColor: '#e83e8c',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#e83e8c',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#e83e8c',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: revenueDataSet
        }
      ]
    };
  }

  // tslint:disable-next-line:typedef
  private updateRevenueAndOrderChartByYear() {
    const revenueDataSet = [];
    const orderDataSet = [];
    const label = [];
    for (const item of this.revenueData) {
      revenueDataSet.push(item.total);
      label.push(item.year);
    }

    this.revenueAndOrderData = {
      labels: label,
      datasets: [
        {
          label: 'Doanh thu',
          fill: !0,
          lineTension: 0.5,
          backgroundColor: 'rgb(255,192,203, 0.2)',
          borderColor: '#e83e8c',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#e83e8c',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#e83e8c',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: revenueDataSet
        }
      ]
    };
  }

  // tslint:disable-next-line:typedef
  private updateRevenueAndOrderChartByDate() {
    const revenueDataSet = [];
    const label = [];
    for (const item of this.revenueData) {
      revenueDataSet.push(item.total);
      label.push(item.date);
    }

    this.revenueAndOrderData = {
      labels: label,
      datasets: [
        {
          label: 'Doanh thu',
          fill: !0,
          lineTension: 0.5,
          backgroundColor: 'rgb(255,192,203, 0.2)',
          borderColor: '#e83e8c',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#e83e8c',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#e83e8c',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: revenueDataSet
        }
      ]
    };
  }
}
