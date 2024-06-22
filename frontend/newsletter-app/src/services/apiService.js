export const fetchNewsletter = async () => {
    const response = await fetch('/api/newsletter');
    if (!response.ok) {
      throw new Error('Failed to fetch newsletter');
    }
    return await response.json();
  };
  