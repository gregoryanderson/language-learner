import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { getAppProps } from "../../utils/getAppProps";
import { useState } from "react";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export default function Language() {
  const [selectedLanguage, setSelectedLangauge] = useState("");
  const [topic, setTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  const topLanguages = [
    { name: "English" },
    { name: "Spanish" },
    { name: "French" },
    { name: "German" },
    { name: "Italian" },
    { name: "Portuguese" },
    { name: "Russian" },
    { name: "Chinese (Simplified)" },
    { name: "Chinese (Traditional)" },
    { name: "Japanese" },
    { name: "Korean" },
    { name: "Arabic" },
    { name: "Hindi" },
    { name: "Bengali" },
    { name: "Indonesian" },
    { name: "Turkish" },
    { name: "Dutch" },
    { name: "Swedish" },
    { name: "Norwegian" },
    { name: "Danish" },
  ];

  const handleLanguageClick = (language) => {
    setSelectedLangauge(language);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const response = await fetch(`/api/generateLanguageSet`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ selectedLanguage, topic }),
      });
      const json = await response.json();
      console.log("RESULT: ", json);
      if (json?.languageSetId) {
        router.push(`/language-set/${json.languageSetId}`);
      }
    } catch (e) {
      setGenerating(false);
    }
  };

  console.log({ selectedLanguage, topic });
  return (
    <div>
      {!!generating && (
        <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Generating...</h6>
        </div>
      )}
      <h1>This is the language page</h1>
      {topLanguages.map((language) => (
        <button
          key={language.code}
          className={`inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 ${
            selectedLanguage === language.name ? "bg-red-50" : ""
          }`}
          onClick={() => handleLanguageClick(language.name)}
        >
          {language.name}
        </button>
      ))}
      <textarea
        className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        maxLength={80}
      />
      <button className="btn m-2" onClick={handleClick}>
        Generate language set
      </button>
    </div>
  );
}

Language.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
