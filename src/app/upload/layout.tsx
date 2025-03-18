import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
