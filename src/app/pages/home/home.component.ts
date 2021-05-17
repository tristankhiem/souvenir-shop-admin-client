import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {MonthCostModel} from '../../data-services/schema/month-cost.model';
import {SellingOrderService} from '../../services/store/selling-order.service';

@Component({
  selector: 'app-home-customer',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit {
  private today: Date = new Date();
  public costData: any;
  public costStartDate = new Date(this.today.getFullYear(), 0, 1);
  public costEndDate = new Date(this.today.getFullYear(), 12, 0);
  public monthCostTests: MonthCostModel[] = [];

  public costOption = {
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        // tslint:disable-next-line:typedef
        label(tooltipItem, data) {
          tooltipItem.yLabel = tooltipItem.yLabel.toString();
          tooltipItem.yLabel = tooltipItem.yLabel.split('.');

          tooltipItem.yLabel[0] = tooltipItem.yLabel[0].split(/(?=(?:...)*$)/);
          if (tooltipItem.yLabel[1]){
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
          // tslint:disable-next-line:typedef
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
    this.getCost();
  }

  // tslint:disable-next-line:typedef
  public getCost(){
    this.loading.show();
    const startDate = new Date(this.today.getFullYear(), 0, 1);
    const endDate = new Date(this.today.getFullYear(), 12, 0);

    const costRangeDate = {
      fromDate: new Date(startDate.getTime()).toDateString(),
      toDate: new Date(endDate.getTime()).toDateString()
    };
    this.sellingOrderService.getMonthCost(costRangeDate).subscribe(res => this.getCostCompleted(res));
  }

  // tslint:disable-next-line:typedef
  private updateCostChartByMonth(monthCosts: MonthCostModel[]){
    const data = [];
    const label = [];
    for (const item of monthCosts){
      data.push(item.total);
      label.push(item.monthDate + '/' + item.yearDate);
    }

    this.costData = {
      labels: label,
      datasets: [
        {
          label: 'Doanh thu',
          backgroundColor: 'rgba(252,166,82,0.4)',
          borderColor: '#ac4b1c',
          borderWidth: 1,
          maxBarThickness: 20,
          minBarThickness: 8,
          data
        },
      ]
    };
  }

  // tslint:disable-next-line:typedef
  private getCostCompleted(res: ResponseModel<MonthCostModel[]>){
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.updateCostChartByMonth(res.result);
  }
}
