"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Scale, FileText, Calendar, MapPin, Phone, Mail } from "lucide-react"

export function TermsContent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 relative">
      {/* Header */}
      <div className="text-center mb-16">
        <div
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 backdrop-blur-xl mb-8 transition-all duration-1000 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Scale className="w-5 h-5 text-blue-400 animate-pulse" />
          <span className="text-blue-200 font-medium">Legal Terms</span>
        </div>

        <h1
          className={`text-4xl md:text-6xl font-black mb-8 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="block text-white mb-4">Terms of</span>
          <span className="block bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Use</span>
        </h1>

        <div
          className={`flex flex-wrap items-center justify-center gap-6 text-gray-400 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Last updated: July 17, 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-400" />
            <span>Legal Document</span>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <Card className="p-8 md:p-12 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-blue-500/20 backdrop-blur-xl rounded-2xl">
        <div className="prose prose-lg prose-invert max-w-none">
          {/* Agreement Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">1</span>
              </div>
              Agreement to Our Legal Terms
            </h2>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                We are <strong className="text-blue-400">BODENAN THOMAS</strong>, doing business as{" "}
                <strong className="text-violet-400">WhichLLMs</strong> (<strong>"Company," "we," "us," "our"</strong>),
                a company registered in <strong className="text-white">France</strong> at{" "}
                <strong>22 rue jean de la fontaine, Houilles, Ile de france 78800</strong>.
              </p>

              <p>
                We operate the website{" "}
                <a href="http://www.whichllms.com" className="text-blue-400 hover:text-blue-300 underline">
                  http://www.whichllms.com
                </a>{" "}
                (the <strong>"Site"</strong>), as well as any other related products and services that refer or link to
                these legal terms (the <strong>"Legal Terms"</strong>) (collectively, the <strong>"Services"</strong>).
              </p>

              <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
                <p className="text-blue-300 mb-0">
                  <strong>Our Service:</strong> We provide an LLM comparison platform that lets you evaluate various
                  models based on your specific use case.
                </p>
              </div>

              <p>
                You can contact us by phone at <strong className="text-green-400">+33 7 81 79 49 39</strong>, email at{" "}
                <strong className="text-green-400">support@whichllms.com</strong>, or by mail to{" "}
                <strong>22 rue jean de la fontaine, Houilles, Ile de france 78800, France</strong>.
              </p>

              <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                <p className="text-red-300 mb-0">
                  <strong>Important:</strong> These Legal Terms constitute a legally binding agreement. IF YOU DO NOT
                  AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES.
                </p>
              </div>

              <p>
                The Services are intended for users who are at least{" "}
                <strong className="text-white">18 years old</strong>. Persons under the age of 18 are not permitted to
                use or register for the Services.
              </p>
            </div>
          </section>

          {/* Table of Contents */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "1. Our Services",
                "2. Intellectual Property Rights",
                "3. User Representations",
                "4. User Registration",
                "5. Purchases and Payment",
                "6. Subscriptions",
                "7. Prohibited Activities",
                "8. User Generated Contributions",
                "9. Contribution License",
                "10. Guidelines for Reviews",
                "11. Third-Party Websites and Content",
                "12. Services Management",
                "13. Privacy Policy",
                "14. Term and Termination",
                "15. Modifications and Interruptions",
                "16. Governing Law",
                "17. Dispute Resolution",
                "18. Corrections",
                "19. Disclaimer",
                "20. Limitations of Liability",
                "21. Indemnification",
                "22. User Data",
                "23. Electronic Communications",
                "24. California Users and Residents",
                "25. Miscellaneous",
                "26. Contact Us",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-blue-300 hover:text-blue-200 cursor-pointer transition-colors"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Our Services */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <span className="text-violet-400 font-bold text-sm">1</span>
              </div>
              Our Services
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The information provided when using the Services is not intended for distribution to or use by any
                person or entity in any jurisdiction or country where such distribution or use would be contrary to law
                or regulation or which would subject us to any registration requirement within such jurisdiction or
                country. Accordingly, those persons who choose to access the Services from other locations do so on
                their own initiative and are solely responsible for compliance with local laws, if and to the extent
                local laws are applicable.
              </p>
              <p>
                The Services are not tailored to comply with industry-specific regulations (Health Insurance Portability
                and Accountability Act (HIPAA), Federal Information Security Management Act (FISMA), etc.), so if your
                interactions would be subjected to such laws, you may not use the Services. You may not use the Services
                in a way that would violate the Gramm-Leach-Bliley Act (GLBA).
              </p>
            </div>
          </section>

          {/* Intellectual Property Rights */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">2</span>
              </div>
              Intellectual Property Rights
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Our intellectual property</h3>
                <p>
                  We are the owner or the licensee of all intellectual property rights in our Services, including all
                  source code, databases, functionality, software, website designs, audio, video, text, photographs, and
                  graphics in the Services (collectively, the <strong>"Content"</strong>), as well as the trademarks,
                  service marks, and logos contained therein (the <strong>"Marks"</strong>).
                </p>
                <p>
                  Our Content and Marks are protected by copyright and trademark laws (and various other intellectual
                  property rights and unfair competition laws) and treaties in the United States and around the world.
                </p>
                <p>
                  The Content and Marks are provided in or through the Services "AS IS" for your personal,
                  non-commercial use or internal business purpose only.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Your use of our Services</h3>
                <p>
                  Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section
                  below, we grant you a non-exclusive, non-transferable, revocable license to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>access the Services; and</li>
                  <li>
                    download or print a copy of any portion of the Content to which you have properly gained access,
                  </li>
                </ul>
                <p>solely for your personal, non-commercial use or internal business purpose.</p>
                <p>
                  Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no
                  Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly
                  displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for
                  any commercial purpose whatsoever, without our express prior written permission.
                </p>
                <p>
                  If you wish to make any use of the Services, Content, or Marks other than as set out in this section
                  or elsewhere in our Legal Terms, please address your request to:{" "}
                  <strong className="text-green-400">support@whichllms.com</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Your submissions</h3>
                <p>
                  Please review this section and the "PROHIBITED ACTIVITIES" section carefully prior to using our
                  Services to understand the (a) rights you give us and (b) obligations you have when you post or upload
                  any content through the Services.
                </p>
                <p>
                  <strong>Submissions:</strong> By directly sending us any question, comment, suggestion, idea,
                  feedback, or other information about the Services ("Submissions"), you agree to assign to us all
                  intellectual property rights in such Submission. You agree that we shall own this Submission and be
                  entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise,
                  without acknowledgment or compensation to you.
                </p>
                <p>
                  <strong>You are responsible for what you post or upload:</strong> By sending us Submissions through
                  any part of the Services you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    confirm that you have read and agree with our "PROHIBITED ACTIVITIES" and will not post, send,
                    publish, upload, or transmit through the Services any Submission that is illegal, harassing,
                    hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person
                    or group, sexually explicit, false, inaccurate, deceitful, or misleading;
                  </li>
                  <li>
                    to the extent permissible by applicable law, waive any and all moral rights to any such Submission;
                  </li>
                  <li>
                    warrant that any such Submission are original to you or that you have the necessary rights and
                    licenses to submit such Submissions and that you have full authority to grant us the above-mentioned
                    rights in relation to your Submissions; and
                  </li>
                  <li>warrant and represent that your Submissions do not constitute confidential information.</li>
                </ul>
                <p>
                  You are solely responsible for your Submissions and you expressly agree to reimburse us for any and
                  all losses that we may suffer because of your breach of (a) this section, (b) any third party's
                  intellectual property rights, or (c) applicable law.
                </p>
              </div>
            </div>
          </section>

          {/* User Representations */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <span className="text-orange-400 font-bold text-sm">3</span>
              </div>
              User Representations
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>By using the Services, you represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>(1) all registration information you submit will be true, accurate, current, and complete;</li>
                <li>
                  (2) you will maintain the accuracy of such information and promptly update such registration
                  information as necessary;
                </li>
                <li>(3) you have the legal capacity and you agree to comply with these Legal Terms;</li>
                <li>(4) you are not a minor in the jurisdiction in which you reside;</li>
                <li>
                  (5) you will not access the Services through automated or non-human means, whether through a bot,
                  script or otherwise;
                </li>
                <li>(6) you will not use the Services for any illegal or unauthorized purpose; and</li>
                <li>(7) your use of the Services will not violate any applicable law or regulation.</li>
              </ul>
              <p>
                If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right
                to suspend or terminate your account and refuse any and all current or future use of the Services (or
                any portion thereof).
              </p>
            </div>
          </section>

          {/* User Registration */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <span className="text-pink-400 font-bold text-sm">4</span>
              </div>
              User Registration
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                You may be required to register to use the Services. You agree to keep your password confidential and
                will be responsible for all use of your account and password. We reserve the right to remove, reclaim,
                or change a username you select if we determine, in our sole discretion, that such username is
                inappropriate, obscene, or otherwise objectionable.
              </p>
            </div>
          </section>

          {/* Purchases and Payment */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 font-bold text-sm">5</span>
              </div>
              Purchases and Payment
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">We accept the following forms of payment:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Visa</li>
                  <li>Mastercard</li>
                  <li>American Express</li>
                  <li>Discover</li>
                  <li>Apple Pay</li>
                  <li>Google Pay</li>
                </ul>
              </div>

              <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                <p className="text-green-300 mb-0">
                  <strong>Currency:</strong> We accept payments in euros (EUR €) and US dollars (USD $).
                </p>
              </div>

              <p>
                You agree to provide current, complete, and accurate purchase and account information for all purchases
                made via the Services. You further agree to promptly update account and payment information, including
                email address, payment method, and payment card expiration date, so that we can complete your
                transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed
                required by us. We may change prices at any time.
              </p>

              <p>
                You agree to pay all charges at the prices then in effect for your purchases and any applicable shipping
                fees, and you authorize us to charge your chosen payment provider for any such amounts upon placing your
                order. We reserve the right to correct any errors or mistakes in pricing, even if we have already
                requested or received payment.
              </p>

              <p>
                We reserve the right to refuse any order placed through the Services. We may, in our sole discretion,
                limit or cancel quantities purchased per person, per household, or per order. These restrictions may
                include orders placed by or under the same customer account, the same payment method, and/or orders that
                use the same billing or shipping address. We reserve the right to limit or prohibit orders that, in our
                sole judgment, appear to be placed by dealers, resellers, or distributors.
              </p>
            </div>
          </section>

          {/* Subscriptions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">6</span>
              </div>
              Subscriptions
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Billing and Renewal</h3>
                <p>
                  Your subscription will continue and automatically renew unless canceled. You consent to our charging
                  your payment method on a recurring basis without requiring your prior approval for each recurring
                  charge, until such time as you cancel the applicable order. The length of your billing cycle is
                  monthly.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Free Trial</h3>
                <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
                  <p className="text-blue-300 mb-0">
                    We offer a <strong>7-day free trial</strong> to new users who register with the Services. The
                    account will not be charged and the subscription will be suspended until upgraded to a paid version
                    at the end of the free trial.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Cancellation</h3>
                <p>
                  You can cancel your subscription at any time by logging into your account. Your cancellation will take
                  effect at the end of the current paid term. If you have any questions or are unsatisfied with our
                  Services, please email us at <strong className="text-green-400">support@whichllms.com</strong>.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Fee Changes</h3>
                <p>
                  We may, from time to time, make changes to the subscription fee and will communicate any price changes
                  to you in accordance with applicable law.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-red-400 font-bold text-sm">7</span>
              </div>
              Prohibited Activities
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                You may not access or use the Services for any purpose other than that for which we make the Services
                available. The Services may not be used in connection with any commercial endeavors except those that
                are specifically endorsed or approved by us.
              </p>

              <p>As a user of the Services, you agree not to:</p>

              <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                <h4 className="text-red-300 font-semibold mb-3">General Prohibited Activities:</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Systematically retrieve data or other content from the Services to create or compile, directly or
                    indirectly, a collection, compilation, database, or directory without written permission from us
                  </li>
                  <li>
                    • Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive
                    account information such as user passwords
                  </li>
                  <li>• Circumvent, disable, or otherwise interfere with security-related features of the Services</li>
                  <li>• Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services</li>
                  <li>
                    • Use any information obtained from the Services in order to harass, abuse, or harm another person
                  </li>
                  <li>• Make improper use of our support services or submit false reports of abuse or misconduct</li>
                  <li>• Use the Services in a manner inconsistent with any applicable laws or regulations</li>
                  <li>• Engage in unauthorized framing of or linking to the Services</li>
                  <li>
                    • Upload or transmit viruses, Trojan horses, or other material that interferes with any party's
                    uninterrupted use and enjoyment of the Services
                  </li>
                  <li>
                    • Engage in any automated use of the system, such as using scripts to send comments or messages, or
                    using any data mining, robots, or similar data gathering and extraction tools
                  </li>
                  <li>• Delete the copyright or other proprietary rights notice from any Content</li>
                  <li>• Attempt to impersonate another user or person or use the username of another user</li>
                  <li>
                    • Upload or transmit any material that acts as a passive or active information collection or
                    transmission mechanism
                  </li>
                  <li>
                    • Interfere with, disrupt, or create an undue burden on the Services or the networks or services
                    connected to the Services
                  </li>
                  <li>
                    • Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any
                    portion of the Services to you
                  </li>
                  <li>
                    • Attempt to bypass any measures of the Services designed to prevent or restrict access to the
                    Services
                  </li>
                  <li>
                    • Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript,
                    or other code
                  </li>
                  <li>
                    • Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any
                    of the software comprising or in any way making up a part of the Services
                  </li>
                  <li>
                    • Except as may be the result of standard search engine or Internet browser usage, use, launch,
                    develop, or distribute any automated system
                  </li>
                  <li>• Use a buying agent or purchasing agent to make purchases on the Services</li>
                  <li>
                    • Make any unauthorized use of the Services, including collecting usernames and/or email addresses
                    of users by electronic or other means
                  </li>
                  <li>
                    • Use the Services as part of any effort to compete with us or otherwise use the Services and/or the
                    Content for any revenue-generating endeavor or commercial enterprise
                  </li>
                </ul>
              </div>

              <div className="bg-orange-500/10 rounded-xl p-6 border border-orange-500/20">
                <h4 className="text-orange-300 font-semibold mb-3">Platform-Specific Prohibited Activities:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Using the platform to build a competing service</li>
                  <li>• Automated scraping or excessive automated requests (rate abuse)</li>
                  <li>• Attempting to bypass API rate limits or security mechanisms</li>
                  <li>• Using the service for malicious prompt injection or jailbreaking models</li>
                  <li>• Spamming, phishing, or fraudulent activity</li>
                  <li>• Sharing or publishing results in a misleading or deceptive way</li>
                  <li>• Use of the platform for illegal activities or violations of applicable law</li>
                  <li>
                    • Any activity that interferes with the integrity, security, or proper functioning of the platform
                    is strictly prohibited
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Generated Contributions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                <span className="text-teal-400 font-bold text-sm">8</span>
              </div>
              User Generated Contributions
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The Services does not offer users to submit or post content. We may provide you with the opportunity to
                create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and
                materials to us or on the Services, including but not limited to text, writings, video, audio,
                photographs, graphics, comments, suggestions, or personal information or other material (collectively,
                "Contributions"). Contributions may be viewable by other users of the Services and through third-party
                websites. When you create or make available any Contributions, you thereby represent and warrant that:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  The creation, distribution, transmission, public display, or performance, and the accessing,
                  downloading, or copying of your Contributions do not and will not infringe the proprietary rights,
                  including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any
                  third party
                </li>
                <li>
                  You are the creator and owner of or have the necessary licenses, rights, consents, releases, and
                  permissions to use and to authorize us, the Services, and other users of the Services to use your
                  Contributions in any manner contemplated by the Services and these Legal Terms
                </li>
                <li>
                  You have the written consent, release, and/or permission of each and every identifiable individual
                  person in your Contributions to use the name or likeness of each and every such identifiable
                  individual person to enable inclusion and use of your Contributions in any manner contemplated by the
                  Services and these Legal Terms
                </li>
                <li>Your Contributions are not false, inaccurate, or misleading</li>
                <li>
                  Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid
                  schemes, chain letters, spam, mass mailings, or other forms of solicitation
                </li>
                <li>
                  Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous,
                  slanderous, or otherwise objectionable (as determined by us)
                </li>
                <li>Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone</li>
                <li>
                  Your Contributions are not used to harass or threaten (in the legal sense of those terms) any other
                  person and to promote violence against a specific person or class of people
                </li>
                <li>Your Contributions do not violate any applicable law, regulation, or rule</li>
                <li>Your Contributions do not violate the privacy or publicity rights of any third party</li>
                <li>
                  Your Contributions do not violate any applicable law concerning child pornography, or otherwise
                  intended to protect the health or well-being of minors
                </li>
                <li>
                  Your Contributions do not include any offensive comments that are connected to race, national origin,
                  gender, sexual preference, or physical handicap
                </li>
                <li>
                  Your Contributions do not otherwise violate, or link to material that violates, any provision of these
                  Legal Terms, or any applicable law or regulation
                </li>
              </ul>

              <p>
                Any use of the Services in violation of the foregoing violates these Legal Terms and may result in,
                among other things, termination or suspension of your rights to use the Services.
              </p>
            </div>
          </section>

          {/* Contribution License */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm">9</span>
              </div>
              Contribution License
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                You and Services agree that we may access, store, process, and use any information and personal data
                that you provide and your choices (including settings).
              </p>
              <p>
                By submitting suggestions or other feedback regarding the Services, you agree that we can use and share
                such feedback for any purpose without compensation to you.
              </p>
              <p>
                We do not assert any ownership over your Contributions. You retain full ownership of all of your
                Contributions and any intellectual property rights or other proprietary rights associated with your
                Contributions. We are not liable for any statements or representations in your Contributions provided by
                you in any area on the Services. You are solely responsible for your Contributions to the Services and
                you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action
                against us regarding your Contributions.
              </p>
            </div>
          </section>

          {/* Guidelines for Reviews */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <span className="text-emerald-400 font-bold text-sm">10</span>
              </div>
              Guidelines for Reviews
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We may provide you areas on the Services to leave reviews or ratings. When posting a review, you must
                comply with the following criteria: (1) you should have firsthand experience with the person/entity
                being reviewed; (2) your reviews should not contain offensive profanity, or abusive, racist, offensive,
                or hateful language; (3) your reviews should not contain discriminatory references based on religion,
                race, gender, national origin, age, marital status, sexual orientation, or disability; (4) your reviews
                should not contain references to illegal activity; (5) you should not be affiliated with competitors if
                posting negative reviews; (6) you should not make any conclusions as to the legality of conduct; (7) you
                may not post any false or misleading statements; and (8) you may not organize a campaign encouraging
                others to post reviews, whether positive or negative.
              </p>
              <p>
                We may accept, reject, or remove reviews in our sole discretion. We have absolutely no obligation to
                screen reviews or to delete reviews, even if anyone considers reviews objectionable or inaccurate.
                Reviews are not endorsed by us, and do not necessarily represent our opinions or the views of any of our
                affiliates or partners. We do not assume liability for any review or for any claims, liabilities, or
                losses resulting from any review. By posting a review, you hereby grant to us a perpetual,
                non-exclusive, worldwide, royalty-free, fully paid, assignable, and sublicensable right and license to
                reproduce, modify, translate, transmit by any means, display, perform, and/or distribute all content
                relating to review.
              </p>
            </div>
          </section>

          {/* Third-Party Websites and Content */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
                <span className="text-lime-400 font-bold text-sm">11</span>
              </div>
              Third-Party Websites and Content
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                The Services may contain (or you may be sent via the Site) links to other websites ("Third-Party
                Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video,
                information, applications, software, and other content or items belonging to or originating from third
                parties ("Third-Party Content"). Such Third-Party Websites and Third-Party Content are not investigated,
                monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible
                for any Third-Party Websites accessed through the Services or any Third-Party Content posted on,
                available through, or installed from the Services, including the content, accuracy, offensiveness,
                opinions, reliability, privacy practices, or other policies of or contained in the Third-Party Websites
                or the Third-Party Content.
              </p>
              <p>
                Inclusion of, linking to, or permitting the use or installation of any Third-Party Websites or any
                Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the
                Services and access the Third-Party Websites or to use or install any Third-Party Content, you do so at
                your own risk, and you should be aware these Legal Terms no longer govern. You should review the
                applicable terms and policies, including privacy and data gathering practices, of any website to which
                you navigate from the Services or relating to any applications you use or install from the Services.
              </p>
              <p>
                Any purchases you make through Third-Party Websites will be through other websites and from other
                companies, and we take no responsibility whatsoever in relation to such purchases which are exclusively
                between you and the applicable third party. You agree and acknowledge that we do not endorse the
                products or services offered on Third-Party Websites and you shall hold us blameless from any harm
                caused by your purchase of such products or services. Additionally, you shall hold us blameless from any
                losses sustained by you or harm caused to you relating to or resulting in any way from any Third-Party
                Content or any contact with Third-Party Websites.
              </p>
            </div>
          </section>

          {/* Services Management */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <span className="text-amber-400 font-bold text-sm">12</span>
              </div>
              Services Management
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal
                Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or
                these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3)
                in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or
                disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4)
                in our sole discretion and without limitation, notice, or liability, to remove from the Services or
                otherwise disable all files and content that are excessive in size or are in any way burdensome to our
                systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property
                and to facilitate the proper functioning of the Services.
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
                <span className="text-rose-400 font-bold text-sm">13</span>
              </div>
              Privacy Policy
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We care about data privacy and security. By using the Services, you agree to be bound by our Privacy
                Policy posted on the Services, which is incorporated into these Legal Terms. Please be advised the
                Services are hosted in the United States. If you access the Services from any other region of the world
                with laws or other requirements governing personal data collection, use, or disclosure that differ from
                applicable laws in the United States, then through your continued use of the Services, you are
                transferring your data to the United States, and you expressly consent to have your data transferred to
                and processed in the United States.
              </p>
            </div>
          </section>

          {/* Term and Termination */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-fuchsia-500/20 rounded-lg flex items-center justify-center">
                <span className="text-fuchsia-400 font-bold text-sm">14</span>
              </div>
              Term and Termination
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY
                OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE
                OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY
                PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION,
                WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY
                TERMINATE YOUR USE OR PARTICIPATION IN THE SERVICES OR DELETE YOUR ACCOUNT AND ANY CONTENT OR
                INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
              </p>
              <p>
                If we terminate or suspend your account for any reason, you are prohibited from registering and creating
                a new account under your name, a fake or borrowed name, or the name of any third party, even if you may
                be acting on behalf of the third party. In addition to terminating or suspending your account, we
                reserve the right to take appropriate legal action, including without limitation pursuing civil,
                criminal, and injunctive redress.
              </p>
            </div>
          </section>

          {/* Modifications and Interruptions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center">
                <span className="text-sky-400 font-bold text-sm">15</span>
              </div>
              Modifications and Interruptions
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We reserve the right to change, modify, or remove the contents of the Services at any time or for any
                reason at our sole discretion without notice. However, we have no obligation to update any information
                on our Services. We will not be liable to you or any third party for any modification, price change,
                suspension, or discontinuance of the Services.
              </p>
              <p>
                We cannot guarantee the Services will be available at all times. We may experience hardware, software,
                or other problems or need to perform maintenance related to the Services, resulting in interruptions,
                delays, or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise
                modify the Services at any time or for any reason without notice to you. You agree that we have no
                liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use
                the Services during any downtime or discontinuance of the Services. Nothing in these Legal Terms will be
                construed to obligate us to maintain and support the Services or to supply any corrections, updates, or
                releases in connection therewith.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <span className="text-indigo-400 font-bold text-sm">16</span>
              </div>
              Governing Law
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                These Legal Terms are governed by and interpreted following the laws of{" "}
                <strong className="text-white">France</strong>, and the use of the United Nations Convention of
                Contracts for the International Sales of Goods is expressly excluded. If your habitual residence is in
                the EU, and you are a consumer, you additionally possess the protection provided to you by obligatory
                provisions of the law in your country to residence.{" "}
                <strong className="text-blue-400">BODENAN THOMAS</strong> and yourself both agree to submit to the
                non-exclusive jurisdiction of the courts of <strong className="text-white">Paris</strong>, which means
                that you may make a claim to defend your consumer protection rights in regards to these Legal Terms in{" "}
                <strong className="text-white">France</strong>, or in the EU country in which you reside.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <span className="text-violet-400 font-bold text-sm">17</span>
              </div>
              Dispute Resolution
            </h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Informal Negotiations</h3>
                <p>
                  To expedite resolution and control the cost of any dispute, controversy, or claim related to these
                  Legal Terms (each a "Dispute" and collectively, the "Disputes") brought by either you or us
                  (individually, a "Party" and collectively, the "Parties"), the Parties agree to first attempt to
                  negotiate any Dispute (except those Disputes expressly provided below) informally for at least thirty
                  (30) days before initiating arbitration. Such informal negotiations commence upon written notice from
                  one Party to the other Party.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Binding Arbitration</h3>
                <p>
                  Any dispute arising from the relationships between the Parties to these Legal Terms shall be
                  determined by one arbitrator who will be chosen in accordance with the Arbitration and Internal Rules
                  of the European Court of Arbitration being part of the European Centre of Arbitration having its seat
                  in Strasbourg, and which are in force at the time the application for arbitration is filed, and of
                  which adoption of this clause constitutes acceptance. The seat of arbitration shall be Paris, France.
                  The language of the proceedings shall be English. Applicable rules of substantive law shall be the law
                  of France.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Restrictions</h3>
                <p>
                  The Parties agree that any arbitration shall be limited to the Dispute between the Parties
                  individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other
                  proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action
                  basis or to utilize class action procedures; and (c) there is no right or authority for any Dispute to
                  be brought in a purported representative capacity on behalf of the general public or any other
                  persons.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Exceptions to Informal Negotiations and Arbitration
                </h3>
                <p>
                  The Parties agree that the following Disputes are not subject to the above provisions concerning
                  informal negotiations binding arbitration: (a) any Disputes seeking to enforce or protect, or
                  concerning the validity of, any of the intellectual property rights of a Party; (b) any Dispute
                  related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use;
                  and (c) any claim for injunctive relief. If this provision is found to be illegal or unenforceable,
                  then neither Party will elect to arbitrate any Dispute falling within that portion of this provision
                  found to be illegal or unenforceable and such Dispute shall be decided by a court of competent
                  jurisdiction within the courts listed for jurisdiction above, and the Parties agree to submit to the
                  personal jurisdiction of that court.
                </p>
              </div>
            </div>
          </section>

          {/* Corrections */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-500/20 rounded-lg flex items-center justify-center">
                <span className="text-slate-400 font-bold text-sm">18</span>
              </div>
              Corrections
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                There may be information on the Services that contains typographical errors, inaccuracies, or omissions,
                including descriptions, pricing, availability, and various other information. We reserve the right to
                correct any errors, inaccuracies, or omissions and to change or update the information on the Services
                at any time, without prior notice.
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 font-bold text-sm">19</span>
              </div>
              Disclaimer
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
                <p className="text-yellow-300 mb-0 text-sm uppercase font-bold">
                  THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES
                  WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS
                  OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE
                  IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE
                  NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE
                  CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY
                  OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL
                  INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE
                  SERVICES, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL
                  INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF
                  TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE
                  TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY
                  CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY
                  CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES.
                </p>
              </div>
            </div>
          </section>

          {/* Limitations of Liability */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                <span className="text-red-400 font-bold text-sm">20</span>
              </div>
              Limitations of Liability
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
                <p className="text-red-300 mb-4 text-sm uppercase font-bold">
                  IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY
                  DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST
                  PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE
                  HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p className="text-red-300 mb-0 text-sm uppercase font-bold">
                  NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE
                  WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE
                  AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING
                  OR 100.
                </p>
              </div>
              <p>
                CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE
                EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE
                DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <span className="text-orange-400 font-bold text-sm">21</span>
              </div>
              Indemnification
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of
                our respective officers, agents, partners, and employees, from and against any loss, damage, liability,
                claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or
                arising out of: (1) use of the Services; (2) breach of these Legal Terms; (3) any breach of your
                representations and warranties set forth in these Legal Terms; (4) your violation of the rights of a
                third party, including but not limited to intellectual property rights; or (5) any overt harmful act
                toward any other user of the Services with whom you connected via the Services. Notwithstanding the
                foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any
                matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our
                defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or
                proceeding which is subject to this indemnification upon becoming aware of it.
              </p>
            </div>
          </section>

          {/* User Data */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400 font-bold text-sm">22</span>
              </div>
              User Data
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                We will maintain certain data that you transmit to the Services for the purpose of managing the
                performance of the Services, as well as data relating to your use of the Services. Although we perform
                regular routine backups of data, you are solely responsible for all data that you transmit or that
                relates to any activity you have undertaken using the Services. You agree that we shall have no
                liability to you for any loss or corruption of any such data, and you hereby waive any right of action
                against us arising from any such loss or corruption of such data.
              </p>
            </div>
          </section>

          {/* Electronic Communications */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400 font-bold text-sm">23</span>
              </div>
              Electronic Communications, Transactions, and Signatures
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Visiting the Services, sending us emails, and completing online forms constitute electronic
                communications. You consent to receive electronic communications, and you agree that all agreements,
                notices, disclosures, and other communications we provide to you electronically, via email and on the
                Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE
                USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF
                NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You
                hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other
                laws in any jurisdiction which require an original signature or delivery or retention of non-electronic
                records, or to payments or the granting of credits by any means other than electronic means.
              </p>
            </div>
          </section>

          {/* California Users and Residents */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400 font-bold text-sm">24</span>
              </div>
              California Users and Residents
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                If any complaint with us is not satisfactorily resolved, you can contact the Complaint Assistance Unit
                of the Division of Consumer Services of the California Department of Consumer Affairs in writing at 1625
                North Market Blvd., Suite N112, Sacramento, California 95834 or by telephone at (800) 952-5210 or (916)
                445-1254.
              </p>
            </div>
          </section>

          {/* Miscellaneous */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600/20 rounded-lg flex items-center justify-center">
                <span className="text-teal-400 font-bold text-sm">25</span>
              </div>
              Miscellaneous
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the
                Services constitute the entire agreement and understanding between you and us. Our failure to exercise
                or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or
                provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all
                of our rights and obligations to others at any time. We shall not be responsible or liable for any loss,
                damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or
                part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that
                provision or part of the provision is deemed severable from these Legal Terms and does not affect the
                validity and enforceability of any remaining provisions. There is no joint venture, partnership,
                employment or agency relationship created between you and us as a result of these Legal Terms or use of
                the Services. You agree that these Legal Terms will not be construed against us by virtue of having
                drafted them. You hereby waive any and all defenses you may have based on the electronic form of these
                Legal Terms and the lack of signing by the parties hereto to execute these Legal Terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-sm">26</span>
              </div>
              Contact Us
            </h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                In order to resolve a complaint regarding the Services or to receive further information regarding use
                of the Services, please contact us at:
              </p>

              <Card className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-700/30 border border-gray-600/20">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">BODENAN THOMAS</h3>
                    <p className="text-blue-400 font-medium">WhichLLMs</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium">Address</p>
                          <p className="text-gray-300 text-sm">
                            22 rue jean de la fontaine
                            <br />
                            Houilles, Ile de france 78800
                            <br />
                            France
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium">Phone</p>
                          <p className="text-gray-300 text-sm">+33 7 81 79 49 39</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-violet-400" />
                        <div>
                          <p className="text-white font-medium">Email</p>
                          <p className="text-gray-300 text-sm">support@whichllms.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </Card>
    </div>
  )
}
