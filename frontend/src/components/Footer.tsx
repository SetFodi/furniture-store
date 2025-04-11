// src/components/Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 mt-12 py-8">
      {" "}
      {/* Added mt-12 for spacing */}
      <div className="container mx-auto px-6 text-center text-gray-600">
        <p>&copy; {currentYear} FancyFurnish. All rights reserved.</p>
        {/* You can add more links or info here later */}
        {/* <div className="mt-4 space-x-4">
          <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
          <a href="#" className="hover:text-indigo-600">Terms of Service</a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
