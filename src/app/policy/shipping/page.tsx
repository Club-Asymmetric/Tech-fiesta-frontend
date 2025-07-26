import React from "react";
import Link from "next/link";
import MinimalClockCollection from "@/components/MinimalClock";

export default function ShippingPolicyPage() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <MinimalClockCollection />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Shipping and Delivery Policy
            </h1>
            <p className="text-gray-400 mt-2">Last updated on Jul 7 2025</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <div className="prose prose-invert max-w-none">
              <p>
                For International buyers, orders are shipped and delivered
                through registered international courier companies and/or
                International speed post only. For domestic buyers, orders
                are shipped through registered domestic courier companies and
                /or speed post only. Orders are shipped within 3-5 days or as
                per the delivery date agreed at the time of order
                confirmation and delivering of the shipment subject to
                Courier Company / post office norms. HEMANTH RAJ C is not
                liable for any delay in delivery by the courier company /
                postal authorities and only guarantees to hand over the
                consignment to the courier company or postal authorities
                within 3-5 days from the date of the order and payment or as
                per the delivery date agreed at the time of order
                confirmation. Delivery of all orders will be to the address
                provided by the buyer. Delivery of our services will be
                confirmed on your mail ID as specified during registration.
                For any issues in utilizing our services you may contact our
                helpdesk on 9245435888 or personalhemanthraj@gmail.com
              </p>
            </div>
            <div className="text-center mt-8">
              <Link
                href="/"
                className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Go back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}