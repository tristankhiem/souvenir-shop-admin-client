export class MonthCostModel {
    public monthDate: number;
    public yearDate: number;
    public total: number;

    constructor(data?: MonthCostModel) {
        const monthCost = data == null ? this : data;

        this.monthDate = monthCost.monthDate;
        this.yearDate = monthCost.yearDate;
        this.total = monthCost.total;
    }
}
