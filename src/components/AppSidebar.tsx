import { Scale, FileText, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Адвокаты", url: "/", icon: Scale },
  { title: "Реестр дел", url: "/cases", icon: FileText },
  { title: "Настройки", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="gap-0">
        <div className="px-6 py-8 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary-foreground" />
            </div>
            {open && (
              <div>
                <h2 className="text-lg font-semibold text-primary">Law Firm</h2>
                <p className="text-xs text-muted-foreground">CRM System</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground px-6 py-4">
            Навигация
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-6 py-3 text-sidebar-foreground hover:text-primary hover:bg-sidebar-accent transition-all"
                      activeClassName="bg-sidebar-accent text-primary border-l-2 border-primary"
                    >
                      <item.icon className="w-5 h-5" />
                      {open && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
