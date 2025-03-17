import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import '../../styles/global.css';
import { Footer, Header, Loader } from "components";
import ReduxProvider from "providers/redux-provider";
import ToastProvider from "@providers/toast-provider";
import { IntlProvider, NextIntlClientProvider } from 'next-intl';
import { getMessages } from "next-intl/server";


const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] }); // Specify weights if needed


export const metadata: Metadata = {
  title: "Datarace.ai",
  description: "DataRace is an innovative platform designed to bring data scientists and Al enthusiasts together to compete in data-driven challenges.",
};

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { slug?: string, lng: string };
}) {

  const messages = await getMessages();

  return (
    <html lang={lng}>
      <head>
        {/* Link to the favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Yandex Metrica Tracking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(100402630, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
              `,
          }}
        />
      </head>
      <body className={`${inter.className} ${poppins.className}`}>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <ToastProvider>
              <Header />
              <div className="min-h-screen">
                {children}
              </div>
              <Footer />
            </ToastProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
