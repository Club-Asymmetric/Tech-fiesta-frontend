"use client";

import { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import RegistrationForm from "@/components/RegistrationForm";

export default function RegistrationPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <RegistrationForm />
      </Suspense>
    </ProtectedRoute>
  );
}
