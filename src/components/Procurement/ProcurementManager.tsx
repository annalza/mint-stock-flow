import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Eye, Trash2 } from "lucide-react";
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  item_name: string;
  item_code: string;
  requested_by?: string;
  approved_by?: string;
  approved_at?: string;
}

export function ProcurementManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [requestItem, setRequestItem] = useState<{itemId: number, qty: number} | null>(null);
  const [approvalAction, setApprovalAction] = useState<{procurement: Procurement, action: 'approve' | 'reject'} | null>(null);
  const [deleteItem, setDeleteItem] = useState<Procurement | null>(null);
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

      // Mock data for procurements with admin features
      const mockProcurements: Procurement[] = [
        { 
          id: 1, 
          item_id: 1, 
          qty_requested: 50, 
          status: 'PENDING', 
          created_at: '2025-09-09',
          item_name: 'Flour',
          item_code: 'ITM001',
          requested_by: 'John Doe'
        },
        { 
          id: 2, 
          item_id: 3, 
          qty_requested: 20, 
          status: 'APPROVED', 
          created_at: '2025-09-08',
          item_name: 'Eggs',
          item_code: 'ITM003',
          requested_by: 'Jane Smith',
          approved_by: 'Admin',
          approved_at: '2025-09-09'
        },
        {
          id: 3,
          item_id: 2,
          qty_requested: 30,
          status: 'REJECTED',
          created_at: '2025-09-07',
          item_name: 'Sugar',
          item_code: 'ITM002',
          requested_by: 'Mike Johnson',
          approved_by: 'Admin',
          approved_at: '2025-09-08'
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
        requested_by: 'Current User',
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

  const handleApprovalAction = async (procurement: Procurement, action: 'approve' | 'reject') => {
    try {
      const updatedProcurement: Procurement = {
        ...procurement,
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        approved_by: 'Admin',
        approved_at: new Date().toISOString().split('T')[0]
      };

      setProcurements(prev => 
        prev.map(p => p.id === procurement.id ? updatedProcurement : p)
      );

      toast({
        title: "Success",
        description: `Request ${action}d successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} request`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (procurementId: number) => {
    try {
      setProcurements(prev => prev.filter(p => p.id !== procurementId));
      toast({
        title: "Success",
        description: "Procurement request deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete procurement request",
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

  const filterProcurements = (status?: string) => {
    if (!status || status === 'all') return procurements;
    return procurements.filter(p => p.status === status.toUpperCase());
  };

  const renderProcurementTable = (filteredProcurements: Procurement[], showAdminActions = false) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item Code</TableHead>
          <TableHead>Item Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Requested By</TableHead>
          <TableHead>Date</TableHead>
          {showAdminActions && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProcurements.map((procurement) => (
          <TableRow key={procurement.id}>
            <TableCell className="font-medium">{procurement.item_code}</TableCell>
            <TableCell>{procurement.item_name}</TableCell>
            <TableCell>{procurement.qty_requested}</TableCell>
            <TableCell>{getStatusBadge(procurement.status)}</TableCell>
            <TableCell>{procurement.requested_by || 'Unknown'}</TableCell>
            <TableCell>{new Date(procurement.created_at).toLocaleDateString()}</TableCell>
            {showAdminActions && (
              <TableCell>
                <div className="flex gap-2">
                  {procurement.status === 'PENDING' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setApprovalAction({procurement, action: 'approve'})}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setApprovalAction({procurement, action: 'reject'})}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDeleteItem(procurement)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

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
          <CardTitle>Procurement Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="admin">Admin Panel</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {renderProcurementTable(filterProcurements('all'))}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {renderProcurementTable(filterProcurements('pending'))}
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
              {renderProcurementTable(filterProcurements('approved'))}
            </TabsContent>
            
            <TabsContent value="rejected" className="space-y-4">
              {renderProcurementTable(filterProcurements('rejected'))}
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Admin Approval Panel</h3>
                <p className="text-sm text-muted-foreground">Review and approve/reject pending procurement requests</p>
              </div>
              {renderProcurementTable(filterProcurements('pending'), true)}
            </TabsContent>
          </Tabs>
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

      <ConfirmDialog
        isOpen={!!approvalAction}
        onClose={() => setApprovalAction(null)}
        onConfirm={() => {
          if (approvalAction) {
            handleApprovalAction(approvalAction.procurement, approvalAction.action);
            setApprovalAction(null);
          }
        }}
        title={`${approvalAction?.action === 'approve' ? 'Approve' : 'Reject'} Request`}
        description={`Are you sure you want to ${approvalAction?.action} the procurement request for ${approvalAction?.procurement.item_name}?`}
        confirmText={approvalAction?.action === 'approve' ? 'Approve' : 'Reject'}
      />

      <ConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem) {
            handleDelete(deleteItem.id);
            setDeleteItem(null);
          }
        }}
        title="Delete Procurement Request"
        description={`Are you sure you want to delete the procurement request for ${deleteItem?.item_name}?`}
        confirmText="Delete"
      />
    </div>
  );
}