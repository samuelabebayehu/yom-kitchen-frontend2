'use client'
import React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import {orderResponseSchema} from "@/lib/validations/order"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"

interface OrderGroupProps {
  title: string
  orders: z.infer<typeof orderResponseSchema>[]
  onChangeStatus: (orderId: number, newStatus: z.infer<typeof orderResponseSchema>["status"]) => void
}

function OrderGroup({ title, orders, onChangeStatus }: OrderGroupProps) {
  const [expandedOrders, setExpandedOrders] = React.useState<number[]>(orders.map(order => order.ID))

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  return (
    <div className="mb-4">
      <div className="bg-gray-50 px-4 py-3">
        <h2 className="text-sm font-medium text-gray-900">
          {title} ({orders.length})
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <div key={order.ID} className="px-4 py-3 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-medium">
                    {order.client.name.charAt(0) || "C"}
                  </div>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium">Order #{order.ID}</span>
                    <span className="text-gray-500">{order.client.name}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{order.notes || "No notes"}</p>
                </div>
              </div>
              <div className="flex items-center ml-4">
                <div className="text-right mr-4">
                  <p className="text-sm font-medium text-gray-900">${order.total_amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.order_date).toLocaleString()}</p>
                </div>
                <Select
                  value={order.status}
                  onValueChange={(value) => onChangeStatus(order.ID, value as z.infer<typeof orderResponseSchema>["status"])}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Ready">Ready</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="ml-2" onClick={() => toggleOrderExpansion(order.ID)}>
                  {expandedOrders.includes(order.ID) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {expandedOrders.includes(order.ID) && (
              <div className="mt-2 pl-14">
                <h4 className="text-sm font-medium text-gray-900 mb-1">Order Items for : {order.client.name} : {order.client.phone}</h4>
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="font-medium" style={{ color: `hsl(${index * 60}, 70%, 45%)` }}>
                      {item.item_name}{" "}
                      <span className="inline-flex items-center justify-center bg-gray-200 text-gray-800 rounded-full w-6 h-6 ml-2">
                        {item.quantity}
                      </span>
                    </span>
                    <span className="text-gray-600">${(item.item_price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function OrdersView({
  orders,
  onChangeStatus,
}: { orders: z.infer<typeof orderResponseSchema>[]; onChangeStatus: (orderId: number, newStatus: z.infer<typeof orderResponseSchema>["status"]) => void }) {
  const groupedOrders = {
    Pending: orders.filter((order) => order.status === "Pending"),
    Accepted: orders.filter((order) => order.status === "Accepted"),
    Ready: orders.filter((order) => order.status === "Ready"),
    Delivered: orders.filter((order) => order.status === "Delivered"),
    Cancelled: orders.filter((order) => order.status === "Cancelled"),
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {(Object.keys(groupedOrders) as Array<keyof typeof groupedOrders>).map((status) => (
        <OrderGroup key={status} title={status} orders={groupedOrders[status]} onChangeStatus={onChangeStatus} />
      ))}
    </div>
  )
}

