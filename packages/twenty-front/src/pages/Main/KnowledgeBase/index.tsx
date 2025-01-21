import React, { useEffect } from "react";

const KnowledgeBasePage: React.FC = () => {
  useEffect(() => {
    // Redirect to the external link upon component mounting
    window.location.href = "https://docs.salestools.io/"; // Replace "https://example.com" with your desired external link
  }, []); // Empty dependency array ensures the effect runs only once after the component mounts

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start gap-20'>
          <h2 className='font-normal select-none text-25 text-neutral-800 dark:text-neutral-300'>
            Knowledge Base
          </h2>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
