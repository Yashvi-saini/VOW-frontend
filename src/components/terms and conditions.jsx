import React from "react";

export default function TermsAndConditions() {
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "account", title: "Account Registration & Responsibilities" },
    { id: "usage", title: "Platform Usage Guidelines" },
    { id: "privacy", title: " Privacy & Data Protection" },
    { id: "content", title: "User Content & Intellectual Property" },
    { id: "payments", title: "Payments & Subscriptions" },
    { id: "termination", title: "Termination Policy" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "changes", title: " Changes to Terms" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-indigo-700">
          Terms & Conditions
        </h1>
        <p className="text-center mb-8 text-gray-600">
          Welcome to <strong>VOW</strong>. By using our services, you agree to
          the following terms. Please read them carefully.
        </p>

        {/* Table of Contents */}
        <div className="mb-10 border border-gray-200 rounded-lg p-4 bg-gray-100">
          <h2 className="text-xl font-semibold mb-3">Table of Contents</h2>
          <ul className="list-decimal list-inside space-y-2 text-indigo-600">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                
                onClick={()=>document.getElementById(section.id).scrollIntoView({behavior:"smooth"})}
                className="hover:underline hover:text-indigo-800 transition-colors">
           {section.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Terms Content */}
        <div className="space-y-10">
          <section id="introduction">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              VOW is a collaborative metaverse platform for virtual meetings and
              real-time interaction, similar to Cosmos Video. By accessing or
              using our platform, you agree to comply with these Terms and all
              applicable laws and regulations.
            </p>
          </section>

          <section id="account">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              2. Account Registration & Responsibilities
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Users must provide accurate and complete information when creating
              an account. You are responsible for maintaining the
              confidentiality of your login credentials and for all activities
              under your account.
            </p>
          </section>

          <section id="usage">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              3. Platform Usage Guidelines
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to use VOW for lawful purposes only. Harassment,
              spamming, sharing harmful files, or disrupting other users’
              experience is strictly prohibited.
            </p>
          </section>

          <section id="privacy">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              4. Privacy & Data Protection
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We respect your privacy. Your personal data is handled according
              to our Privacy Policy, which outlines how information is collected
              and used to provide our services.
            </p>
          </section>

          <section id="content">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              5. User Content & Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You retain ownership of content you upload to VOW but grant us a
              non-exclusive license to use, display, and distribute it within
              the platform as necessary to provide the service.
            </p>
          </section>

          <section id="payments">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              6. Payments & Subscriptions
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Certain features may require a paid subscription. Fees are billed
              in advance and are non-refundable unless stated otherwise.
            </p>
          </section>

          <section id="termination">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              7. Termination Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              VOW reserves the right to suspend or terminate accounts that
              violate these Terms or engage in fraudulent or abusive activity.
            </p>
          </section>

          <section id="liability">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              VOW is not liable for indirect, incidental, or consequential
              damages arising from your use or inability to use the platform.
              The service is provided “as is.”
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              9. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms from time to time. Continued use of the
              platform after such updates constitutes acceptance of the revised
              Terms.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
              10. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@vow-org.me"
                className="text-indigo-600 underline"
              >
                support@vow-org.me
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-12">
          © {new Date().getFullYear()} VOW. All rights reserved.
        </footer>
      </div>
    </div>
  );
}