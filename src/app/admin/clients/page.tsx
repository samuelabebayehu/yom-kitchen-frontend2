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

interface Client {
  ID: string;
  name: string;
  passcode: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  is_active: boolean;
}

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/clients`
      );
      if (response.statusText != "OK") {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.data;
      console.log("data", data);
      setClients(data);
    } catch (e: any) {
      setError(e.message || "Could not fetch clients.");
      toast.error(e.message || "Could not fetch clients.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const handleDeleteClient = async (clientId: string) => {
    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/clients/${clientId}`
      );
      if (!response.statusText.includes("OK")) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedClients = clients.filter((client) => client.ID !== clientId);
      setClients(updatedClients);
      toast.success("Client deleted successfully!");
      fetchClients();
    } catch (e: any) {
      setError(e.message || "Error deleting client.");
      toast.error(e.message || "Error deleting client.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading clients...</p>;
  }

  if (error) {
    return <p>Error loading clients: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="my-4">Clients List</h1>
      <Link href="/admin/clients/create">
        {" "}
        <Button>
          <PlusCircleIcon /> Create Client
        </Button>
      </Link>

      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.ID}>
                <TableCell>{client.ID}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.passcode}</TableCell>
                <TableCell>{client.email || "-"}</TableCell>
                <TableCell>{client.phone || "-"}</TableCell>
                <TableCell>{client.address || "-"}</TableCell>
                <TableCell>{client.is_active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/clients/edit/${client.ID}`}
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
                    onClick={() => handleDeleteClient(client.ID)}
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

export default ClientList;
