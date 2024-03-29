import React from 'react';

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

const SyntaxHighligher = ({ language, markdown }) => {
    
    return (
        <SyntaxHighlighter 
            language={language} 
            style={tomorrow}
        >
            {markdown}
        </SyntaxHighlighter>
    );
};

export default SyntaxHighligher;