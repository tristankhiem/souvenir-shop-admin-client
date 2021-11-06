import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeModel } from 'src/app/data-services/schema/employee.model';
import { BaseSearchModel } from 'src/app/data-services/search/base-search.model';
import { StoreBaseService } from '../generic/store-base.service';

@Injectable({
    providedIn: 'root'
})

export class EmployeeService extends StoreBaseService{
    public search(search: BaseSearchModel<EmployeeModel[]>): Observable<any>{
        return this.post('/api/v1/employee/search', search);
    }

    public getLikeName(name: string): Observable<any>{
        return this.get('/api/v1/employee/get-like-name' + name);
    }

    public getById(id: number): Observable<any>{
        return this.get('/api/v1/employee/' + id);
    }

    public save(employee: EmployeeModel): Observable<any>{
        return this.post('/api/v1/employee/insert', employee);
    }

    public update(employee: EmployeeModel): Observable<any>{
        return this.put('/api/v1/employee/update', employee);
    }

    public deleteEmployee(id: number): Observable<any>{
        return this.delete('/api/v1/employee/delete/' + id);
    }
}
