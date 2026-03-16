import Navbar from "@/components/landing/Navbar";

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Navbar />
      {children}
    </div>
  );
}
