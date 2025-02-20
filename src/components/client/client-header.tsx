"use client"

import Link from "next/link"
import { ClipboardList, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useOrder } from "@/contexts/order-context"

export function Header() {
  const { totalItems, totalPrice } = useOrder()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            YOM KITCHEN
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <span className="font-bold">{totalItems}</span> items
            </div>
            <div className="hidden sm:block">
              Total: <span className="font-bold">${totalPrice.toFixed(2)}</span>
            </div>
            <Link href="/orders">
              <Button variant="outline">
                <ClipboardList className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">My Orders</span>
              </Button>
            </Link>
            <Link href="/checkout">
              <Button>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Checkout</span>
                <span className="sm:hidden">({totalItems})</span>
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </header>
  )
}

