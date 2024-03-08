import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Markdown from './Markdown';

import FeaturedPost from './FeaturedPost';
import MainFeaturedPost from './MainFeaturedPost';

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

  const featuredPosts = [
    {
      title: 'Featured post',
      date: 'Nov 12',
      description:
        'This is a wider card with supporting text below as a natural lead-in to additional content.',
      image: 'https://source.unsplash.com/random?wallpapers',
      imageLabel: 'Image Text',
    },
    {
      title: 'Post title',
      date: 'Nov 11',
      description:
        'This is a wider card with supporting text below as a natural lead-in to additional content.',
      image: 'https://source.unsplash.com/random?wallpapers',
      imageLabel: 'Image Text',
    },
  ];

  return (
    <main>
    <MainFeaturedPost post={mainFeaturedPost} />
    {/* <Grid container spacing={4}>
      {featuredPosts.map((post) => (
        <FeaturedPost key={post.title} post={post} />
      ))}
    </Grid> */}
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
        <Markdown className="markdown" key={post.substring(0, 40)}>
          {post}
        </Markdown>
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
