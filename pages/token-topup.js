import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import {AppLayout} from "../components/AppLayout";

export default function TokenTopup() {

  const handleClick = async (e) => {
    e.preventDefault();
    // try {
      await fetch(`/api/addTokens`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        // body: JSON.stringify({ topic, keywords }),
      });
    //   const json = await response.json();
    //   if (json?.postId) {
    //     router.push(`/post/${json.postId}`);
    //   }
    // } catch (e) {
    //   console.log(e)
    // }
  };

  return (
    <div>
      <h1>token</h1>
      <button className='btn' onClick={handleClick}>Add Tokens</button>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired (() => {
  return {
    props: {
      test: "this is a test",
    },
  };
});
