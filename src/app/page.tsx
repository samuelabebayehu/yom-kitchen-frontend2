"use client";
import { MenuCard } from "@/components/client/clinent-menu-card";
import { useEffect, useState } from "react";
import { z } from "zod";
import { menuResponseSchema } from "@/lib/validations/menu";
import { useOrder } from "@/contexts/order-context"
import withAuth from "@/lib/auth";
import { Header } from "@/components/client/client-header";

export default function Home() {
  const [menuItems, setMenuItems] = useState<
    z.infer<typeof menuResponseSchema>[]
  >([]);
  const { addToOrder } = useOrder();

  useEffect(() => {
    const axiosInstance = withAuth();
    const fetchData = async () => {
      try {
        const menuItemsResponse = await axiosInstance.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/client/menus`
        );
        setMenuItems(menuResponseSchema.array().parse(menuItemsResponse.data));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddToOrder = (
    item: z.infer<typeof menuResponseSchema>,
    quantity: number
  ) => {
    if (quantity > 0) {
      addToOrder({
        menu_item_id: item.ID,
        item_name: item.name,
        item_price: item.price,
        quantity,
        subtotal: item.price * quantity,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <main>
          <main className="container mx-auto p-16">
            <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {menuItems.map((item) => (
                <MenuCard
                  key={item.ID}
                  item={item}
                  onAddToOrder={handleAddToOrder}
                />
              ))}
            </div>
          </main>
        </main>
      </div>
    </div>
  );
}
