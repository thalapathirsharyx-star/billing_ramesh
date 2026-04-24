import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { AnalyticsService } from '@/service/analytics.service';
import { Button } from '@/components/ui/button';
import { RefreshCw, Package, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';

const ItemProfitPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const storeId = (user as any)?.company?.id;
      const res = await AnalyticsService.GetItemWiseProfit(storeId, startDate, endDate);
      setData(res);
    } catch (err) {
      toast.error("Failed to fetch item-wise profit");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user, startDate, endDate]);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-brand-bg">
      <div className="page-header-brand flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Product Performance</h1>
          <p className="text-blue-100/80 font-medium">Rank products by revenue and profitability</p>
        </div>
        <div className="flex gap-2 bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/10">
          <Input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-transparent border-none text-white font-bold h-10 w-40 [color-scheme:dark]"
          />
          <div className="flex items-center text-white/40 font-black">TO</div>
          <Input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-transparent border-none text-white font-bold h-10 w-40 [color-scheme:dark]"
          />
          <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl" onClick={fetchData}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="h-16 w-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
            <Star size={32} fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Most Profitable Item</p>
            <h3 className="text-2xl font-black text-slate-900">{data[0]?.name || 'N/A'}</h3>
            <p className="text-xs font-bold text-emerald-600">₹{data[0]?.profit.toLocaleString() || 0} Profit</p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <Package size={32} fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Best Seller (Quantity)</p>
            <h3 className="text-2xl font-black text-slate-900">
              {data.sort((a,b) => b.quantity_sold - a.quantity_sold)[0]?.name || 'N/A'}
            </h3>
            <p className="text-xs font-bold text-blue-600">{data.sort((a,b) => b.quantity_sold - a.quantity_sold)[0]?.quantity_sold || 0} Units Sold</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 pl-6">Product</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 text-center">Qty Sold</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 text-right">Revenue</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 text-right">Cost</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 text-right pr-6">Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">Analyzing item performance...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-20 text-muted-foreground">No sales data found</TableCell></TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={item.product_id} className="hover:bg-slate-50/50 border-slate-50 transition-colors group">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center font-black text-slate-300 text-xs group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-black text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold">SKU: {item.sku}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-600">{item.quantity_sold}</TableCell>
                  <TableCell className="text-right font-bold text-slate-900">₹{item.total_revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium text-slate-400">₹{item.total_cost.toLocaleString()}</TableCell>
                  <TableCell className={`text-right pr-6 font-black ${item.profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    <div className="flex justify-end items-center gap-1">
                      {item.profit >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      ₹{item.profit.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ItemProfitPage;
