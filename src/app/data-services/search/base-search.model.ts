export class BaseSearchModel<T> {
  public currentPage = 0;
  public recordOfPage = 10;
  public totalRecords: number;
  public sortAsc: boolean;
  public sortBy: string;
  public pagingRange = 5;
  public result: T;
}
