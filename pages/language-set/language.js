import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { getAppProps } from "../../utils/getAppProps";
import { useState } from "react";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
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

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
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
      if (json?.languageSetId) {
        router.push(`/language-set/${json.languageSetId}`);
      }
    } catch (e) {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
      {!generating && (
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <label
              id="listbox-label"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              Select a language...
            </label>
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="block w-full border border-gray-300 px-4 py-2 mt-2 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">
                {selectedLanguage ? selectedLanguage : "Select Language"}
              </option>{" "}
              {topLanguages.map((language) => (
                <option key={language.code} value={language.name}>
                  {language.name}
                </option>
              ))}
            </select>
            <label
              id="listbox-label"
              class="block text-sm font-medium leading-6 text-gray-900 pt-4"
            >
              And add a topic...
            </label>
            <textarea
              className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={80}
              placeholder="Apples, Butterflies, Constellations..."
            />
            <button className="btn" onClick={handleClick} disabled={generating}>
              Generate language set
            </button>
          </div>
        </div>
      )}
      {!!generating && (
        <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Generating...</h6>
        </div>
      )}
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
