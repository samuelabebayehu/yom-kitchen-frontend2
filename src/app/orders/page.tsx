"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/client/client-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import withAuth from "@/lib/auth";
import { z } from "zod";
import { orderResponseSchema } from "@/lib/validations/order";


export default function MyOrders() {
  const [orders, setOrders] = useState<z.infer<typeof orderResponseSchema>[]>(
    []
  );
  const [passcode, setPasscode] = useState("");
  const [isPasscodeValid, setIsPasscodeValid] = useState(false);
  const [passcodeError, setPasscodeError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  useEffect(() => {
    // No longer loading orders directly from localStorage on component mount
    // Orders will be fetched from the API after successful passcode verification
  }, []);

  useEffect(() => {
    // Keep saving to localStorage for now, but consider if you want to persist orders after passcode auth
    if (isPasscodeValid) {
      // Only save if passcode is valid and orders are loaded
      localStorage.setItem("orderHistory", JSON.stringify(orders));
    }
  }, [orders, isPasscodeValid]);

  const handleVerifyPasscode = async () => {
    const axiosInstance = withAuth();
    setIsLoading(true); // Start loading
    setPasscodeError(""); // Clear any previous error

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/client/orders?client_password=${passcode}`
      );
      if (response.status !== 201 && response.status !== 200) {
        const errorData = await response.data;
        setIsPasscodeValid(false);
        setPasscodeError(
          errorData.error || "Incorrect passcode or error fetching orders."
        ); // Get error message from API response
        setOrders([]); // Clear orders on error
        throw new Error(`Failed to create order. Status: ${response.status}`);
      }

      const data = await response.data;
      setOrders(data || []); // Expecting 'orders' array in response
      setIsPasscodeValid(true);
      setPasscodeError("");
    } catch (error) {
      setIsPasscodeValid(false);
      setPasscodeError("Error connecting to server. Please try again."); // Network error or similar
      setOrders([]);
      console.error("Error verifying passcode:", error);
    } finally {
      setIsLoading(false); // End loading, whether success or error
    }
  };

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasscode(e.target.value);
    setPasscodeError(""); // Clear error on input change
  };

  if (!isPasscodeValid) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                Enter Passcode to View Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="passcode">Passcode</Label>
                <Input
                  id="passcode"
                  placeholder="Enter passcode"
                  type="password"
                  value={passcode}
                  onChange={handlePasscodeChange}
                  disabled={isLoading} // Disable input during loading
                />
              </div>
              {passcodeError && (
                <p className="text-sm text-destructive">{passcodeError}</p>
              )}
              <Button
                onClick={handleVerifyPasscode}
                className="w-full"
                disabled={isLoading}
              >
                {" "}
                {/* Disable button during loading */}
                {isLoading ? "Verifying..." : "Verify Passcode"}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <p>You havent placed any orders yet.</p>
        ) : (
          <div className="mb-4">
            <div className="bg-gray-50 px-4 py-3">
              <h2 className="text-sm font-medium text-gray-900">
                 ({orders.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.ID} className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center items-start justify-between gap-4">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-medium">
                          {order.client.name.charAt(0) || "C"}
                        </div>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">Order #{order.ID}</span>
                          <span className="text-gray-500">
                            {order.client.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {order.notes || "No notes"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col mt-2 pl-14 text-left md:text-right">
                      
                        <p className="text-sm font-medium text-gray-900">
                          ${order.total_amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.order_date).toLocaleString()}
                        </p>
                        <p>{order.status}</p>
                    
                     
                    </div>
                  </div>
                 
                    <div className="mt-2 pl-14">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Order Items:
                        
                      </h4>
                   
                      {order.order_items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span
                            className="font-medium"
                            style={{ color: `hsl(${index * 60}, 70%, 45%)` }}
                          >
                            {item.item_name}{" "}
                            <span className="inline-flex items-center justify-center bg-gray-200 text-gray-800 rounded-full w-6 h-6 ml-2">
                              {item.quantity}
                            </span>
                          </span>
                          <span className="text-gray-600">
                            ${(item.item_price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
