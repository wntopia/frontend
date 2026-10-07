import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { ThemeSwitcher } from "@/features/theme-switcher";
import { DEFAULT_MODE, THEME_INIT_SCRIPT } from "@/shared/config";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "지무위키",
  description: "금성고등학교 교내 위키",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 인라인 스크립트가 하이드레이션 전에 data-mode를 바꾸므로 경고를 끈다.
    <html
      lang="ko"
      data-mode={DEFAULT_MODE}
      suppressHydrationWarning
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Pretendard is distributed via CDN (not on Google Fonts) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full">
        {children}
        <ThemeSwitcher />
      </body>
    </html>
  );
}
