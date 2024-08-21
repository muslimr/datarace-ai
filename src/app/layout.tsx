import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import '../styles/global.css';
import { Footer, Header } from "components";
import ReduxProvider from "providers/redux-provider";
import ToastProvider from "@providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] }); // Specify weights if needed


export const metadata: Metadata = {
  title: "Datarace.ai",
  description: "DataRace is an innovative platform designed to bring data scientists and Al enthusiasts together to compete in data-driven challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Link to the favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} ${poppins.className}`}>
        <ToastProvider>
          <Header />
          <ReduxProvider>
            {children}
          </ReduxProvider>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
