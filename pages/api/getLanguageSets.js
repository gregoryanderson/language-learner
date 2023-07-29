import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const {
      user: { sub },
    } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db('Blogging');
    const userProfile = await db.collection('Users').findOne({
      auth0Id: sub,
    });
    const { lastLanguageSetDate, getNewerLanguageSets } = req.body;
    const languageSets = await db
      .collection('LanguageSet')
      .find({
        userId: userProfile._id,
        created: { [getNewerLanguageSets ? '$gt' : '$lt']: new Date(lastLanguageSetDate) },
      })
      .limit(getNewerLanguageSets ? 0 : 5)
      .sort({ created: -1 })
      .toArray();

    res.status(200).json({ languageSets });
    return;
  } catch (e) {}
});