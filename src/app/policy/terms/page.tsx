import React from "react";
import Link from "next/link";
import MinimalClockCollection from "@/components/MinimalClock";

export default function TermsAndConditionsPage() {
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
              Terms and Conditions
            </h1>
            <p className="text-gray-400 mt-2">Last updated on Jul 7 2025</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <div className="prose prose-invert max-w-none">
              <p>
                For the purpose of these Terms and Conditions, The term
                &quot;we&quot;, &quot;us&quot;, &quot;our&quot; used anywhere
                on this page shall mean HEMANTH RAJ C, whose
                registered/operational office is 3/133, Sourashtrapuram 5th
                Street, Vandiyur, Madurai - 625020 Madurai TAMIL NADU 625020 .
                &quot;you&quot;, “your”, &quot;user&quot;, “visitor” shall mean
                any natural or legal person who is visiting our website and/or
                agreed to purchase from us.
              </p>
              <h2 className="text-2xl font-bold mt-6 mb-4">
                Your use of the website and/or purchase from us are governed
                by following Terms and Conditions:
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  The content of the pages of this website is subject to
                  change without notice.
                </li>
                <li>
                  Neither we nor any third parties provide any warranty or
                  guarantee as to the accuracy, timeliness, performance,
                  completeness or suitability of the information and materials
                  found or offered on this website for any particular purpose.
                  You acknowledge that such information and materials may
                  contain inaccuracies or errors and we expressly exclude
                  liability for any such inaccuracies or errors to the fullest
                  extent permitted by law.
                </li>
                <li>
                  Your use of any information or materials on our website
                  and/or product pages is entirely at your own risk, for which
                  we shall not be liable. It shall be your own responsibility
                  to ensure that any products, services or information
                  available through our website and/or product pages meet your
                  specific requirements.
                </li>
                <li>
                  Our website contains material which is owned by or licensed
                  to us. This material includes, but are not limited to, the
                  design, layout, look, appearance and graphics. Reproduction
                  is prohibited other than in accordance with the copyright
                  notice, which forms part of these terms and conditions.
                </li>
                <li>
                  All trademarks reproduced in our website which are not the
                  property of, or licensed to, the operator are acknowledged
                  on the website.
                </li>
                <li>
                  Unauthorized use of information provided by us shall give
                  rise to a claim for damages and/or be a criminal offense.
                </li>
                <li>
                  From time to time our website may also include links to
                  other websites. These links are provided for your
                  convenience to provide further information.
                </li>
                <li>
                  You may not create a link to our website from another
                  website or document without HEMANTH RAJ C’s prior written
                  consent.
                </li>
                <li>
                  Any dispute arising out of use of our website and/or purchase
                  with us and/or any engagement with us is subject to the laws
                  of India .
                </li>
                <li>
                  We, shall be under no liability whatsoever in respect of any
                  loss or damage arising directly or indirectly out of the
                  decline of authorization for any Transaction, on Account of
                  the Cardholder having exceeded the preset limit mutually
                  agreed by us with our acquiring bank from time to time
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