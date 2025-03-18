import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
