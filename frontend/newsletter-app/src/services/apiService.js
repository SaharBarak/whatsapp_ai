export const fetchNewsletter = async () => {
    const response = await fetch('api/newsletter/generate-newsletter');//('http://localhost:3000/api/newsletter/generate-newsletter')
    if (!response.ok) {
      throw new Error('Failed to fetch newsletter');
    }
    return await response.json();
  };
  