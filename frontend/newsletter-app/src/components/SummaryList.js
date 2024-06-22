import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

const SummaryList = ({ summaries }) => {
  return (
    <div className="p-4">
      {summaries.map((summary, index) => (
        <Card key={index} className="flex mb-4">
          {summary.visualUrl && (
            <CardMedia
              component="img"
              image={summary.visualUrl}
              alt="Visual representation"
              className="w-32"
            />
          )}
          <CardContent className="flex-1">
            <Typography variant="body1" component="p">
              {summary.text}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryList;
