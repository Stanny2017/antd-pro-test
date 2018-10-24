import React from 'react';
import router from 'umi/router';

const Test = () => (
  <div>
    page Test
    <button
      type="button"
      onClick={() => {
        router.goBack();
      }}
    >
      go back
    </button>
  </div>
);

export default Test;
