import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Archive,
  SquareKanban,
  ChartPie,
  MessageSquareDot,
} from "lucide-react";

const items = [
  {
    title: "Catalogue",
    url: "#",
    icon: Archive,
  },
];

const items2 = [
  {
    title: "Line Planning",
    url: "#",
    icon: SquareKanban,
  },
  {
    title: "Sales & Analytics",
    url: "#",
    icon: ChartPie,
  },
  {
    title: "Request for Quote",
    url: "#",
    icon: MessageSquareDot,
  },
];

export function MySidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="w-full flex items-center gap-2 py-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            ES
          </div>
          <div>
            <div className="text-base font-semibold">Ember Shan</div>
            <div className="text-xs text-gray-500">merchandiser</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* General */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Merchandising */}
        <SidebarGroup>
          <SidebarGroupLabel>Merchandising</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items2.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
