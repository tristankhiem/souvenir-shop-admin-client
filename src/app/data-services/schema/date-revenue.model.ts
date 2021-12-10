export class DateRevenueModel {
    public date: number;
    public month: number;
    public year: number;
    public total: number;

    constructor(data?: DateRevenueModel) {
        const dateRevenue = data == null ? this : data;

        this.date = dateRevenue.date;
        this.month = dateRevenue.month;
        this.year = dateRevenue.year;
        this.total = dateRevenue.total;
    }
}
