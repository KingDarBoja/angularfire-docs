import { Component, input, output } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

interface NavItem {
  label: string;
  route: string;
  exact?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent {
  readonly isOpen = input<boolean>(false);
  readonly close = output<void>();

  readonly sections: NavSection[] = [
    {
      title: "Getting Started",
      items: [
        {
          label: "Core Overview",
          route: "/",
          exact: true,
          badge: "v21",
          badgeColor: "bg-amber-500/20 text-amber-300",
        },
        {
          label: "Compatibility & Contribution",
          route: "/getting-started/compatibility",
        },
      ],
    },
    {
      title: "Auth & Data",
      items: [
        { label: "Authentication", route: "/auth" },
        { label: "Cloud Firestore", route: "/firestore" },
        { label: "Realtime Database", route: "/database" },
        { label: "Cloud Storage", route: "/storage" },
      ],
    },
    {
      title: "Compute & Messaging",
      items: [
        { label: "Cloud Functions", route: "/functions" },
        { label: "Cloud Messaging", route: "/messaging" },
      ],
    },
    {
      title: "Operations & Security",
      items: [
        { label: "Analytics", route: "/analytics" },
        { label: "Performance", route: "/performance" },
        { label: "Remote Config", route: "/remote-config" },
        { label: "App Check", route: "/app-check" },
      ],
    },
    {
      title: "Intelligence",
      items: [
        {
          label: "Firebase AI Logic",
          route: "/ai",
          badge: "NEW",
          badgeColor:
            "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold",
        },
      ],
    },
  ];
}

