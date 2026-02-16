import React from 'react';

interface TagProps {
  children: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({ children }) => (
  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] uppercase tracking-widest text-white/70 font-semibold">
    {children}
  </span>
);

export default Tag;
