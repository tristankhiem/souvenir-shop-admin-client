import {Component, OnInit} from '@angular/core';
import {AppAlert, AppLoading} from '../../../../utils';
import {ActivatedRoute, Router} from '@angular/router';
import {ZoningTypeModel} from '../../../../data-services/zoning-type.model';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-zoning-type',
  templateUrl: './zoning-type.component.html'
})
export class ZoningTypeComponent implements OnInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  public zoningTypes: ZoningTypeModel[] = [];

  ngOnInit(): void {
    this.route.data.pipe(
      map(data => data.zoningTypes)
    ).subscribe(
      data => {
        this.zoningTypes = data.result;
      }
    );
  }
}
