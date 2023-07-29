import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ObjectId } from "mongodb";
import { useState } from "react";

export default function LanguageSet(props) {
  const [visible, setVisible] = useState({});

  const router = useRouter();

  const toggleVisibility = (index) => {
    setVisible((prevVisible) => ({
      ...prevVisible,
      [index]: !prevVisible[index],
    }));
  };

  const displayArray = props.set.map((item, index) => (
    <ul className="divide-gray-100">
      <li key={index} className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">
            {index + 1}. {item.translation}
          </p>
        </div>
        <div>
          <input
            type="text"
            name="price"
            id="price"
            className="block w-full rounded-none border-b border-t-0 border-l-0 border-r-0 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
            placeholder="Attempt translation.."
          />
        </div>
        <div className="flex items-center divide-x">
          <div
            className={`text-sm text-blue-700 transition-height ${
              visible[index] ? "h-auto" : "h-0"
            } overflow-hidden`}
          >
            <p>{item.original}</p>
          </div>
          <div className="ml-auto text-right border border-transparent">
            <span
              className="inline-flex items-center bg-blue-50 px-2 py-1 text-s font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mt-2"
              onClick={() => toggleVisibility(index)}
            >
              {visible[index] ? "Hide" : "Reveal"}
            </span>
          </div>
          {/* <div>
            <FontAwesomeIcon icon="fa-solid fa-check" />
          </div> */}
        </div>
      </li>
    </ul>
  ));

  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 rounded-sm">
          {displayArray}
        </div>
      </div>
    </div>
  );
}

LanguageSet.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("Blogging");
    const user = await db.collection("Users").findOne({
      auth0Id: userSession.user.sub,
    });
    const languageSet = await db.collection("LanguageSet").findOne({
      _id: new ObjectId(ctx.params.languageSetId),
      userId: user._id,
    });

    return {
      props: {
        id: ctx.params.languageSetId,
        set: languageSet.set,
        languageSetCreated: languageSet.created.toString(),
        ...props,
      },
    };
  },
});
