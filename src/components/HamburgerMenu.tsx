import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  BarChart3, 
  AlertTriangle, 
  FileText,
  Home,
  X 
} from "lucide-react";

interface HamburgerMenuProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Main Dashboard',
    icon: Home,
    description: 'Railway operations overview'
  },
  {
    id: 'scenario-simulation',
    label: 'Scenario Simulation',
    icon: BarChart3,
    description: 'Test different railway scenarios'
  },
  {
    id: 'disruption-management',
    label: 'Disruption Management',
    icon: AlertTriangle,
    description: 'Handle service disruptions'
  },
  {
    id: 'audit-trail',
    label: 'Audit Trail',
    icon: FileText,
    description: 'System activity logs'
  }
];

export function HamburgerMenu({ currentView, onViewChange }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);

  const handleItemClick = (viewId: string) => {
    onViewChange(viewId);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Railway Control Center</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-4 ${
                  isActive ? 'bg-primary text-primary-foreground' : ''
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm opacity-70">{item.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">Quick Access</p>
            <p>Use the menu to switch between different railway management modules.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Desktop navigation menu
export function DesktopMenu({ currentView, onViewChange }: HamburgerMenuProps) {
  return (
    <div className="hidden md:flex space-x-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(item.id)}
            className="space-x-2"
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        );
      })}
    </div>
  );
}