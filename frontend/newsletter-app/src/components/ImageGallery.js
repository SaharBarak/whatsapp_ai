import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

const ImageGallery = ({ images }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {images.map((url, index) => (
        <Card key={index} className="w-32 h-32">
          <CardMedia
            component="img"
            image={url}
            alt={`Shared image ${index}`}
            className="w-full h-full object-cover"
          />
        </Card>
      ))}
    </div>
  );
};

export default ImageGallery;
