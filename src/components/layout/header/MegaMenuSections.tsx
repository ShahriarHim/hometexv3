import { Link } from "@/i18n/routing";
import { BookOpen, HelpCircle, Newspaper, Package, Sparkles, Store } from "lucide-react";

interface MenuSection {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

interface MegaMenuSectionsProps {
  title: string;
  sections: MenuSection[];
}

export const MegaMenuSections = ({ title, sections }: MegaMenuSectionsProps) => {
  return (
    <div className="w-[800px] p-6" suppressHydrationWarning>
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:via-indigo-950 dark:hover:to-purple-950 border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all duration-200"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-900 dark:group-hover:to-blue-800 transition-all duration-200 flex-shrink-0">
              {section.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {section.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {section.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Example usage configurations
export const exploreSections: MenuSection[] = [
  {
    title: "Help Center",
    description: "Find answers to your questions and get support",
    href: "/help",
    icon: <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Documentation",
    description: "Complete guides and API documentation",
    href: "/docs",
    icon: <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  },
];

export const companySections: MenuSection[] = [
  {
    title: "About Us",
    description: "Learn about our story and mission",
    href: "/about",
    icon: <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Blog",
    description: "Latest news, insights and updates",
    href: "/blog",
    icon: <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "What's New",
    description: "See the latest features and improvements",
    href: "/changelog",
    icon: <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  },
  {
    title: "Our Products",
    description: "Explore our complete product catalog",
    href: "/products",
    icon: <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
  },
];
