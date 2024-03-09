import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';
import post1 from './blog-post.1.md';
import post2 from './blog-post.2.md';
import post3 from './blog-post.3.md';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Markdown from './Markdown';

const sections = [
  { title: 'Apps', url: '/apps' },
  { title: 'Writing', url: '/' },
  { title: 'About', url: '/about' },
];

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
  image: 'images/profilepic.png',
};

const defaultTheme = createTheme();

export const getUrlFromMarkdown = function(text) {
  return text.substring(0, 15).replace(/\W+/g, '-').toLowerCase()
}

export default function Blog() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const postUrls = [post1, post2, post3]

    Promise.all(
      postUrls.map(url =>
        fetch(url)
          .then(res => res.text())
      )
    ).then(texts => {
      setPosts(texts)
    });
  }, [])

  return (
    <Router>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Header title="Michael's Blog" sections={sections} />
            <Routes>
              <Route path="/" element={
                <Grid container spacing={5} sx={{ mt: 3 }}>
                  <Main title="Writing" posts={posts} />
                </Grid>
              }></Route>
              <Route path="/about" element={
                  <Sidebar
                    title={sidebar.title}
                    description={sidebar.description}
                    archives={sidebar.archives}
                    social={sidebar.social}
                    image={sidebar.image}
                  />
              }></Route>
              {posts.map(post => <Route key={post.substring(0, 40)} path={getUrlFromMarkdown(post) } element={
                <Markdown className="markdown">
                  {post}
                </Markdown>
              }></Route>)}
            </Routes>
        </Container>
        <Footer
          title=""
          description=""
        />
      </ThemeProvider>
    </Router>
  );
}
