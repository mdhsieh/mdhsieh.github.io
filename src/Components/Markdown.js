import * as React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {tomorrow as CodeStyle} from 'react-syntax-highlighter/dist/esm/styles/prism';
import SyntaxHighligher from './SyntaxHighlighter';

// Syntax highlighting
const CodeBlock = ({className, children}) => {
  let lang = 'swift'; 
  if (className && className.startsWith('lang-')) {
    lang = className.replace('lang-', '');
  }
  return (
    <SyntaxHighlighter language={lang} style={CodeStyle}>
      {children}
    </SyntaxHighlighter>
  );
}

// markdown-to-jsx uses <pre><code/></pre> for code blocks.
const PreBlock = ({children, ...rest}) => {
  if ('type' in children && children ['type'] === 'code') {
    return CodeBlock(children['props']);
  }
  return <pre {...rest}>{children}</pre>;
};

// Markdown
function MarkdownListItem(props) {
  return <Box component="li" sx={{ mt: 1, typography: 'body1' }} {...props} />;
}

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h4',
        component: 'h1',
      },
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h6', component: 'h2' },
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'subtitle1' },
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'caption',
        paragraph: true,
      },
    },
    p: {
      component: Typography,
      props: { paragraph: true },
    },
    a: { component: Link },
    li: {
      component: MarkdownListItem,
    },
    pre: PreBlock,
  },
};

export default function Markdown(props) {
  return <ReactMarkdown options={options} {...props} />;
}
