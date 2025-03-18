import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export const metadata = {
  title: "Search Documents - SummaryDojo",
  description:
    "Search across your documents using powerful AI-based semantic search",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}
