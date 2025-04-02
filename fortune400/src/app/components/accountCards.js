// accountCards.js
import React from 'react';

const Cards = () => {
  return (
    <div className="min-w-[110%] max-w-96 mx-auto">
      <div className="flex gap-6 justify-center">
        <div className="flex-1">
          <div className="bg-lightText border rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Account 1</h2>
            <p>Card content</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="border rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Account 2</h2>
            <p>Card content</p>
          </div>
        </div>

        <div className="flex-1">
          <div className="border rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Add New Account</h2>
            <p>Card content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
