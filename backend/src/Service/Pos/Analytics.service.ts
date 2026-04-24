import { Injectable } from '@nestjs/common';
import { invoice } from '@Database/Table/Pos/invoice';
import { invoice_item } from '@Database/Table/Pos/invoice_item';
import { product } from '@Database/Table/Pos/product';
import { Between } from 'typeorm';

@Injectable()
export class AnalyticsService {
  async GetBillWiseProfit(storeId: string, startDate: Date, endDate: Date) {
    const invoices = await invoice.find({
      where: {
        store_id: storeId,
        created_on: Between(startDate, endDate),
        status: true
      },
      relations: ['items', 'customer'],
      order: { created_on: 'DESC' }
    });

    return invoices.map(inv => {
      let totalCost = 0;
      inv.items.forEach(item => {
        // Fallback to current product purchase price if snapshot is missing (for older bills)
        const cp = item.purchase_price || (item.product as any)?.purchase_price || 0;
        totalCost += cp * item.quantity;
      });

      const totalSP = inv.total_amount;
      const profit = totalSP - totalCost;

      return {
        id: inv.id,
        invoice_number: inv.invoice_number,
        customer_name: inv.customer?.name || 'Walk-in',
        created_on: inv.created_on,
        total_sp: totalSP,
        total_cp: totalCost,
        discount: inv.discount_amount,
        profit: profit
      };
    });
  }

  async GetBusinessPNL(storeId: string, startDate: Date, endDate: Date) {
    const invoices = await invoice.find({
      where: {
        store_id: storeId,
        created_on: Between(startDate, endDate),
        status: true
      },
      relations: ['items']
    });

    let totalSales = 0;
    let totalCost = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    invoices.forEach(inv => {
      totalSales += inv.total_amount;
      totalTax += inv.tax_amount;
      totalDiscount += inv.discount_amount;
      
      inv.items.forEach(item => {
        const cp = item.purchase_price || (item.product as any)?.purchase_price || 0;
        totalCost += cp * item.quantity;
      });
    });

    return {
      total_sales: totalSales,
      total_cost: totalCost,
      total_tax: totalTax,
      total_discount: totalDiscount,
      net_profit: totalSales - totalCost,
      invoice_count: invoices.length
    };
  }

  async GetItemWiseProfit(storeId: string, startDate: Date, endDate: Date) {
    const items = await invoice_item.createQueryBuilder('item')
      .leftJoinAndSelect('item.invoice', 'invoice')
      .leftJoinAndSelect('item.product', 'product')
      .where('invoice.store_id = :storeId', { storeId })
      .andWhere('invoice.created_on BETWEEN :start AND :end', { start: startDate, end: endDate })
      .andWhere('invoice.status = true')
      .getMany();

    const stats: Record<string, any> = {};

    items.forEach(item => {
      const productId = item.product_id;
      if (!stats[productId]) {
        stats[productId] = {
          product_id: productId,
          name: item.product?.name || 'Unknown',
          sku: item.product?.sku || '-',
          quantity_sold: 0,
          total_revenue: 0,
          total_cost: 0,
          profit: 0
        };
      }

      const cp = item.purchase_price || item.product?.purchase_price || 0;
      stats[productId].quantity_sold += item.quantity;
      stats[productId].total_revenue += item.total_price;
      stats[productId].total_cost += cp * item.quantity;
    });

    return Object.values(stats).map(s => ({
      ...s,
      profit: s.total_revenue - s.total_cost
    })).sort((a, b) => b.profit - a.profit);
  }

  async GetStockSummary(storeId: string) {
    const products = await product.find({
      where: { store_id: storeId, status: true },
      order: { name: 'ASC' }
    });

    let totalValuation = 0;
    const summary = products.map(p => {
      const stock = p.quantity_in_stock || 0;
      const cp = p.purchase_price || 0;
      const value = stock * cp;
      totalValuation += value;

      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        size: p.size,
        quantity: stock,
        purchase_price: cp,
        stock_value: value
      };
    });

    return {
      items: summary,
      total_stock_value: totalValuation,
      total_items: summary.length
    };
  }
}
