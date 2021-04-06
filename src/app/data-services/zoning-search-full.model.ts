import {ZoningSearchModel} from './zoning-search.model';
import {SearchCoordinateModel} from './search-coordinate.model';
import {ZoningSearchHistoryModel} from './zoning-search-history.model';
import {ZoningSearchDetailModel} from './zoning-search-detail.model';

export class ZoningSearchFullModel extends ZoningSearchModel {
  public zoningSearchHistory: ZoningSearchHistoryModel;
  public searchCoordinates: SearchCoordinateModel[] = [];
  public zoningSearchDetails: ZoningSearchDetailModel[] = [];

  constructor(data?: ZoningSearchFullModel) {
    super(data);
    const zoningSearchFull = data == null ? this : data;

    this.zoningSearchHistory = new ZoningSearchHistoryModel(zoningSearchFull.zoningSearchHistory);

    this.searchCoordinates = [];
    const tempSearchCoordinates = zoningSearchFull.searchCoordinates || [];
    for (const searchCoordinate of tempSearchCoordinates) {
      this.searchCoordinates.push(new SearchCoordinateModel(searchCoordinate));
    }

    this.zoningSearchDetails = [];
    const tempZoningSearchDetails = zoningSearchFull.zoningSearchDetails || [];
    for (const searchCoordinate of tempZoningSearchDetails) {
      this.zoningSearchDetails.push(new ZoningSearchDetailModel(searchCoordinate));
    }
  }
}
