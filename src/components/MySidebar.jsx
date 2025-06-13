import React from "react";
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
  SidebarTrigger,
  useSidebar,
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
  const { open, isMobile } = useSidebar();
  return (
    <>
      {/* Backdrop for desktop only */}
      {open && !isMobile && (
        <div className="fixed inset-0 z-40 bg-black/20 pointer-events-none" aria-hidden="true" />
      )}
      <Sidebar className="bg-slate-800 text-white">
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <div className="w-full flex items-center gap-2 py-4">
              <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-black">
                ES
              </div>
              <div>
                <div className="text-base font-semibold text-white">Ember Shan</div>
                <div className="text-xs text-white/70">merchandiser</div>
              </div>
            </div>
            {/* Sidebar close trigger */}
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          {/* General */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-300">General</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-white">
                      <a href={item.url} className="flex items-center gap-2 text-white">
                        <item.icon className="text-white" />
                        <span className="text-white">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Merchandising */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-slate-300">Merchandising</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items2.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-white">
                      <a href={item.url} className="flex items-center gap-2 text-white">
                        <item.icon className="text-white" />
                        <span className="text-white">{item.title}</span>
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
    </>
  );
}
