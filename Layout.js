import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sprout,
  MessageCircle,
  Leaf,
  Library,
  Calendar,
  HeartPulse,
  ShoppingBag,
  Search,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "My Garden",
    url: createPageUrl("MyGarden"),
    icon: Sprout,
  },
  {
    title: "Plant Finder",
    url: createPageUrl("PlantFinder"),
    icon: Search,
  },
  {
    title: "AI Chat",
    url: createPageUrl("AIChat"),
    icon: MessageCircle,
  },
  {
    title: "Plant Library",
    url: createPageUrl("PlantLibrary"),
    icon: Library,
  },
  {
    title: "Care Calendar",
    url: createPageUrl("Calendar"),
    icon: Calendar,
  },
  {
    title: "Health Check",
    url: createPageUrl("HealthCheck"),
    icon: HeartPulse,
  },
  {
    title: "Farmer Market",
    url: createPageUrl("Market"),
    icon: ShoppingBag,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div style={{
      '--primary-50': '#f0fdf4',
      '--primary-100': '#dcfce7',
      '--primary-500': '#22c55e',
      '--primary-600': '#16a34a',
      '--primary-700': '#15803d',
      '--accent-50': '#fef3c7',
      '--accent-500': '#f59e0b',
      '--warm-bg': '#FAFAF9',
    }}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full" style={{backgroundColor: 'var(--warm-bg)'}}>
          <Sidebar className="border-r border-green-100 bg-white">
            <SidebarHeader className="border-b border-green-100 p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-900">NaturAI</h2>
                  <p className="text-xs text-green-600">Your AI Botanist</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-3">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-green-50 hover:text-green-700 transition-all duration-200 rounded-xl mb-1 ${
                            location.pathname === item.url ? 'bg-green-50 text-green-700 shadow-sm' : ''
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white border-b border-green-100 px-6 py-4 md:hidden sticky top-0 z-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="hover:bg-green-50 p-2 rounded-lg transition-colors duration-200" />
                  <div className="flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-green-600" />
                    <h1 className="text-lg font-bold text-gray-900">NaturAI</h1>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
