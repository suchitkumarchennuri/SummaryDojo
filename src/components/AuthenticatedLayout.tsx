import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SignedIn } from "@clerk/nextjs";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--dark-bg)" }}
    >
      <Navigation />
      <div className="flex-grow py-6">{children}</div>
      <SignedIn>
        <Footer />
      </SignedIn>
    </div>
  );
}
