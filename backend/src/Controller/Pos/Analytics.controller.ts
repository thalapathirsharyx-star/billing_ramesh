import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from '@Service/Pos/Analytics.service';
import { JWTAuthController } from '@Controller/JWTAuth.controller';

@Controller({ path: "Analytics", version: '1' })
@ApiTags("Analytics")
export class AnalyticsController extends JWTAuthController {
  constructor(private _AnalyticsService: AnalyticsService) {
    super();
  }

  @Get('BillWiseProfit')
  async BillWiseProfit(
    @Query('storeId') storeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const data = await this._AnalyticsService.GetBillWiseProfit(
      storeId, 
      new Date(startDate), 
      new Date(endDate)
    );
    return this.SendResponseData(data);
  }

  @Get('BusinessPNL')
  async BusinessPNL(
    @Query('storeId') storeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const data = await this._AnalyticsService.GetBusinessPNL(
      storeId, 
      new Date(startDate), 
      new Date(endDate)
    );
    return this.SendResponseData(data);
  }

  @Get('ItemWiseProfit')
  async ItemWiseProfit(
    @Query('storeId') storeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const data = await this._AnalyticsService.GetItemWiseProfit(
      storeId, 
      new Date(startDate), 
      new Date(endDate)
    );
    return this.SendResponseData(data);
  }

  @Get('StockSummary')
  async StockSummary(@Query('storeId') storeId: string) {
    const data = await this._AnalyticsService.GetStockSummary(storeId);
    return this.SendResponseData(data);
  }
}
