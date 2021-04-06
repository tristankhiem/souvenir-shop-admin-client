export class ResponseModel<T> {
  type: number;
  status: number;
  message: string[] = [];
  result: T;
}
