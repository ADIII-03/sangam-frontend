// src/components/FloatingBackground.jsx

import React from 'react';
import FloatingShape from './FloatingShape';

const FloatingBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <FloatingShape color="bg-blue-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-blue-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-blue-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />
    </div>
  );
};

export default FloatingBackground;
