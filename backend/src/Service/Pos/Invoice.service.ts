import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { invoice } from '@Database/Table/Pos/invoice';
import { invoice_item } from '@Database/Table/Pos/invoice_item';
import { product } from '@Database/Table/Pos/product';
import { stock_movement } from '@Database/Table/Pos/stock_movement';
import { customer } from '@Database/Table/Pos/customer';
import { CreateInvoiceModel } from '@Model/Pos/Invoice.model';
import { AuditLogService } from '../Admin/AuditLog.service';
import { LogActionEnum } from '@Helper/Enum/AuditLogEnum';

@Injectable()
export class InvoiceService {
  constructor(
    private _DataSource: DataSource,
    private _AuditLogService: AuditLogService
  ) {}

  async CreateInvoice(data: CreateInvoiceModel, userId: string) {
    const queryRunner = this._DataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 0. Auto-create or find customer if phone is provided
      let customerId = data.customer_id;
      if (!customerId && data.customer_phone) {
        let cust = await queryRunner.manager.findOne(customer, { where: { phone: data.customer_phone, store_id: data.store_id } });
        if (!cust) {
          cust = new customer();
          cust.name = data.customer_name || `Walk-in (${data.customer_phone})`;
          cust.phone = data.customer_phone;
          cust.store_id = data.store_id;
          cust.total_purchases = 0;
          cust.total_invoices = 0;
          cust.created_by_id = userId;
          cust.created_on = new Date();
          cust = await queryRunner.manager.save(cust);
        }
        customerId = cust.id;
      }
      // 1. Calculate totals
      let subtotal = 0;
      let tax_amount = 0;
      const itemsToSave: invoice_item[] = [];

      for (const itemData of data.items) {
        const prod = await queryRunner.manager.findOne(product, { where: { id: itemData.product_id } });
        if (!prod) throw new Error(`Product ${itemData.product_id} not found`);
        if (prod.quantity_in_stock < itemData.quantity) throw new Error(`Insufficient stock for ${prod.name}`);

        const itemSubtotal = itemData.unit_price * itemData.quantity;
        const itemTax = (itemSubtotal * itemData.gst_percentage) / 100;

        subtotal += itemSubtotal;
        tax_amount += itemTax;

        const invItem = new invoice_item();
        invItem.product_id = itemData.product_id;
        invItem.quantity = itemData.quantity;
        invItem.unit_price = itemData.unit_price;
        invItem.gst_percentage = itemData.gst_percentage;
        invItem.gst_amount = itemTax;
        invItem.total_price = itemSubtotal + itemTax;
        invItem.created_by_id = userId;
        invItem.created_on = new Date();
        itemsToSave.push(invItem);

        // Update stock
        prod.quantity_in_stock -= itemData.quantity;
        await queryRunner.manager.save(prod);

        // Stock movement log
        const movement = new stock_movement();
        movement.product_id = prod.id;
        movement.movement_type = 'OUT';
        movement.quantity = itemData.quantity;
        movement.created_by_id = userId;
        movement.created_on = new Date();
        await queryRunner.manager.save(movement);
      }

      const discount = (subtotal * (data.discount_percentage || 0)) / 100;
      const flatDiscount = data.discount_amount || 0;
      const total_amount = Math.max(0, subtotal + tax_amount - discount - flatDiscount);

      // 2. Create invoice
      const inv = new invoice();
      inv.invoice_number = `INV-${Date.now()}`; 
      inv.customer_id = customerId;
      inv.store_id = data.store_id;
      inv.subtotal = subtotal;
      inv.tax_amount = tax_amount;
      inv.total_amount = total_amount;
      inv.discount_percentage = data.discount_percentage || 0;
      inv.discount_amount = flatDiscount;
      inv.payment_method = data.payment_method;
      inv.payment_status = 'PAID';
      inv.created_by_id = userId;
      inv.created_on = new Date();
      
      const savedInvoice = await queryRunner.manager.save(inv);

      // Link items to invoice
      for (const item of itemsToSave) {
        item.invoice_id = savedInvoice.id;
        await queryRunner.manager.save(item);
      }

      // 3. Update customer total purchases
      if (customerId) {
        const cust = await queryRunner.manager.findOne(customer, { where: { id: customerId } });
        if (cust) {
          cust.total_purchases = Number(cust.total_purchases) + total_amount;
          cust.total_invoices = Number(cust.total_invoices) + 1;
          cust.last_visit = new Date();
          await queryRunner.manager.save(cust);
        }
      }

      await queryRunner.commitTransaction();
      this._AuditLogService.AuditEmitEvent({ PerformedType: invoice.name, ActionType: LogActionEnum.Insert, PrimaryId: [savedInvoice.id] });
      return savedInvoice;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async GetAll(storeId?: string) {
    const query = invoice.createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.customer', 'customer')
      .leftJoinAndSelect('invoice.items', 'items')
      .leftJoinAndSelect('items.product', 'product');
    
    if (storeId) {
      query.where('invoice.store_id = :storeId', { storeId });
    }
    
    return await query.getMany();
  }

  async GetById(id: string) {
    return await invoice.findOne({ 
      where: { id }, 
      relations: ['customer', 'items', 'items.product'] 
    });
  }

  async GetByCustomer(customerId: string) {
    return await invoice.createQueryBuilder('invoice')
      .addSelect('invoice.created_on')
      .leftJoinAndSelect('invoice.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('invoice.customer_id = :customerId', { customerId })
      .orderBy('invoice.created_on', 'DESC')
      .getMany();
  }
}
