import { useUser } from "@auth0/nextjs-auth0/client";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect } from "react";
import PostsContext from "../../context/postsContext";
import LanguageSetContext from "../../context/languageSetContext";
import { Logo } from "../Logo";

export const AppLayout = ({
  children,
  availableTokens,
  userLanguageSets: languageSetsFromSSR,
  id: languageSetId,
  languageSetCreated,
}) => {
  const { user } = useUser();

  const {
    setLanguageSetsFromSSR,
    languageSets,
    getLanguageSets,
    noMoreLanguageSets,
  } = useContext(LanguageSetContext);

  useEffect(() => {
    if (languageSetsFromSSR) {
      setLanguageSetsFromSSR(languageSetsFromSSR);
      console.log({languageSetsFromSSR, languageSetId})
      if (languageSetId) {
        console.log({languageSetId})
        const exists = languageSetsFromSSR.find(
          (languageSet) => languageSet._id === languageSetId
        );
        console.log({exists})
        if (!exists) {
          getLanguageSets({
            getNewerLanguageSets: true,
            lastLanguageSetDate: languageSetCreated,
          });
        }
      }
    }
  }, [
    languageSetsFromSSR,
    setLanguageSetsFromSSR,
    languageSetId,
    languageSetCreated,
    getLanguageSets,
  ]);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link href="/language-set/language" className="btn">
            New Language Set
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {languageSetsFromSSR?.map((languageSet) => (
            <Link
              key={languageSet._id}
              href={`/language-set/${languageSet._id}`}
              className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                languageSetId === languageSet._id
                  ? "bg-white/20 border-white"
                  : ""
              }`}
            >
              {languageSet.topic}
            </Link>
          ))}
          {/* {!noMoreLanguageSets && (
            <div
              onClick={() => {
                getLanguageSets({
                  lastLanguageSetDate:
                    languageSets[languageSet.length - 1].created,
                });
              }}
              className="hover:underline text-sm text-slate-400 text-center cursor-pointer mt-4"
            >
              Load more sets
            </div>
          )} */}
        </div>
        <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
