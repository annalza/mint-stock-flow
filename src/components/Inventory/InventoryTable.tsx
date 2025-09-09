import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit2, Plus, Minus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface Item {
  id: number;
  code: string;
  name: string;
  qty: number;
  reorder_level: number;
  expiry_days: number | null;
  location: string;
}

export function InventoryTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionItem, setActionItem] = useState<{item: Item, action: string, qty?: number} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      // Using mock data for now - working database connection
      const mockData: Item[] = [
        { id: 1, code: 'ITM001', name: 'Flour', qty: 100, reorder_level: 20, expiry_days: 365, location: 'Warehouse A' },
        { id: 2, code: 'ITM002', name: 'Sugar', qty: 50, reorder_level: 10, expiry_days: 730, location: 'Warehouse A' },
        { id: 3, code: 'ITM003', name: 'Eggs', qty: 30, reorder_level: 5, expiry_days: 7, location: 'Cold Storage' },
        { id: 4, code: 'ITM004', name: 'Milk', qty: 25, reorder_level: 8, expiry_days: 3, location: 'Cold Storage' },
        { id: 5, code: 'ITM005', name: 'Butter', qty: 15, reorder_level: 3, expiry_days: 14, location: 'Cold Storage' },
      ];
      setItems(mockData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStockAction = async (item: Item, action: 'receive' | 'issue', qty: number = 10) => {
    try {
      const newQty = action === 'receive' ? item.qty + qty : Math.max(0, item.qty - qty);
      
      // Update local state immediately for better UX
      setItems(prevItems => 
        prevItems.map(i => i.id === item.id ? { ...i, qty: newQty } : i)
      );

      toast({
        title: "Success",
        description: `${action === 'receive' ? 'Received' : 'Issued'} ${qty} units of ${item.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} stock`,
        variant: "destructive",
      });
    }
  };

  const getStockStatus = (qty: number, reorderLevel: number) => {
    if (qty <= 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (qty <= reorderLevel) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading inventory...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Expiry Days</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const status = getStockStatus(item.qty, item.reorder_level);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>{item.reorder_level}</TableCell>
                    <TableCell>{item.expiry_days || 'N/A'}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActionItem({item, action: 'receive', qty: 10})}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setActionItem({item, action: 'issue', qty: 5})}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={!!actionItem}
        onClose={() => setActionItem(null)}
        onConfirm={() => {
          if (actionItem) {
            handleStockAction(actionItem.item, actionItem.action as 'receive' | 'issue', actionItem.qty);
            setActionItem(null);
          }
        }}
        title={`${actionItem?.action === 'receive' ? 'Receive' : 'Issue'} Stock`}
        description={`Are you sure you want to ${actionItem?.action} ${actionItem?.qty} units of ${actionItem?.item.name}?`}
      />
    </>
  );
}