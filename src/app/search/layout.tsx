import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
