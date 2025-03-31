'use client';

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <SignUp path="/sign-up" routing="path" />
    </div>
  );
} 