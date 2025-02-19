"use client";
import React, { useEffect, useState } from "react";
import MenuItemCard from "./menu-card";
import z from "zod";
import { menuResponseSchema } from "@/lib/validations/menu";
import { Skeleton } from "./ui/skeleton";
import withAuth from "@/lib/auth";

const ClientOrder = () => {
  const [menuItems, setMenuItems] = useState<
    z.infer<typeof menuResponseSchema>[]
  >([]);
  const [order, setOrder] = useState({});

  useEffect(() => {
    const axiosInstance = withAuth();
    const fetchData = async () => {
      try {
        const [menuItemsResponse] = await Promise.all([

          axiosInstance.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/client/menus`
          ),
        ]);

        setMenuItems(menuResponseSchema.array().parse(menuItemsResponse.data));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="menu">
      {menuItems.length>0 ? (
        <MenuItemCard items={menuItems} />
      ) : (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientOrder;
