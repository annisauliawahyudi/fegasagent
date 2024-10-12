import React from 'react';
import { Typography } from "@material-tailwind/react";

const PageNotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <Typography variant="h1" color="red" className="font-bold">
          404
        </Typography>
        <Typography variant="h4" color="blue-gray">
          Page Not Found
        </Typography>
        <Typography variant="body1" className="mt-4">
          The page you are looking for doesn't exist or has been moved.
        </Typography>
      </div>
    </div>
  );
};

export default PageNotFound;
