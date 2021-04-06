import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ZoningTypeModel} from '../../../data-services/zoning-type.model';
import {ZoningTypeService} from '../zoning-type.service';
import {Observable} from 'rxjs';
import {ResponseModel} from '../../../data-services/response.model';


@Injectable({
  providedIn: 'root'
})
export class ZoningTypeResolverService implements Resolve<ResponseModel<ZoningTypeModel[]>> {
  constructor(private zoningTypeService: ZoningTypeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResponseModel<ZoningTypeModel[]>>
    | Promise<ResponseModel<ZoningTypeModel[]>> | ResponseModel<ZoningTypeModel[]> {
    return this.zoningTypeService.findAll();
  }
}
