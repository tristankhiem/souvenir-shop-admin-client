export class MonthRevenueModel {
    public monthDate: number;
    public yearDate: number;
    public total: number;

    constructor(data?: MonthRevenueModel) {
        const monthRevenue = data == null ? this : data;

        this.monthDate = monthRevenue.monthDate;
        this.yearDate = monthRevenue.yearDate;
        this.total = monthRevenue.total;
    }
}
