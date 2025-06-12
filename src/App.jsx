import { useState } from "react";
import "./App.css";
import Catalogue from "@/components/Catalogue";

import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { MySidebar } from "@/components/MySidebar";
import { SquarePlus } from "lucide-react";

function MainContent() {
  const { open } = useSidebar();
  return (
    <div>
      <div
        className={`flex items-center justify-between border-b border-gray-200 py-4 px-8 fixed bg-background-color z-50 w-full ${
          open ? "ml-[16rem]" : "ml-0"
        }`}
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="font-bold text-md"> Catalogue </span>
        </div>
        <div className="flex items-center gap-2 hover:cursor-pointer hover:text-primary-color ">
          <SquarePlus className="w-4 h-4" />
          <span className="text-base">Generate Report</span>
        </div>
      </div>

      <div
        className={`transition-all duration-200 pt-16 ${
          open ? "ml-[16rem]" : "ml-0"
        }`}
      >
        <div className="w-full p-8">
          <Catalogue />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <SidebarProvider>
      <div className="w-full bg-background-color">
        <MySidebar />
        <MainContent />
      </div>
    </SidebarProvider>
  );
}

export default App;
