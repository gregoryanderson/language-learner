import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";

export default function NewPost(props) {
  const [postContent, setPostContent] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const response = await fetch(`/api/generatePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ topic, keywords }),
      });
      const json = await response.json();
      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (e) {
      setGenerating(false);
    }
  };


  return (
    <div>
      <form type="submit" onSubmit={handleSubmit}>
        <div>
          <label>Generate a lesson on the topic of:</label>
          <textarea value={topic} onChange={e => setTopic(e.target.value)} className='resize-none border border-slate-500 block w-full my-2 px-4 py-2 rounded-sm'/>
        </div>
        <div>
          <label>Include these keywords:</label>
          <textarea value={keywords} onChange={e => setKeywords(e.target.value)} className='resize-none border border-slate-500 block w-full my-2 px-4 py-2 rounded-sm'/>
        </div>
        <button className="btn">generate</button>
      </form>
      <div
        className="max-w-screen-sm p-10"
        dangerouslySetInnerHTML={{ __html: postContent }}
      ></div>
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {
      test: "this is a test",
    },
  };
});
