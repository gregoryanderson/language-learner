import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  console.log(req.body, "woooo");
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("Blogging");
  const userProfile = await db.collection("Users").findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);

  const { selectedLanguage, topic } = req.body;

  if (!topic || !selectedLanguage) {
    res.status(422);
    return;
  }

  if (topic.length > 80) {
    res.status(422);
    return;
  }

  const numSentences = 10; // Number of sentences you want to generate
  const userMessage = {
    role: "user",
    content: `Generate ${numSentences} sentences about ${topic} in English. Then provide their translations in ${selectedLanguage}. Return the data in an array of sentence objects that include the original and translation`,
  };
  const prompt = [
    {
      role: "system",
      content: "You are a language learning assistant.",
    },
    userMessage,
  ];

  const postContentResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: prompt,
    temperature: 0,
  });

  const { message } = postContentResult.data.choices[0];
  
  const sentencePairs = JSON.parse(message.content);

  await db.collection("Users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  const languageSet = await db.collection("LanguageSet").insertOne({
    set: sentencePairs,
    language: selectedLanguage,
    topic,
    userId: userProfile._id,
    created: new Date(),
  });

  res.status(200).json({
    languageSetId: languageSet.insertedId,
  });
});
