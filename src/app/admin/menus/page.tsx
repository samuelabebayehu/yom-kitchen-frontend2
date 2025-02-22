"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import withAuth from "@/lib/auth";
import { PlusCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import {menuResponseSchema} from "@/lib/validations/menu"


const MenuList = () => {
  const [menus, setMenus] = useState<z.infer<typeof menuResponseSchema>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = async () => {
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/menus`
      );
      if (response.statusText != "OK") {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.data;
      setMenus(data);
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
      setError(e.message || "Could not fetch menus.");
      toast.error(e.message || "Could not fetch menus.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDeleteMenu = async (menuId: number) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) {
      return;
    }
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/menus/${menuId}`
      );
      if (!response.statusText.includes("OK")) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedMenus = menus.filter((menu) => menu.ID !== menuId);
      setMenus(updatedMenus);
      toast.success("menu deleted successfully!");
      fetchMenus();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
      setError(e.message || "Error deleting menu.");
      toast.error(e.message || "Error deleting menu.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (
    menuId: number,
    currentStatus: boolean
  ) => {
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/menus/${menuId}`
      );
      if (!response.statusText.includes("OK")) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedMenus = menus.map((menu) =>
        menu.ID === menuId ? { ...menu, available: !currentStatus } : menu
      );
      setMenus(updatedMenus);
      toast.success("Menu availability updated successfully!");
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
      setError(e.message || "Error updating menu availability.");
      toast.error(e.message || "Error updating menu availability.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading menus...</p>;
  }

  if (error) {
    return <p>Error loading menus: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="my-4">Menus List</h1>
      <Link href="/admin/menus/create">
        {" "}
        <Button>
          <PlusCircleIcon /> Create Menu
        </Button>
      </Link>

      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Available</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menus.map((menu) => (
              <TableRow key={menu.ID}>
                <TableCell>{menu.ID}</TableCell>
                <TableHead>
                  <Avatar>
                    <AvatarImage
                      src={
                        menu.image_url
                          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${
                              menu.image_url.startsWith("/") ? "" : "/"
                            }${menu.image_url}`
                          : ""
                      }
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TableHead>
                <TableCell>{menu.name}</TableCell>
                <TableCell>{menu.desc}</TableCell>
                <TableCell>{menu.price || "-"}</TableCell>
                <TableCell>{menu.category || "-"}</TableCell>
                <TableCell>
                  <Switch
                    checked={menu.available}
                    onCheckedChange={() => {
                      handleToggleAvailability(menu.ID, menu.available);
                    }}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/menus/edit/${menu.ID}`}
                    className={buttonVariants({ variant: "ghost" })}
                  >
                    {" "}
                    Edit
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMenu(menu.ID)}
                    disabled={loading}
                  >
                    {" "}
                    Delete
                    {loading && (
                      <span className="ml-2 loading loading-spinner-sm"></span>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MenuList;
