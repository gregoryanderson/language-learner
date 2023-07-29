import Image from "next/image";
import Link from "next/link";
import { Logo } from "../components/Logo";
import HeroImage from "../public/starry.jpeg";
import Head from 'next/head'

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Head>
        <title>LanguageLearnerAI</title>
        <link rel="icon" href="/greg.png" />
      </Head>

      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          The AI-powered SAAS solution to generate language sets in seconds. Get
          high-quality content, without sacrificing your time.
        </p>
        <Link href="/language-set/language" className="btn text-left">
          Begin
        </Link>
      </div>
    </div>
  );
}
