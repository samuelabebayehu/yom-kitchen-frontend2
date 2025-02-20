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
import { userResponseSchema } from "@/lib/validations/user";
import { z } from "zod";



const UserList = () => {
  const [users, setUsers] = useState<z.infer<typeof userResponseSchema>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`
      );
      if (response.statusText != "OK") {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.data;
      setUsers(data);
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
      setError(e.message || "Could not fetch users.");
      toast.error(e.message || "Could not fetch users.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userID: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    const axiosInstance = withAuth();
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userID}`
      );
      if (!response.statusText.includes("OK")) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedUsers = users.filter((cuser) => cuser.id !== userID);
      setUsers(updatedUsers);
      toast.success("User deleted successfully!");
      fetchUsers();
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (e: any) {
      setError(e.message || "Error deleting user.");
      toast.error(e.message || "Error deleting user.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error loading users: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="my-4">Users List</h1>
      <Link href="/admin/users/create">
        {" "}
        <Button>
          <PlusCircleIcon /> Create User
        </Button>
      </Link>

      <div className="my-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.is_admin ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/users/edit/${user.id}`}
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
                    onClick={() => handleDeleteUser(user.id)}
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

export default UserList;
