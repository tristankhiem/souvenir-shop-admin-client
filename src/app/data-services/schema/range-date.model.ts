export class RangeDateModel {
    public fromDate: string;
    public toDate: string;

    constructor(data?: RangeDateModel) {
        const search = data == null ? this : data;

        this.fromDate = search.fromDate;
        this.toDate = search.toDate;
    }
}
