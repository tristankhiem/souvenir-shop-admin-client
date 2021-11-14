import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CustomerModel } from "src/app/data-services/schema/customer.model";
import { BaseSearchModel } from "src/app/data-services/search/base-search.model";
import { StoreBaseService } from "../generic/store-base.service";

@Injectable({
    providedIn: 'root'
})

export class CustomerService extends StoreBaseService{
    public search(search: BaseSearchModel<CustomerModel[]>): Observable<any>{
        return this.post('/api/v1/customer/search', search);
    }

    public getLikeName(name: string): Observable<any>{
        return this.get('/api/v1/customer/get-like-name' + name);
    }

    public getById(id: number): Observable<any>{
        return this.get('/api/v1/customer/get-by-id/' + id);
    }

    public save(customer: CustomerModel): Observable<any>{
        return this.post('/api/v1/customer/insert', customer);
    }
    
    public update(customer: CustomerModel): Observable<any>{
        return this.put('/api/v1/customer/update', customer);
    }

    public deleteCustomer(id: number): Observable<any>{
        return this.delete('/api/v1/customer/delete/' + id);
    }

    public changeAccountState(customer: CustomerModel): Observable<any>{
        return this.put('/api/v1/customer/change-account-state', customer);
    }
}