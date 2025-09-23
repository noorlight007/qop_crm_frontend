import SessionWrapper from "@/CommonComponent/SessionWrapper";
import NoSsr from "@/utils/NoSsr";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Nunito_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "../../src/index.scss";
import MainProvider from "./MainProvider";
import { authoption } from "./api/auth/[...nextauth]/authOption";
import { I18nProvider } from "./i18n/i18n-context";
import { detectLanguage } from "./i18n/server";

const nunito = Nunito_Sans({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  style: ["italic", "normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--nunito",
});

export const metadata: Metadata = {
  title: "QOP",
  description: "QOP CRM",
  keywords: [
    "CRM",
    "QOP",
    "Customer Relationship Management",
    "Rent Home",
    "rent home",
    "buy house",
    "real estate",
    "property management",
    "buy land"
  ],
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lng = await detectLanguage();
  const session = await getServerSession(authoption);

  return (
    <I18nProvider language={lng}>
      <html>
        <head>
          <link
            rel="icon"
            href="/assets/images/favicon.png"
            type="image/x-icon"
          />
          <link
            rel="shortcut icon"
            href="/assets/images/favicon.png"
            type="image/x-icon"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          {/* <script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyAjeJEPREBQFvAIqDSZliF0WjQrCld-Mh0'></script> */}
        </head>
        <body suppressHydrationWarning={true} className={`${nunito.variable}`}>
          <NoSsr>
            <SessionWrapper session={session}>
              <MainProvider>{children}</MainProvider>
              <ToastContainer />
            </SessionWrapper>
          </NoSsr>
        </body>
      </html>
    </I18nProvider>
  );
}
