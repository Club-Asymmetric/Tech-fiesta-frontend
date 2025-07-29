"use client";

import { Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import RegistrationForm from "@/components/RegistrationForm";
import RegistrationClosed from "@/components/RegistrationClosed";
import { registrationConfig } from "@/config/registration";

export default function RegistrationPage() {
  // Check if registration is open
  if (!registrationConfig.isOpen) {
    return <RegistrationClosed />;
  }

  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <RegistrationForm />
      </Suspense>
    </ProtectedRoute>
  );
}
