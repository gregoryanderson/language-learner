import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { getAppProps } from "../../utils/getAppProps";
import { ObjectId } from "mongodb";

export default function LanguageSet(props) {
  const router = useRouter();

  const displayArray = props.set.map((pair, index) => (
    <div key={index}>
      <p>Original: {pair.original}</p>
      <p>Translation: {pair.translation}</p>
    </div>
  ));

  console.log("languageSetProps:", props.set);
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
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
