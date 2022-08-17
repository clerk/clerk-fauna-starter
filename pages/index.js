import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs';
import { verifyIdentity } from '/lib/fauna';
import styles from '/styles/Shared.module.css';

const SignupLink = () => (
  <Link href="/sign-up">
    <a className={styles.cardContent}>
      <img src="/icons/user-plus.svg" />
      <div>
        <h3>Sign up for an account</h3>
        <p>
          Sign up and sign in to explore all the features provided by Clerk
          out-of-the-box
        </p>
      </div>
      <div className={styles.arrow}>
        <img src="/icons/arrow-right.svg" />
      </div>
    </a>
  </Link>
);

const clerkCode = `
import { withAuth } from "@clerk/nextjs/api";

export default withAuth((req, res) => {
  const { sessionId } = req.auth;

  if (!sessionId) {
    return res.status(401).json({ id: null });
  }

  return res.status(200).json({ id: sessionId });
});
`.trim();

const faunaCode = `import faunadb from 'faunadb';
const q = faunadb.query;

export const verifyIdentity = async (secret) => {
  const client = new faunadb.Client({
    secret, // from JWT template
    keepAlive: false
  });
  const userId = await client.query(q.CurrentIdentity());

  return { id: userId };
};`;

// Main component using <SignedIn> and <SignedOut>.
//
// The SignedIn and SignedOut components are used to control rendering depending
// on whether or not a visitor is signed in.
//
// https://docs.clerk.dev/frontend/react/signedin-and-signedout
const Main = () => (
  <main className={styles.main}>
    <h1 className={styles.title}>Welcome to your new app</h1>
    <SignedIn>
      <p className={styles.description}>You have successfully signed in</p>
    </SignedIn>
    <SignedOut>
      <p className={styles.description}>
        Sign up for an account to get started
      </p>
    </SignedOut>
    <SignedIn>
      <Example />
    </SignedIn>
    <SignedOut>
      <div className={styles.cards}>
        <div className={styles.card}>
          <SignupLink />
        </div>
        <div className={styles.card}>
          <Link href="https://dashboard.clerk.dev?utm_source=github&utm_medium=starter_repos&utm_campaign=nextjs_starter">
            <a target="_blank" rel="noopener" className={styles.cardContent}>
              <img src="/icons/settings.svg" />
              <div>
                <h3>Configure settings for your app</h3>
                <p>
                  Visit Clerk to manage instances and configure settings for
                  user management, theme, and more
                </p>
              </div>
              <div className={styles.arrow}>
                <img src="/icons/arrow-right.svg" />
              </div>
            </a>
          </Link>
        </div>
      </div>
    </SignedOut>
    <div className={styles.links}>
      <Link href="https://docs.clerk.dev?utm_source=github&utm_medium=starter_repos&utm_campaign=nextjs_starter">
        <a target="_blank" rel="noopener" className={styles.link}>
          <span className={styles.linkText}>Read Clerk documentation</span>
        </a>
      </Link>
      <Link href="https://nextjs.org/docs">
        <a target="_blank" rel="noopener" className={styles.link}>
          <span className={styles.linkText}>Read Next.js documentation</span>
        </a>
      </Link>
    </div>
  </main>
);

const Example = () => {
  const { getToken } = useAuth();

  React.useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  });
  const [active, setActive] = React.useState();
  const isFauna = active === 'fauna';
  const [response, setResponse] = React.useState(
    '// Click above to run the request'
  );
  const makeQuery = async () => {
    setActive('fauna');
    setResponse('// Loading...');

    try {
      // TODO: Update with your JWT template name
      // https://docs.clerk.dev/popular-guides/jwt-templates
      const secret = await getToken({ template: 'fauna' });
      const body = await verifyIdentity(secret);
      setResponse(JSON.stringify(body, null, '  '));
    } catch (e) {
      console.log(e);
      setResponse(
        '// There was an error with the request. Please contact support@clerk.dev'
      );
    }
  };

  const makeRequest = async () => {
    setActive('clerk');
    setResponse('// Loading...');

    try {
      const res = await fetch('/api/currentUser');
      const body = await res.json();
      setResponse(JSON.stringify(body, null, '  '));
    } catch (e) {
      setResponse(
        '// There was an error with the request. Please contact support@clerk.dev'
      );
    }
  };

  return (
    <div className={styles.backend}>
      <div className={styles.card}>
        <button
          className={styles.cardContent}
          onClick={makeQuery}
          type="button"
        >
          <img
            className={styles.cardLogo}
            alt="Fauna logo"
            src="/logos/logo-fauna.svg"
          />
          <div>
            <h3>faunadb.query.CurrentIdentity()</h3>
            <p>Retrieve current user ID from Fauna</p>
          </div>
          <div className={styles.arrow}>
            <img alt="Make request" src="/icons/download.svg" />
          </div>
        </button>
      </div>
      <div className={styles.card}>
        <button
          className={styles.cardContent}
          onClick={makeRequest}
          type="button"
        >
          <img
            className={styles.cardLogo}
            alt="Clerk logo"
            src="/logos/logo-clerk.svg"
          />
          <div>
            <h3>fetch('/api/currentUser')</h3>
            <p>Retrieve current user ID from Next.js API route</p>
          </div>
          <div className={styles.arrow}>
            <img alt="Make request" src="/icons/download.svg" />
          </div>
        </button>
      </div>
      <h4>
        Response
        <em>
          <SignedIn>
            You are signed in, so the request will return your user ID
          </SignedIn>
          <SignedOut>
            You are signed out, so the request will return null
          </SignedOut>
        </em>
      </h4>
      <pre>
        <code className="language-js">{response}</code>
      </pre>
      {active ? (
        <>
          <h4>
            {isFauna ? 'lib/fauna/index.js' : 'pages/api/clerk/currentUser.js'}
          </h4>
          <pre>
            <code className="language-js">
              {isFauna ? faunaCode : clerkCode}
            </code>
          </pre>
        </>
      ) : null}
    </div>
  );
};

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
    Powered by{' '}
    <a
      href="https://clerk.dev?utm_source=github&utm_medium=starter_repos&utm_campaign=nextjs_starter"
      target="_blank"
    >
      <img src="/clerk.svg" alt="Clerk.dev" className={styles.logo} />
    </a>
    +
    <a href="https://nextjs.org/" target="_blank" rel="noopener">
      <img src="/nextjs.svg" alt="Next.js" className={styles.logo} />
    </a>
  </footer>
);

const Home = () => (
  <div className={styles.container}>
    <Main />
    <Footer />
  </div>
);

export default Home;
