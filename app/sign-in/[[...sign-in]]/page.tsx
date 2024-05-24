import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 to-purple-500">
      <SignIn />;
    </div>
  )
}