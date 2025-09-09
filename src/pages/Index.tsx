import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { InventoryTable } from "@/components/Inventory/InventoryTable";
import { RecipeManager } from "@/components/Recipes/RecipeManager";
import { ProcurementManager } from "@/components/Procurement/ProcurementManager";

// Update navigation to use state
const navigationItems = [
  { key: "inventory", label: "Inventory" },
  { key: "recipes", label: "Recipes" },
  { key: "procurement", label: "Procurement" },
  { key: "suppliers", label: "Suppliers" },
  { key: "reports", label: "Reports" },
  { key: "forecast", label: "Forecast" },
  { key: "admin", label: "Admin" },
];

const Index = () => {
  const [currentPage, setCurrentPage] = useState("inventory");

  const renderContent = () => {
    switch (currentPage) {
      case "inventory":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <InventoryTable />
          </div>
        );
      case "recipes":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Recipe Management</h1>
            <RecipeManager />
          </div>
        );
      case "procurement":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Procurement Management</h1>
            <ProcurementManager />
          </div>
        );
      case "suppliers":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Supplier Management</h1>
            <p>Supplier management coming soon...</p>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p>Reports and analytics coming soon...</p>
          </div>
        );
      case "forecast":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Demand Forecasting</h1>
            <p>Demand forecasting coming soon...</p>
          </div>
        );
      case "admin":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p>Admin panel for procurement approvals coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">HTTM ERP System</h1>
            <p>Select a section from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar onNavigate={setCurrentPage} currentPage={currentPage} />
        <main className="flex-1">
          <div className="border-b bg-background px-4 py-2">
            <SidebarTrigger />
          </div>
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
