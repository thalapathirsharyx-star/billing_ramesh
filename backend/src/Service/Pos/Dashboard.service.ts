import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { invoice } from '@Database/Table/Pos/invoice';
import { customer } from '@Database/Table/Pos/customer';
import { product } from '@Database/Table/Pos/product';

@Injectable()
export class DashboardService {
  constructor(private _DataSource: DataSource) { }

  async GetStats(storeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalRevenue = await invoice.createQueryBuilder('invoice')
      .select('SUM(invoice.total_amount)', 'sum')
      .where('invoice.store_id = :storeId', { storeId })
      .getRawOne();

    // Profit and Investment calculation
    const profitStats = await this._DataSource.getRepository('invoice_item')
      .createQueryBuilder('item')
      .leftJoin('item.invoice', 'invoice')
      .leftJoin('item.product', 'product')
      .select('SUM(product.purchase_price * item.quantity)', 'investment')
      .addSelect('SUM((item.unit_price - product.purchase_price) * item.quantity)', 'profit')
      .where('invoice.store_id = :storeId', { storeId })
      .getRawOne();

    const todayRevenue = await invoice.createQueryBuilder('invoice')
      .select('SUM(invoice.total_amount)', 'sum')
      .where('invoice.store_id = :storeId', { storeId })
      .andWhere('invoice.created_on >= :today', { today })
      .getRawOne();

    const totalInvoices = await invoice.count({ where: { store_id: storeId } });
    const totalCustomers = await customer.count({ where: { store_id: storeId } });
    const totalProducts = await product.count({ where: { store_id: storeId } });

    return {
      totalRevenue: Number(totalRevenue?.sum || 0),
      todayRevenue: Number(todayRevenue?.sum || 0),
      totalInvestment: Number(profitStats?.investment || 0),
      totalProfit: Number(profitStats?.profit || 0),
      totalInvoices,
      totalCustomers,
      totalProducts
    };
  }

  async GetSalesTrend(storeId: string) {
    const data = await invoice.createQueryBuilder('invoice')
      .select("DATE_TRUNC('day', invoice.created_on)", 'date')
      .addSelect('SUM(invoice.total_amount)', 'amount')
      .where('invoice.store_id = :storeId', { storeId })
      .andWhere("invoice.created_on >= NOW() - INTERVAL '7 days'")
      .groupBy("DATE_TRUNC('day', invoice.created_on)")
      .orderBy("DATE_TRUNC('day', invoice.created_on)", 'ASC')
      .getRawMany();

    return data.map(d => ({
      date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
      amount: Number(d.amount)
    }));
  }

  async GetPaymentBreakdown(storeId: string) {
    const data = await invoice.createQueryBuilder('invoice')
      .select('invoice.payment_method', 'method')
      .addSelect('COUNT(invoice.id)', 'count')
      .where('invoice.store_id = :storeId', { storeId })
      .groupBy('invoice.payment_method')
      .getRawMany();

    return data.map(d => ({
      name: d.method,
      value: Number(d.count)
    }));
  }
}
