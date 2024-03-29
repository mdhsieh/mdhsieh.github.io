import { React } from "react";
import Markdown from './Markdown';
import Link from '@mui/material/Link';
import {Link as RouterLink } from 'react-router-dom';

function PreviewBlogPost(props) {
    const { post, cutoff, path } = props;

    return (
        <div key={post['id']}>
          <Markdown className="markdown" key={post['id']}>
            {post['text'].substring(0, cutoff) + '...'}
          </Markdown>
          <Link
            variant="body1"
            component={RouterLink}
            to={path}
          >
            Continue reading...
          </Link>
        </div>
    );
}

export default PreviewBlogPost;