export default function Footer() {
  return (
    <footer className="fixed inset-1 top-auto rounded-md bg-zinc-900 px-8 py-4 text-center text-sm text-white">
      Open source project on{" "}
      <a
        href="https://github.com/upstash/purple-squirrel"
        target="_blank"
        className="underline"
      >
        GitHub
      </a>{" "}
      • Powered by{" "}
      <a
        href="https://upstash.com/?utm_source=purple-squirrel"
        target="_blank"
        className="underline"
      >
        Upstash
      </a>
    </footer>
  );
}
