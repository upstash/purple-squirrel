import React from 'react';
import styles from './QueryTerminalSubpage.module.css';
import QueryBar from './QueryBar/QueryBar';
import ApplicantsTable from './ApplicantsTable/ApplicantsTable';
import ApplicantView from './ApplicantView/ApplicantView';

const QueryTerminalSubpage = () => {
  return (
    <div>
      <QueryBar />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ApplicantsTable />
        <ApplicantView />
      </div>
    </div>
  );
};

export default QueryTerminalSubpage;
