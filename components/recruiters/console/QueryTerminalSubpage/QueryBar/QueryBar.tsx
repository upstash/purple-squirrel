import React, { useState } from 'react';
import styles from './QueryBar.module.css';

const QueryBar = () => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = async () => {
    console.log('Searching for:', query);
  };

  const handleSaveQuery = async () => {
    try {
      const response = await fetch('/api/save-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Network response was not ok');
      }
      console.log('Query saved successfully:', data.message);
    } catch (error) {
      console.error('Error saving query:', error);
    }
  };

  return (
    <div className={styles.queryBar}>
      <input
        type="text"
        placeholder="Search, sort and filter applicants..."
        value={query}
        onChange={handleInputChange}
        className={styles.inputField}
      />
      <button type="button" onClick={handleSearch}>Search</button>
      <button type="button" onClick={handleSaveQuery}>Save Query</button>
    </div>
  );
};

export default QueryBar;
