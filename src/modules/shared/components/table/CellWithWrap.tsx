import React from 'react';

type CellWithWrapProps = {
  value: string | number | null | undefined;
};

const CellWithWrap: React.FC<CellWithWrapProps> = ({ value }) => {
  return (
    <div
      style={{
        wordBreak: 'break-word',
      }}
    >
      {value || ''}
    </div>
  );
};

export default CellWithWrap;
