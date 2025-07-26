import React from "react";
import Link from "next/link";
import MinimalClockCollection from "@/components/MinimalClock";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-gray-400 mt-2">Last updated on Jul 7 2025</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <div className="prose prose-invert max-w-none">
              <p>
                This privacy policy sets out how HEMANTH RAJ C uses and
                protects any information that you give HEMANTH RAJ C when you
                visit their website and/or agree to purchase from them.
              </p>
              <p>
                HEMANTH RAJ C is committed to ensuring that your privacy is
                protected. Should we ask you to provide certain information by
                which you can be identified when using this website, and then
                you can be assured that it will only be used in accordance
                with this privacy statement.
              </p>
              <p>
                HEMANTH RAJ C may change this policy from time to time by
                updating this page. You should check this page from time to
                time to ensure that you adhere to these changes.
              </p>
              <h3 className="text-xl font-bold mt-6 mb-4">
                We may collect the following information:
              </h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Name</li>
                <li>Contact information including email address</li>
                <li>
                  Demographic information such as postcode, preferences and
                  interests, if required
                </li>
                <li>
                  Other information relevant to customer surveys and/or offers
                </li>
              </ul>
              <h3 className="text-xl font-bold mt-6 mb-4">
                What we do with the information we gather
              </h3>
              <p>
                We require this information to understand your needs and
                provide you with a better service, and in particular for the
                following reasons:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Internal record keeping.</li>
                <li>
                  We may use the information to improve our products and
                  services.
                </li>
                <li>
                  We may periodically send promotional emails about new
                  products, special offers or other information which we think
                  you may find interesting using the email address which you
                  have provided.
                </li>
                <li>
                  From time to time, we may also use your information to
                  contact you for market research purposes. We may contact you
                  by email, phone, fax or mail. We may use the information to
                  customise the website according to your interests.
                </li>
              </ul>
              <h3 className="text-xl font-bold mt-6 mb-4">How we use cookies</h3>
              <p>
                A cookie is a small file which asks permission to be placed on
                your computer&apos;s hard drive. Once you agree, the file is
                added and the cookie helps analyze web traffic or lets you
                know when you visit a particular site. Cookies allow web
                applications to respond to you as an individual. The web
                application can tailor its operations to your needs, likes and
                dislikes by gathering and remembering information about your
                preferences.
              </p>
              <h3 className="text-xl font-bold mt-6 mb-4">
                Controlling your personal information
              </h3>
              <p>
                You may choose to restrict the collection or use of your
                personal information in the following ways:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  whenever you are asked to fill in a form on the website,
                  look for the box that you can click to indicate that you do
                  not want the information to be used by anybody for direct
                  marketing purposes
                </li>
                <li>
                  if you have previously agreed to us using your personal
                  information for direct marketing purposes, you may change
                  your mind at any time by writing to or emailing us at
                  personalhemanthraj@gmail.com
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