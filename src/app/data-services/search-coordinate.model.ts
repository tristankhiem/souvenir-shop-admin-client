import {ZoningSearchModel} from './zoning-search.model';

export class SearchCoordinateModel {
  public id: number;
  public zoningSearch: ZoningSearchModel;
  public xcoordinate: number;
  public ycoordinate: number;

  constructor(data?: SearchCoordinateModel) {
    const searchCoordinate = data == null ? this : data;

    this.id = searchCoordinate.id;
    this.zoningSearch = new ZoningSearchModel(searchCoordinate.zoningSearch);
    this.xcoordinate = searchCoordinate.xcoordinate;
    this.ycoordinate = searchCoordinate.ycoordinate;
  }
}
