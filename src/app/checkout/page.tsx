"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/client/client-header"
import { useOrder } from "@/contexts/order-context"
import axios from "axios"
import withAuth from "@/lib/auth"
import {clientOrderSchema } from "@/lib/validations/order"
import { z } from "zod"


export default function Checkout() {
  const { order, totalPrice, addToOrder, removeFromOrder, clearOrder } = useOrder() // Add clearOrder
  const [passcode, setPasscode] = useState("")
  const [notes, setNotes] = useState("")
  const router = useRouter() // Add this line

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateOrder = async (values: z.infer<typeof clientOrderSchema>) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const axiosInstance = withAuth();
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/client/orders`,
        values
      );

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(`Failed to create order. Status: ${response.status}`);
      }
      setSuccessMessage("Order created successfully!");
      clearOrder(); // Clear the order
      router.push("/"); // Redirect to home
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(
          e.response?.data?.message || e.message || "Error creating order."
        );
        console.error("Axios error creating order:", e);
      } else if (e instanceof Error) {
        setError(e.message || "Error creating order.");
      } else {
        setError("Error creating order.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = () => {
    // Here you would typically send the order and passcode to your backend
    console.log("Submitting order with passcode:", passcode, " and order ", order);
    const finalOrder = {
      passcode,
      order_items: order,
      notes
    };
    handleCreateOrder(finalOrder);
    // Reset order and redirect to confirmation page
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-md px-4 py-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Menu
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {order.map((item) => (
                <div key={item.menu_item_id} className="flex justify-between items-center mb-2">
                  <span>{item.item_name}</span>
                  <div className="flex items-center">
                    <Button variant="outline" size="icon" onClick={() => removeFromOrder(item.menu_item_id)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => addToOrder({ ...item, quantity: 1 })}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="ml-4 w-20 text-right">${(item.item_price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="font-bold mt-4 text-lg">Total: ${totalPrice.toFixed(2)}</div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="w-full">
                <label htmlFor="passcode" className="block mb-2">
                  Enter Passcode:
                </label>
                <Input
                  id="passcode"
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full">
                <label htmlFor="notes" className="block mb-2">
                  Enter Note
                </label>
                <Input
                  id="notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full"
                />
              </div>
              {error && <div className="text-red-500">{error}</div>} {/* Show error message */}
              {successMessage && <div className="text-green-500">{successMessage}</div>} {/* Show success message */}
              <Button onClick={handleSubmitOrder} className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Order"} {/* Show loading state */}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}

