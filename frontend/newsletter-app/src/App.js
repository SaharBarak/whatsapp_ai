import React, { useEffect, useState } from 'react';
import GroupChatHeader from './components/GroupChatHeader';
import SummaryList from './components/SummaryList';
import ImageGallery from './components/ImageGallery';
import { fetchNewsletter } from './services/apiService';
import './index.css';

const App = () => {
  const [newsletter, setNewsletter] = useState(null);
  useEffect(() => {
    fetchNewsletter().then(data => setNewsletter(data));
  }, []);

  return (
    <div className="app">
      {newsletter && (
        <>
          <GroupChatHeader groupName={newsletter.groupName} />
          <SummaryList summaries={newsletter.summaries} />
          <ImageGallery images={newsletter.images} />
        </>
      )}
    </div>
  );
};

export default App;
