import { Inter } from "next/font/google";
import DashboardWrapper from "./dashboardWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard | Create Next App",
  description: "Dashboard view",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <DashboardWrapper>{children}</DashboardWrapper>
    </div>
  );
}
