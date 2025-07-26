import React from "react";
import Link from "next/link";
import MinimalClockCollection from "@/components/MinimalClock";
import { FileText, Shield, RefreshCw, Truck, Home } from "lucide-react";

export default function PolicyHubPage() {
  const policies = [
    {
      title: "Terms and Conditions",
      description: "The rules and guidelines for using our website and services.",
      href: "/policy/terms",
      icon: <FileText className="w-8 h-8 text-blue-400" />,
    },
    {
      title: "Privacy Policy",
      description: "How we collect, use, and protect your personal data.",
      href: "/policy/privacy",
      icon: <Shield className="w-8 h-8 text-green-400" />,
    },
    {
      title: "Cancellation and Refund Policy",
      description: "Our process and conditions for cancellations and refunds.",
      href: "/policy/refund",
      icon: <RefreshCw className="w-8 h-8 text-yellow-400" />,
    },
    {
      title: "Shipping and Delivery",
      description: "Information on how our services are delivered to you.",
      href: "/policy/shipping",
      icon: <Truck className="w-8 h-8 text-purple-400" />,
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MinimalClockCollection />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative z-10 min-h-screen py-12 px-4 flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Our Policies
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              Important information regarding your use of our services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy) => (
              <Link href={policy.href} key={policy.title}>
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 h-full flex flex-col hover:border-blue-400/50 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-white/10 rounded-full mr-4">
                      {policy.icon}
                    </div>
                    <h2 className="text-xl font-bold text-white">
                      {policy.title}
                    </h2>
                  </div>
                  <p className="text-gray-300 flex-grow">
                    {policy.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600/80 backdrop-blur-sm hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              <Home className="w-5 h-5" />
              Go back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
