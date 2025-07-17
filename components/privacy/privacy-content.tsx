"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Eye,
  Database,
  Cookie,
  Users,
  Lock,
  Trash2,
  Share2,
  FileText,
  Globe,
  Mail,
  ChevronRight,
  Calendar,
  UserCheck,
  Settings,
  AlertTriangle,
  Phone,
} from "lucide-react"

const sections = [
  { id: "interpretation", title: "Interpretation and Definitions", icon: FileText },
  { id: "collecting", title: "Collecting and Using Your Personal Data", icon: Database },
  { id: "use", title: "Use of Your Personal Data", icon: Settings },
  { id: "retention", title: "Retention of Your Personal Data", icon: Calendar },
  { id: "transfer", title: "Transfer of Your Personal Data", icon: Share2 },
  { id: "delete", title: "Delete Your Personal Data", icon: Trash2 },
  { id: "disclosure", title: "Disclosure of Your Personal Data", icon: Eye },
  { id: "security", title: "Security of Your Personal Data", icon: Lock },
  { id: "children", title: "Children's Privacy", icon: UserCheck },
  { id: "links", title: "Links to Other Websites", icon: Globe },
  { id: "changes", title: "Changes to this Privacy Policy", icon: AlertTriangle },
  { id: "contact", title: "Contact Us", icon: Phone },
]

export function PrivacyContent() {
  const [activeSection, setActiveSection] = useState("interpretation")

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-4 py-2 mb-6">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 text-sm font-medium">Privacy Policy</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
          Privacy Policy
        </h1>

        <div className="flex items-center justify-center gap-2 text-gray-400 mb-8">
          <Calendar className="w-4 h-4" />
          <span>Last updated: July 17, 2025</span>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 max-w-4xl mx-auto">
          <p className="text-gray-300 leading-relaxed">
            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your
            information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>
          <p className="text-gray-300 leading-relaxed mt-4">
            We use Your Personal data to provide and improve the Service. By using the Service, You agree to the
            collection and use of information in accordance with this Privacy Policy.
          </p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Table of Contents */}
        <div className="lg:col-span-1">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Table of Contents
            </h3>
            <nav className="space-y-2">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className={`w-full justify-start text-left h-auto p-3 ${
                      activeSection === section.id
                        ? "bg-blue-500/20 text-blue-300 border-l-2 border-blue-400"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => scrollToSection(section.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm leading-tight">{section.title}</span>
                    </div>
                  </Button>
                )
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Section 1: Interpretation and Definitions */}
          <Card id="interpretation" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Interpretation and Definitions</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-300 mb-3">Interpretation</h3>
                <p className="text-gray-300 leading-relaxed">
                  The words of which the initial letter is capitalized have meanings defined under the following
                  conditions. The following definitions shall have the same meaning regardless of whether they appear in
                  singular or in plural.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-300 mb-4">Definitions</h3>
                <p className="text-gray-300 mb-4">For the purposes of this Privacy Policy:</p>

                <div className="space-y-4">
                  {[
                    {
                      term: "Account",
                      definition:
                        "means a unique account created for You to access our Service or parts of our Service.",
                    },
                    {
                      term: "Affiliate",
                      definition:
                        'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.',
                    },
                    {
                      term: "Company",
                      definition:
                        '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to BODENAN THOMAS, 22 rue jean de la fontaine, Houilles, 78800, France.',
                    },
                    {
                      term: "Cookies",
                      definition:
                        "are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.",
                    },
                    { term: "Country", definition: "refers to: France" },
                    {
                      term: "Device",
                      definition:
                        "means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
                    },
                    {
                      term: "Personal Data",
                      definition: "is any information that relates to an identified or identifiable individual.",
                    },
                    { term: "Service", definition: "refers to the Website." },
                    {
                      term: "Service Provider",
                      definition:
                        "means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.",
                    },
                    {
                      term: "Third-party Social Media Service",
                      definition:
                        "refers to any website or any social network website through which a User can log in or create an account to use the Service.",
                    },
                    {
                      term: "Usage Data",
                      definition:
                        "refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).",
                    },
                    { term: "Website", definition: "refers to WhichLLMs, accessible from https://whichllms.com" },
                    {
                      term: "You",
                      definition:
                        "means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start gap-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-500/20 text-blue-300 border-blue-500/30 flex-shrink-0"
                        >
                          {item.term}
                        </Badge>
                        <p className="text-gray-300 text-sm leading-relaxed">{item.definition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Collecting and Using Your Personal Data */}
          <Card id="collecting" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Collecting and Using Your Personal Data</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-4">Types of Data Collected</h3>

                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Personal Data
                    </h4>
                    <p className="text-gray-300 mb-4">
                      While using Our Service, We may ask You to provide Us with certain personally identifiable
                      information that can be used to contact or identify You. Personally identifiable information may
                      include, but is not limited to:
                    </p>
                    <ul className="space-y-2">
                      {["Email address", "First name and last name", "Usage Data"].map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <ChevronRight className="w-4 h-4 text-blue-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Usage Data
                    </h4>
                    <p className="text-gray-300 mb-4">Usage Data is collected automatically when using the Service.</p>
                    <p className="text-gray-300 mb-4">
                      Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP
                      address), browser type, browser version, the pages of our Service that You visit, the time and
                      date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic
                      data.
                    </p>
                    <p className="text-gray-300">
                      When You access the Service by or through a mobile device, We may collect certain information
                      automatically, including, but not limited to, the type of mobile device You use, Your mobile
                      device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of
                      mobile Internet browser You use, unique device identifiers and other diagnostic data.
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-pink-300 mb-3 flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Information from Third-Party Social Media Services
                    </h4>
                    <p className="text-gray-300 mb-4">
                      The Company allows You to create an account and log in to use the Service through the following
                      Third-party Social Media Services:
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["Google", "Facebook", "Instagram", "Twitter", "LinkedIn"].map((service) => (
                        <Badge
                          key={service}
                          variant="outline"
                          className="bg-pink-500/20 text-pink-300 border-pink-500/30"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-gray-300">
                      If You decide to register through or otherwise grant us access to a Third-Party Social Media
                      Service, We may collect Personal data that is already associated with Your Third-Party Social
                      Media Service's account, such as Your name, Your email address, Your activities or Your contact
                      list associated with that account.
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      <Cookie className="w-5 h-5" />
                      Tracking Technologies and Cookies
                    </h4>
                    <p className="text-gray-300 mb-4">
                      We use Cookies and similar tracking technologies to track the activity on Our Service and store
                      certain information. The technologies We use may include:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded p-4">
                        <h5 className="font-semibold text-orange-300 mb-2">Cookies or Browser Cookies</h5>
                        <p className="text-gray-300 text-sm">
                          A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all
                          Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You
                          may not be able to use some parts of our Service.
                        </p>
                      </div>
                      <div className="bg-white/5 rounded p-4">
                        <h5 className="font-semibold text-orange-300 mb-2">Web Beacons</h5>
                        <p className="text-gray-300 text-sm">
                          Certain sections of our Service and our emails may contain small electronic files known as web
                          beacons that permit the Company to count users who have visited those pages or opened an
                          email.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Use of Your Personal Data */}
          <Card id="use" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Use of Your Personal Data</h2>
            </div>

            <p className="text-gray-300 mb-6">The Company may use Personal Data for the following purposes:</p>

            <div className="grid gap-4">
              {[
                {
                  title: "To provide and maintain our Service",
                  description: "including to monitor the usage of our Service.",
                },
                {
                  title: "To manage Your Account",
                  description:
                    "to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.",
                },
                {
                  title: "For the performance of a contract",
                  description:
                    "the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.",
                },
                {
                  title: "To contact You",
                  description:
                    "To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.",
                },
                {
                  title: "To provide You",
                  description:
                    "with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.",
                },
                { title: "To manage Your requests", description: "To attend and manage Your requests to Us." },
                {
                  title: "For business transfers",
                  description:
                    "We may use Your information to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets.",
                },
                {
                  title: "For other purposes",
                  description:
                    "We may use Your information for other purposes, such as data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service, products, services, marketing and your experience.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="font-semibold text-purple-300 mb-2">{item.title}</h4>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 4: Retention */}
          <Card id="retention" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Retention of Your Personal Data</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in
                this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with
                our legal obligations (for example, if we are required to retain your data to comply with applicable
                laws), resolve disputes, and enforce our legal agreements and policies.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained
                for a shorter period of time, except when this data is used to strengthen the security or to improve the
                functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
              </p>
            </div>
          </Card>

          {/* Section 5: Transfer */}
          <Card id="transfer" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Transfer of Your Personal Data</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Your information, including Personal Data, is processed at the Company's operating offices and in any
                other places where the parties involved in the processing are located. It means that this information
                may be transferred to — and maintained on — computers located outside of Your state, province, country
                or other governmental jurisdiction where the data protection laws may differ than those from Your
                jurisdiction.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Your consent to this Privacy Policy followed by Your submission of such information represents Your
                agreement to that transfer.
              </p>
              <p className="text-gray-300 leading-relaxed">
                The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in
                accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an
                organization or a country unless there are adequate controls in place including the security of Your
                data and other personal information.
              </p>
            </div>
          </Card>

          {/* Section 6: Delete */}
          <Card id="delete" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-pink-500">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Delete Your Personal Data</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                You have the right to delete or request that We assist in deleting the Personal Data that We have
                collected about You.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our Service may give You the ability to delete certain information about You from within the Service.
              </p>
              <p className="text-gray-300 leading-relaxed">
                You may update, amend, or delete Your information at any time by signing in to Your Account, if you have
                one, and visiting the account settings section that allows you to manage Your personal information. You
                may also contact Us to request access to, correct, or delete any personal information that You have
                provided to Us.
              </p>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-300 text-sm">
                  <strong>Please note:</strong> We may need to retain certain information when we have a legal
                  obligation or lawful basis to do so.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 7: Disclosure */}
          <Card id="disclosure" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Disclosure of Your Personal Data</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-300 mb-3">Business Transactions</h3>
                <p className="text-gray-300">
                  If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be
                  transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a
                  different Privacy Policy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-300 mb-3">Law enforcement</h3>
                <p className="text-gray-300">
                  Under certain circumstances, the Company may be required to disclose Your Personal Data if required to
                  do so by law or in response to valid requests by public authorities (e.g. a court or a government
                  agency).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-300 mb-3">Other legal requirements</h3>
                <p className="text-gray-300 mb-4">
                  The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:
                </p>
                <ul className="space-y-2">
                  {[
                    "Comply with a legal obligation",
                    "Protect and defend the rights or property of the Company",
                    "Prevent or investigate possible wrongdoing in connection with the Service",
                    "Protect the personal safety of Users of the Service or the public",
                    "Protect against legal liability",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-300">
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          {/* Section 8: Security */}
          <Card id="security" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-teal-500">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Security of Your Personal Data</h2>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed">
                The security of Your Personal Data is important to Us, but remember that no method of transmission over
                the Internet, or method of electronic storage is 100% secure. While We strive to use commercially
                acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
              </p>
            </div>
          </Card>

          {/* Section 9: Children's Privacy */}
          <Card id="children" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Children's Privacy</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally
                identifiable information from anyone under the age of 13. If You are a parent or guardian and You are
                aware that Your child has provided Us with Personal Data, please contact Us.
              </p>
              <p className="text-gray-300 leading-relaxed">
                If We become aware that We have collected Personal Data from anyone under the age of 13 without
                verification of parental consent, We take steps to remove that information from Our servers.
              </p>
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-4">
                <p className="text-pink-300 text-sm">
                  If We need to rely on consent as a legal basis for processing Your information and Your country
                  requires consent from a parent, We may require Your parent's consent before We collect and use that
                  information.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 10: Links to Other Websites */}
          <Card id="links" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Links to Other Websites</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Our Service may contain links to other websites that are not operated by Us. If You click on a third
                party link, You will be directed to that third party's site. We strongly advise You to review the
                Privacy Policy of every site You visit.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We have no control over and assume no responsibility for the content, privacy policies or practices of
                any third party sites or services.
              </p>
            </div>
          </Card>

          {/* Section 11: Changes */}
          <Card id="changes" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Changes to this Privacy Policy</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new
                Privacy Policy on this page.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming
                effective and update the "Last updated" date at the top of this Privacy Policy.
              </p>
              <p className="text-gray-300 leading-relaxed">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                Policy are effective when they are posted on this page.
              </p>
            </div>
          </Card>

          {/* Section 12: Contact */}
          <Card id="contact" className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-teal-500 to-green-500">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            </div>

            <div className="bg-gradient-to-r from-teal-500/10 to-green-500/10 border border-teal-500/20 rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                If you have any questions about this Privacy Policy, You can contact us:
              </p>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400" />
                <a href="mailto:support@whichllms.com" className="text-teal-300 hover:text-teal-200 transition-colors">
                  support@whichllms.com
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
