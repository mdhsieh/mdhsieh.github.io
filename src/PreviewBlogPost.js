import { React } from "react";
import Markdown from './Markdown';
import Link from '@mui/material/Link';
import {Link as RouterLink } from 'react-router-dom';

function PreviewBlogPost(props) {
    const { post, cutoff, path } = props;

    return (
        <div key={post.substring(0, 40)}>
          <Markdown className="markdown" key={post.substring(0, 40)}>
            {post.substring(0, cutoff) + '...'}
          </Markdown>
          <Link
            variant="body1"
            // href={path}
            component={RouterLink}
            to={path}
          >
            Continue reading...
          </Link>
        </div>
    );
}

export default PreviewBlogPost;