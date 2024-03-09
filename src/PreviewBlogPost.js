import Markdown from './Markdown';
import Link from '@mui/material/Link';

function PreviewBlogPost(props) {
    const { post, cutoff, link } = props;

    return (
        <div key={post.substring(0, 40)}>
          <Markdown className="markdown" key={post.substring(0, 40)}>
            {post.substring(0, cutoff) + '...'}
          </Markdown>
          <Link
            variant="body1"
            href={link}
          >
            Continue reading...
          </Link>
        </div>
    );
}

export default PreviewBlogPost;