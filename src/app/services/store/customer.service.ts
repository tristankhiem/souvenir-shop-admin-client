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
        return this.post('/api/customer/search', search);
    }

    public getLikeName(name: string): Observable<any>{
        return this.get('/api/customer/get-like-name' + name);
    }

    public getById(id: number): Observable<any>{
        return this.get('/api/customer/' + id);
    }

    public save(customer: CustomerModel): Observable<any>{
        return this.post('/api/customer/insert', customer);
    }
    
    public update(customer: CustomerModel): Observable<any>{
        return this.put('/api/customer/update', customer);
    }

    public deleteCustomer(id: number): Observable<any>{
        return this.delete('/api/customer/delete/' + id);
    }

    public changeAccountState(customer: CustomerModel): Observable<any>{
        return this.put('/api/customer/change-account-state', customer);
    }
}