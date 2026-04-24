import { CommonService } from './commonservice.page';

export class AnalyticsService extends CommonService {
  public static async GetBillWiseProfit(storeId: string, startDate: string, endDate: string) {
    return this.GetAll(`Analytics/BillWiseProfit?storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`);
  }

  public static async GetBusinessPNL(storeId: string, startDate: string, endDate: string) {
    return this.GetAll(`Analytics/BusinessPNL?storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`);
  }

  public static async GetItemWiseProfit(storeId: string, startDate: string, endDate: string) {
    return this.GetAll(`Analytics/ItemWiseProfit?storeId=${storeId}&startDate=${startDate}&endDate=${endDate}`);
  }

  public static async GetStockSummary(storeId: string) {
    return this.GetAll(`Analytics/StockSummary?storeId=${storeId}`);
  }
}
