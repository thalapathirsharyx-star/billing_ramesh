import React, { useState } from 'react';
import { CartProvider, useCart } from '@/context/CartContext';
import BarcodeScanner from '@/components/pos/BarcodeScanner';
import ProductSearch from '@/components/pos/ProductSearch';
import Cart from '@/components/pos/Cart';
import Checkout from '@/components/pos/Checkout';
import { Button } from '@/components/ui/button';
import { Camera, ScanBarcode, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const POSContent: React.FC = () => {
  const { user } = useAuth();
  const { addItem, items, clearCart } = useCart();
  const [showScanner, setShowScanner] = useState(false);
  const [heldCarts, setHeldCarts] = useState<any[]>([]);

  const handleProductFound = (product: any) => {
    addItem(product, 1);
  };

  const handleHoldCart = () => {
    if (items.length === 0) return;
    setHeldCarts([...heldCarts, { id: Date.now(), items: [...items], time: new Date() }]);
    clearCart();
    toast.success("Cart held successfully");
  };

  const handleResumeCart = (cart: any) => {
    if (items.length > 0) {
      toast.error("Please clear current cart first");
      return;
    }
    cart.items.forEach((item: any) => addItem(item, item.quantity));
    setHeldCarts(heldCarts.filter(c => c.id !== cart.id));
    toast.success("Cart resumed");
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* POS Top Control Panel */}
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <ScanBarcode className="w-4 h-4" />
              </div>
              POS Terminal
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Operator: {user?.name || 'User'}</p>
          </div>

          <div className="h-10 w-[1px] bg-slate-100" />

          {/* Held Carts quick access */}
          <div className="flex gap-3 overflow-x-auto py-1 max-w-[400px] no-scrollbar">
            {heldCarts.map((cart, idx) => (
              <button 
                key={cart.id}
                onClick={() => handleResumeCart(cart)}
                className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-2xl text-[10px] font-black hover:bg-amber-100 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                HELD #{idx + 1}
              </button>
            ))}
            {heldCarts.length === 0 && (
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">No Active Holds</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleHoldCart} 
            disabled={items.length === 0} 
            className="rounded-xl border-slate-200 font-bold text-xs h-10 px-6"
          >
            Hold Cart
          </Button>
          <Button 
            variant={showScanner ? "default" : "secondary"} 
            size="sm" 
            onClick={() => setShowScanner(!showScanner)}
            className="rounded-xl font-bold text-xs h-10 px-6"
          >
            <Camera className="w-4 h-4 mr-2" />
            {showScanner ? "Hide Scanner" : "Live Scan"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-10">
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Scanner Overlay */}
          {showScanner && (
            <div className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative border-4 border-white aspect-video max-w-2xl mx-auto ring-1 ring-slate-200 animate-in zoom-in-95 duration-300">
              <BarcodeScanner onScan={handleProductFound} />
              <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none" />
              <button 
                onClick={() => setShowScanner(false)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Search Section */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-visible">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Product Search</h2>
                <p className="text-xs text-slate-400 font-medium">Add items by name, barcode or SKU</p>
              </div>
            </div>
            <ProductSearch onProductFound={handleProductFound} />
          </div>
          
          {/* Cart Section */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                Cart Items 
                <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">{items.length}</span>
              </h2>
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold text-[10px] uppercase tracking-widest">
                Clear All
              </Button>
            </div>
            <div className="p-2">
              <Cart />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 sticky top-6">
          <Checkout />
        </div>
      </div>
    </div>
  );
};

const POSPage: React.FC = () => {
  return (
    <CartProvider>
      <POSContent />
    </CartProvider>
  );
};

export default POSPage;
