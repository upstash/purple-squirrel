import { useRouter } from 'next/router';
import React from 'react';
import RecruiterConsoleNavbar from '@/components/recruiters/console/RecruiterConsoleNavbar/RecruiterConsoleNavbar';
import QueryTerminalSubpage from '@/components/recruiters/console/QueryTerminalSubpage/QueryTerminalSubpage';
import RecentQueriesSubpage from '@/components/recruiters/console/RecentQueriesSubpage/RecentQueriesSubpage';
import SavedQueriesSubpage from '@/components/recruiters/console/SavedQueriesSubpage/SavedQueriesSubpage';

const RecruiterConsoleSubpage = () => {
  const router = useRouter();
  const { subpage } = router.query;

  let content;
  switch (subpage) {
    case 'query-terminal':
      content = <QueryTerminalSubpage />;
      break;
    case 'recent-queries':
      content = <RecentQueriesSubpage />;
      break;
    case 'saved-queries':
      content = <SavedQueriesSubpage />;
      break;
    default:
      content = <div>Page not found</div>;
  }

  return (
    <>
      <RecruiterConsoleNavbar />
      <main>{content}</main>
    </>
  );
};

export default RecruiterConsoleSubpage;