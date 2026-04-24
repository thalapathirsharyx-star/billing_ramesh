import React from 'react';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/30">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-lg font-medium">Cart is empty</p>
        <p className="text-sm">Scan a product or search to add items</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            let itemDiscount = 0;
            if (item.discount_value) {
              if (item.discount_type === 'PERCENTAGE') {
                itemDiscount = (item.price * item.quantity * item.discount_value) / 100;
              } else {
                itemDiscount = item.discount_value;
              }
            }
            const itemTotal = (item.price * item.quantity) - itemDiscount;

            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">GST: {item.gst_percentage}%</div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-600">₹{item.price.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-xl border-slate-200"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-4 text-center font-black text-sm">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-xl border-slate-200"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={item.discount_value || ''}
                      onChange={(e) => updateDiscount(item.id, item.discount_type || 'PERCENTAGE', parseFloat(e.target.value) || 0)}
                      className="w-16 h-8 px-2 text-xs font-bold border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                      placeholder="0"
                    />
                    <select 
                      value={item.discount_type}
                      onChange={(e) => updateDiscount(item.id, e.target.value as any, item.discount_value || 0)}
                      className="h-8 text-[10px] font-black border rounded-lg bg-slate-50 px-1 outline-none"
                    >
                      <option value="PERCENTAGE">%</option>
                      <option value="FIXED">₹</option>
                    </select>
                  </div>
                </TableCell>
                <TableCell className="font-black text-primary">
                  ₹{itemTotal.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default Cart;
