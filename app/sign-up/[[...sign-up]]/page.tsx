import { SignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
} 