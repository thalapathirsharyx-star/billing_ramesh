import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { AnalyticsService } from '@/service/analytics.service';
import { Button } from '@/components/ui/button';
import { RefreshCw, Hash, ShieldCheck, Tag, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SerialReportPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const storeId = (user as any)?.company?.id;
      const res = await AnalyticsService.GetSerialReport(storeId);
      setData(res);
    } catch (err) {
      toast.error("Failed to fetch serial report");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return 'bg-emerald-100 text-emerald-700';
      case 'SOLD': return 'bg-blue-100 text-blue-700';
      case 'RETURNED': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-brand-bg">
      <div className="page-header-brand flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Unique Serial Tracker</h1>
          <p className="text-blue-100/80 font-medium">Individual item tracking for premium inventory and warranty management</p>
        </div>
        <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl" onClick={fetchData}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <Hash size={32} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Total Tracked Serials</p>
            <h3 className="text-4xl font-black text-slate-900">{data.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-emerald-100 shadow-sm flex items-center gap-6">
          <div className="h-16 w-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
            <Tag size={32} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Available in Stock</p>
            <h3 className="text-4xl font-black text-emerald-600">{data.filter(s => s.status === 'IN_STOCK').length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-blue-100 shadow-sm flex items-center gap-6">
          <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
            <ShieldCheck size={32} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Total Sold</p>
            <h3 className="text-4xl font-black text-blue-600">{data.filter(s => s.status === 'SOLD').length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 pl-6">Serial Number</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4">Product</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 text-center">Status</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 py-4 pr-6">Linked Document</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground">Scanning serial registry...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-20 text-muted-foreground">No serialized items found</TableCell></TableRow>
            ) : (
              data.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-2 font-black text-slate-900">
                      <Hash size={14} className="text-slate-300" />
                      {s.serial_number}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 font-bold text-slate-600">{s.product?.name}</TableCell>
                  <TableCell className="text-center py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 pr-6">
                    {s.invoice ? (
                      <div className="flex items-center gap-2 text-xs font-black text-blue-600">
                        <FileText size={14} />
                        {s.invoice.invoice_number}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">—</span>
                    )}
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

export default SerialReportPage;
