import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Markdown from './Markdown';
import MainFeaturedPost from './MainFeaturedPost';
import Link from '@mui/material/Link';
import PreviewBlogPost from './PreviewBlogPost';

function Main(props) {
  const { posts, title } = props;

  const mainFeaturedPost = {
    title: 'Customized Streaks Calendar with FSCalendar',
    description:
      "Make a calendar in your iOS app with colors filled according to user progress. Useful if you display daily achievements or streaks.",
    image: 'images/writing/fscalendar_main.jpg',
    imageText: 'Customized streaks calendar',
    linkText: 'Continue reading…',
  };

  return (
    <main>
    <MainFeaturedPost post={mainFeaturedPost} />
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider />
      {posts.map((post) => (
        <PreviewBlogPost post={post} cutoff={200} key={post.substring(0, 40)}></PreviewBlogPost>
      ))}
    </Grid>
    </main>
  );
}

Main.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
};

export default Main;
