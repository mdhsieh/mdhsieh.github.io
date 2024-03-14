import * as React from 'react';
import { useParams } from "react-router-dom";
import Markdown from './Markdown';

// To read post ID, do filtering, and pass the post prop
const MarkdownWrapper = (props) => {
    const params = useParams();
    const postId = params.id
    const { posts } = props;

    let post = posts.find(post => post['id'] === postId)
  
    return (
        <Markdown className="markdown">
            {post['text']}
        </Markdown>
    );
};

export default MarkdownWrapper;
  