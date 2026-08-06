import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";

export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-[#7a219f]/10 dark:border-[#efcafe]/20 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-[#1a1a1a]/80 transition-all">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 data-[orientation=vertical]:h-4 bg-[#7a219f]/10 dark:bg-[#efcafe]/20"
        />
        <h1 className="text-xl font-bold text-[#7a219f] dark:text-[#efcafe]">
          {title}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#7a219f] dark:text-[#efcafe] hover:bg-[#7a219f]/5 dark:hover:bg-[#efcafe]/10"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
