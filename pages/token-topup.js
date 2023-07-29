import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup() {
  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: "POST",
    });
    const json = await result.json();
    // console.log('RESULT: ', json);
    window.location.href = json.session.url;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <h1 className="text-2xl font-semibold mb-4">Token Topup</h1>
      <p className="text-gray-500 mb-6">Purchase tokens in order to create more language sets</p>
      <button
        className="btn text-white py-2 px-4 rounded-lg"
        onClick={handleClick}
      >
        Add Tokens
      </button>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
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
