"use client"

import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/custom-breadcrumb"

export function BreadcrumbFromUrl() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter((segment) => segment !== "")

  return (
    <Breadcrumb className="my-4 mx-1">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1

          return (
            <BreadcrumbItem key={href}>
              <span className="mx-2 text-gray-400">
                <ChevronRight className="h-4 w-4 inline-block" />
              </span>
              {!isLast ? (
                <BreadcrumbLink href={href} className="capitalize hidden sm:inline md:inline-flex">
                  {segment}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="capitalize">{segment}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

