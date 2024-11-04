export default function Footer() {
  return (
    <footer className="fixed inset-1 top-auto rounded-md bg-zinc-800 px-8 py-3 text-center text-sm text-white">
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
        href="https://upstash.com/docs/vector/overall/whatisvector"
        target="_blank"
        className="underline"
      >
        Upstash Vector
      </a>
    </footer>
  );
}
