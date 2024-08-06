import { ConsoleManagers } from "./managers";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ConsoleManagers>{children}</ConsoleManagers>
    </section>
  );
}
