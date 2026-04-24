import React, { useState, useEffect } from 'react';
import { InventoryService } from '@/service/inventory.service';
import { ProductService } from '@/service/product.service';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import InventoryList from '@/components/inventory/InventoryList';
import StockAdjustmentForm from '@/components/inventory/StockAdjustmentForm';
import { toast } from 'sonner';

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const storeId = (user as any)?.company?.id || (user as any)?.user_id;
      if (!storeId || storeId === "undefined") {
        setIsLoading(false);
        return;
      }
      const data = await ProductService.GetList(storeId);
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setProducts(list);
      setFilteredProducts(list);
    } catch (err) {
      toast.error("Failed to fetch inventory");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredProducts(
      products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.sku.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, products]);

  const handleAdjust = (product: any) => {
    setSelectedProduct(product);
    setIsAdjustOpen(true);
  };

  const handleAdjustmentSubmit = async (data: any) => {
    try {
      await InventoryService.AdjustStock({
        product_id: selectedProduct.id,
        ...data
      });
      toast.success("Stock updated successfully");
      setIsAdjustOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Adjustment failed");
    }
  };

  const lowStockCount = Array.isArray(products) ? products.filter(p => p.quantity_in_stock <= 5).length : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Stock Control</h1>
          <p className="text-muted-foreground">Monitor and adjust inventory levels across your store</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total SKUs</div>
            <div className="text-2xl font-bold">{products.length}</div>
          </div>
        </div>
        
        <div className={`bg-card p-6 rounded-2xl border shadow-sm flex items-center gap-4 ${lowStockCount > 0 ? 'border-red-200 bg-red-50' : ''}`}>
          <div className={`p-3 rounded-xl ${lowStockCount > 0 ? 'bg-red-100 text-red-700' : 'bg-muted text-muted-foreground'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Low Stock Alerts</div>
            <div className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-700' : ''}`}>{lowStockCount} Items</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border shadow-sm p-4 mb-6">
        <Input 
          placeholder="Search inventory by product name or SKU..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <InventoryList 
        products={filteredProducts} 
        onAdjust={handleAdjust} 
        onViewHistory={(p) => toast.info(`History for ${p.name} coming soon`)} 
      />

      <StockAdjustmentForm 
        product={selectedProduct} 
        isOpen={isAdjustOpen} 
        onClose={() => setIsAdjustOpen(false)} 
        onSubmit={handleAdjustmentSubmit}
      />
    </div>
  );
};

export default InventoryPage;
