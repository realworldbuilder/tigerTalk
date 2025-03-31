'use client';

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
} 