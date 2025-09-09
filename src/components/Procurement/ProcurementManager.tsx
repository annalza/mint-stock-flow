import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface Item {
  id: number;
  name: string;
  code: string;
}

interface Procurement {
  id: number;
  item_id: number;
  qty_requested: number;
  status: string;
  created_at: string;
  item_name: string;
  item_code: string;
}

export function ProcurementManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [requestItem, setRequestItem] = useState<{itemId: number, qty: number} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Mock data for items
      const mockItems: Item[] = [
        { id: 1, name: 'Flour', code: 'ITM001' },
        { id: 2, name: 'Sugar', code: 'ITM002' },
        { id: 3, name: 'Eggs', code: 'ITM003' },
        { id: 4, name: 'Milk', code: 'ITM004' },
        { id: 5, name: 'Butter', code: 'ITM005' },
      ];

      // Mock data for procurements
      const mockProcurements: Procurement[] = [
        { 
          id: 1, 
          item_id: 1, 
          qty_requested: 50, 
          status: 'PENDING', 
          created_at: '2025-09-09',
          item_name: 'Flour',
          item_code: 'ITM001'
        },
        { 
          id: 2, 
          item_id: 3, 
          qty_requested: 20, 
          status: 'APPROVED', 
          created_at: '2025-09-08',
          item_name: 'Eggs',
          item_code: 'ITM003'
        },
      ];

      setItems(mockItems);
      setProcurements(mockProcurements);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedItemId || !quantity) {
      toast({
        title: "Error",
        description: "Please select an item and enter quantity",
        variant: "destructive",
      });
      return;
    }

    try {
      const selectedItem = items.find(item => item.id === parseInt(selectedItemId));
      if (!selectedItem) return;

      const newProcurement: Procurement = {
        id: procurements.length + 1,
        item_id: parseInt(selectedItemId),
        qty_requested: parseInt(quantity),
        status: 'PENDING',
        created_at: new Date().toISOString().split('T')[0],
        item_name: selectedItem.name,
        item_code: selectedItem.code,
      };

      setProcurements(prev => [newProcurement, ...prev]);
      setSelectedItemId("");
      setQuantity("");
      
      toast({
        title: "Success",
        description: "Procurement request submitted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "secondary" as const,
      APPROVED: "default" as const,
      REJECTED: "destructive" as const,
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading procurement data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Procurement Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="item">Item</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.code} - {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setRequestItem({itemId: parseInt(selectedItemId), qty: parseInt(quantity)})}
                disabled={!selectedItemId || !quantity}
                className="w-full"
              >
                Submit Request
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Procurement Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {procurements.map((procurement) => (
                <TableRow key={procurement.id}>
                  <TableCell className="font-medium">{procurement.item_code}</TableCell>
                  <TableCell>{procurement.item_name}</TableCell>
                  <TableCell>{procurement.qty_requested}</TableCell>
                  <TableCell>{getStatusBadge(procurement.status)}</TableCell>
                  <TableCell>{new Date(procurement.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={!!requestItem}
        onClose={() => setRequestItem(null)}
        onConfirm={() => {
          handleSubmitRequest();
          setRequestItem(null);
        }}
        title="Submit Procurement Request"
        description={`Are you sure you want to request ${requestItem?.qty} units of the selected item?`}
        confirmText="Submit"
      />
    </div>
  );
}