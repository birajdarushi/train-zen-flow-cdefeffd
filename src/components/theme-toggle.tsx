import * as React from "react"
import { Menu, Train, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleNavigation("/scenario-simulator")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Train className="h-4 w-4" />
          Scenario Simulation
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigation("/audit-system")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Shield className="h-4 w-4" />
          Audit System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}