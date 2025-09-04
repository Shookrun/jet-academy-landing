import type { Viewport } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

const manrope = Manrope({
  display: "swap",
  preload: true,
  subsets: ["latin", "latin-ext", "cyrillic-ext"],
  weight: ["200", "300", "400", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '24501015369551397');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=24501015369551397&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body
        className={`${manrope.className} scroll-smooth antialiased overflow-x-hidden`}
      >
        <h1 className="hidden">JET School</h1>
        {children}
        <Toaster />
        <GoogleAnalytics gaId="G-8PKPCDFDSF" />
      </body>
    </html>
  );
}