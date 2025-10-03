import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Platinum Store </title>
        <meta name="description"
          content="Platinum Store - A Digital Risk Platform | Brand Protection | Cyber Threat Intelligence Solution " />
        <meta name="keywords" content="Platinum Store, Brand Protection, Cyber Threat Intelligence Solution, Data Breach Prevention, Fraudulent App Detection, Domain Spoofing & Typosquatting Detection" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />


        {/* Favicons */}
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />



        {/* og image tag*/}
        <meta property="og:image" content="https://tw360.vercel.app/logo/footer-logo.png" />
        <meta property="og:title" content="Platinum Store" />
        <meta property="og:description" content="Platinum Store - A Digital Risk Platform | Brand Protection | Cyber Threat Intelligence Solution" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
