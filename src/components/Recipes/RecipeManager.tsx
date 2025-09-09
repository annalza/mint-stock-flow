import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface Recipe {
  id: number;
  name: string;
  price: number;
  items: {
    id: number;
    name: string;
    qty_required: number;
    available_qty: number;
  }[];
}

export function RecipeManager() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [saleItem, setSaleItem] = useState<Recipe | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      // Mock data for now since we're having type issues with HTTM schema
      const mockRecipes: Recipe[] = [
        {
          id: 1,
          name: 'Chocolate Cake',
          price: 25.00,
          items: [
            { id: 1, name: 'Flour', qty_required: 2, available_qty: 100 },
            { id: 2, name: 'Sugar', qty_required: 1, available_qty: 50 },
            { id: 3, name: 'Eggs', qty_required: 3, available_qty: 30 },
          ]
        },
        {
          id: 2,
          name: 'Vanilla Muffin',
          price: 5.00,
          items: [
            { id: 1, name: 'Flour', qty_required: 1, available_qty: 100 },
            { id: 2, name: 'Sugar', qty_required: 1, available_qty: 50 },
          ]
        },
        {
          id: 3,
          name: 'Bread Loaf',
          price: 8.50,
          items: [
            { id: 1, name: 'Flour', qty_required: 3, available_qty: 100 },
            { id: 4, name: 'Milk', qty_required: 1, available_qty: 25 },
          ]
        }
      ];
      
      setRecipes(mockRecipes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recipes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canMakeRecipe = (recipe: Recipe) => {
    return recipe.items.every(item => item.available_qty >= item.qty_required);
  };

  const handleSellRecipe = async (recipe: Recipe) => {
    try {
      // Update recipe items availability locally
      setRecipes(prevRecipes => 
        prevRecipes.map(r => 
          r.id === recipe.id 
            ? {
                ...r,
                items: r.items.map(item => ({
                  ...item,
                  available_qty: item.available_qty - item.qty_required
                }))
              }
            : r
        )
      );

      toast({
        title: "Recipe Sold!",
        description: `${recipe.name} sold for $${recipe.price}. Ingredients deducted from inventory.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sell recipe",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading recipes...</div>;
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => {
          const canMake = canMakeRecipe(recipe);
          return (
            <Card key={recipe.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {recipe.name}
                  <Badge variant={canMake ? "default" : "secondary"}>
                    ${recipe.price}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium">Ingredients:</h4>
                  {recipe.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className={item.available_qty < item.qty_required ? "text-destructive" : ""}>
                        {item.qty_required} / {item.available_qty}
                      </span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full" 
                  disabled={!canMake}
                  onClick={() => setSaleItem(recipe)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {canMake ? "Sell Recipe" : "Insufficient Stock"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!saleItem}
        onClose={() => setSaleItem(null)}
        onConfirm={() => {
          if (saleItem) {
            handleSellRecipe(saleItem);
            setSaleItem(null);
          }
        }}
        title="Sell Recipe"
        description={`Are you sure you want to sell ${saleItem?.name} for $${saleItem?.price}? This will deduct the required ingredients from inventory.`}
        confirmText="Sell"
      />
    </>
  );
}