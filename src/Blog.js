import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';
import post1 from './blog-post.1.md';
import post2 from './blog-post.2.md';
import post3 from './blog-post.3.md';

const sections = [
  { title: 'Apps', url: '#' },
  { title: 'Writing', url: '#' },
  { title: 'About', url: '#' },
];

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

const posts = []

fetch(post1)
  .then(response => response.text())
  .then(text => {
    // Logs a string of Markdown content.
    // Now you could use e.g. <rexxars/react-markdown> to render it.
    posts.push(text);
  });

const sidebar = {
  title: 'About Me',
  description:
    'I\'m Michael Hsieh, a software engineer. I\'ve been coding since I was 16, but I believe number of years doing stuff is not as good a benchmark as what you\'ve done during that time. To that end, I make software, write articles, and share what I\'ve learned with other people who may need a little help in their journey like me. Thanks for stopping by my blog.',
  archives: [
    { title: 'February 2024', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon, url: 'https://github.com/mdhsieh/' },
  ],
};

const defaultTheme = createTheme();

export default function Blog() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Michael's Blog" sections={sections} />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          {/* <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid> */}
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title="Writing" posts={posts} />
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
      <Footer
        title=""
        description=""
      />
    </ThemeProvider>
  );
}
