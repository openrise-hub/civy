import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/actions";
import { UserProvider } from "@/contexts/UserContext";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <UserProvider user={user}>{children}</UserProvider>;
}
