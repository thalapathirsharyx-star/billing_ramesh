import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface SalesReportProps {
  data: any[];
}

const SalesReport: React.FC<SalesReportProps> = ({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];
  const total = safeData.reduce((acc, item) => acc + (item.total_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex justify-between items-center">
        <div>
          <div className="text-sm text-primary font-bold uppercase tracking-widest">Total Sales Volume</div>
          <div className="text-4xl font-black">₹{total.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground font-medium">Transaction Count</div>
          <div className="text-2xl font-bold">{safeData.length}</div>
        </div>
      </div>

      <div className="rounded-xl border  overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>GST</TableHead>
              <TableHead className="text-right">Grand Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeData.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-xs">{invoice.invoice_number}</TableCell>
                <TableCell>{invoice.customer?.name || 'Walk-in'}</TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase">
                    {invoice.payment_method}
                  </span>
                </TableCell>
                <TableCell>₹{(invoice.subtotal || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(invoice.tax_amount || 0).toLocaleString()}</TableCell>
                <TableCell className="text-right font-bold text-primary">₹{(invoice.total_amount || 0).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SalesReport;
