export class YearRevenueModel {
    public year: number;
    public total: number;

    constructor(data?: YearRevenueModel) {
        const yearRevenue = data == null ? this : data;

        this.year = yearRevenue.year;
        this.total = yearRevenue.total;
    }
}
