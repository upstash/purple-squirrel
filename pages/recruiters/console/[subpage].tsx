import { useRouter } from 'next/router';
import React from 'react';

const RecruiterConsoleSubpage = () => {
  const router = useRouter();
  const { subpage } = router.query;

  let content;
  switch (subpage) {
    case 'query-terminal':
      content = <p>Query Terminal</p>;
      break;
    case 'recent-queries':
      content = <p>Recent Queries</p>;
      break;
    case 'saved-queries':
      content = <p>Saved Queries</p>;
      break;
    default:
      content = <div>Page not found</div>;
  }

  return (
    <>
      <p>Recruiter Console Navbar</p>
      <main>{content}</main>
    </>
  );
};

export default RecruiterConsoleSubpage;