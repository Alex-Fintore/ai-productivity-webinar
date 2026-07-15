import type { Metadata, Viewport } from "next";
import "@fontsource-variable/golos-text/wght.css";
import "@fontsource-variable/literata/wght.css";
import "@fontsource-variable/literata/wght-italic.css";
import "./globals.css";

const title = "Верните себе рабочий день";
const description =
  "Пять практических сценариев, которые помогают освободить до восьми часов в неделю с нейросетями — без магии и без потери контроля.";
const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";
const basePath = isGitHubPages
  ? (process.env.PAGES_BASE_PATH ?? "/ai-productivity-webinar")
  : "";
const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000",
);
const cardPath = `${basePath}/og.png`;

export const metadata: Metadata = {
  metadataBase,
  title,
  description,
  applicationName: title,
  authors: [{ name: "Alex Fintore" }],
  creator: "Alex Fintore",
  alternates: { canonical: `${basePath}/` },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "ru_RU",
    siteName: title,
    images: [{ url: cardPath, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [cardPath],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3F0E8",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
