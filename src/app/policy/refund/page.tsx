import React from "react";
import Link from "next/link";
import MinimalClockCollection from "@/components/MinimalClock";

export default function RefundPolicyPage() {
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
              Cancellation and Refund Policy
            </h1>
            <p className="text-gray-400 mt-2">Last updated on Jul 7 2025</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <div className="prose prose-invert max-w-none">
              <p>
                HEMANTH RAJ C believes in helping its customers as far as
                possible, and has therefore a liberal cancellation policy.
                Under this policy:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  Cancellations will be considered only if the request is made
                  within 3-5 days of placing the order. However, the
                  cancellation request may not be entertained if the orders
                  have been communicated to the vendors/merchants and they
                  have initiated the process of shipping them.
                </li>
                <li>
                  HEMANTH RAJ C does not accept cancellation requests for
                  perishable items like flowers, eatables etc. However,
                  refund/replacement can be made if the customer establishes
                  that the quality of product delivered is not good.
                </li>
                <li>
                  In case of receipt of damaged or defective items please
                  report the same to our Customer Service team. The request
                  will, however, be entertained once the merchant has checked
                  and determined the same at his own end. This should be
                  reported within 3-5 days of receipt of the products.
                </li>
                <li>
                  In case you feel that the product received is not as shown
                  on the site or as per your expectations, you must bring it
                  to the notice of our customer service within 3-5 days of
                  receiving the product. The Customer Service Team after
                  looking into your complaint will take an appropriate
                  decision.
                </li>
                <li>
                  In case of complaints regarding products that come with a
                  warranty from manufacturers, please refer the issue to
                  them.
                </li>
                <li>
                  In case of any Refunds approved by the HEMANTH RAJ C, it’ll
                  take 3-5 days for the refund to be processed to the end
                  customer.
                </li>
              </ul>
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