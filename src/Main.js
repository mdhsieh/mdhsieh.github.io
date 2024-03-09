import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import MainFeaturedPost from './MainFeaturedPost';

import PreviewBlogPost from './PreviewBlogPost';
import { getUrlFromMarkdown } from './Blog';

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
    {posts[0] && <MainFeaturedPost post={mainFeaturedPost} link={"/" + 0}/>}
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
        <PreviewBlogPost post={post} cutoff={200} link={"#"} key={post.substring(0, 40)}></PreviewBlogPost>
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
