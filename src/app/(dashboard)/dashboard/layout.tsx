import { Icons } from "@/components/Icon";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return notFound()
  }
  return <div className="w-full flex h-screen">
    <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="h-16 shrink-0 flex items-center">
        <Icons.Logo  className="h-8 w-auto text-indigo-600" />
        </Link>
    </div>
    {children}
    </div>;
};

export default Layout;
