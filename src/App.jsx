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
    <div className="w-full">
      <div
        className={`flex items-center justify-between border-b border-gray-200 py-4 px-8 fixed bg-background-color z-50 ${
          open ? "w-[calc(100vw-16rem)] ml-[16rem]" : "w-full"
        }`}
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="font-bold text-md"> Catalogue </span>
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
