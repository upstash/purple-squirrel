export default function ConsoleLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>   
        <h1>Console Navbar</h1>
        {children}
      </section>
    )
  }