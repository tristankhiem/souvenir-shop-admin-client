import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {FeedbackViolateModel} from '../../data-services/feedback-violate.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackViolateService extends DistrictBaseService {
  public getFeedbackViolate(feedbackViolateId: number): Observable<any> {
    return this.get('/api/v1/feedback-violate/' + feedbackViolateId);
  }
  public getLatestFeedbackByViolate(constructionViolateId: number): Observable<any> {
    return this.get('/api/v1/feedback-violate/latest-by-violate/' + constructionViolateId);
  }
  public save(feedbackViolate: FeedbackViolateModel): Observable<any> {
    return this.post('/api/v1/feedback-violate/insert', feedbackViolate);
  }
}
