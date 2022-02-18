import faunadb from 'faunadb';

const q = faunadb.query;

export const verifyIdentity = async (secret) => {
  const client = new faunadb.Client({
    secret, // from JWT template
    keepAlive: false
  });
  const userId = await client.query(q.CurrentIdentity());

  return { id: userId };
};
