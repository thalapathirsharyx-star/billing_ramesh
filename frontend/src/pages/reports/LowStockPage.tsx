import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { AnalyticsService } from '@/service/analytics.service';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, ShoppingCart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LowStockPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const storeId = (user as any)?.company?.id;
      const res = await AnalyticsService.GetLowStock(storeId);
      setData(res);
    } catch (err) {
      toast.error("Failed to fetch low stock report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-brand-bg">
      <div className="page-header-brand flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Low Stock Alerts</h1>
          <p className="text-blue-100/80 font-medium">Inventory items currently below their reorder threshold</p>
        </div>
        <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl" onClick={fetchData}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-[32px] p-8 border border-red-100 shadow-sm flex items-center gap-6">
          <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Items to Reorder</p>
            <h3 className="text-4xl font-black text-slate-900">{data.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-blue-100 shadow-sm flex items-center gap-6">
          <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <ShoppingCart size={32} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Critical Stockouts</p>
            <h3 className="text-4xl font-black text-slate-900">{data.filter(i => i.current_stock === 0).length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 pl-6">Product Details</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 text-center">Current Stock</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 text-center">Reorder Level</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 text-right pr-6">Suggested Purchase</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground">Checking stock levels...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground">All items are well-stocked!</TableCell></TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors group">
                  <TableCell className="py-4 pl-6">
                    <div className="font-black text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold">SKU: {item.sku}</div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${item.current_stock === 0 ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'}`}>
                      {item.current_stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-400 py-4">{item.reorder_level}</TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <div className="flex justify-end items-center gap-2 text-blue-600 font-black">
                      {item.suggested_purchase} Units
                      <ArrowRight size={14} />
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

export default LowStockPage;
