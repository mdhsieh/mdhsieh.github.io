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
    'I\'m Michael Hsieh, a software engineer. My focus as of early 2024 is mobile app development. I\'ve been coding since I was 16, but I believe number of years doing stuff is not as good a benchmark as what you\'ve done during that time. To that end, I make software, write articles, and share what I\'ve learned with other people who may need a little help in their journey like me. Thanks for stopping by my blog.',
  archives: [
    { title: 'February 2024', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon, url: 'https://github.com/mdhsieh/' },
  ],
  image: 'images/profilepic.png',
};

const defaultTheme = createTheme();

// Create a path string based off the first couple words in a markdown post,
// replace any non-alphanumeric characters, like spaces and markdown syntax, with dashes and then
// remove any leading or trailing dashes
export const getUrlFromMarkdown = function(text) {
  return text
          .substring(0, 25)
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-+/, '').replace(/-+$/, '')
          .toLowerCase()
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const postUrls = [post1, post2]

  const [appPosts, setAppPosts] = useState([])
  const appPostUrls = [post3]

  useEffect(() => {
    Promise.all(
      postUrls.map(url =>
        fetch(url)
          .then(res => res.text())
      )
    ).then(texts => {
      setPosts(texts)
      console.log(texts)
    });
  }, [])

  useEffect(() => {
    Promise.all(
      appPostUrls.map(url =>
        fetch(url)
          .then(res => res.text())
      )
    ).then(texts => {
      setAppPosts(texts)
      console.log(texts)
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
                  <Main title="Writing" posts={posts} />
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
               <Route path="/apps" element={
                  appPosts && appPosts.map(appPost =>
                  <Markdown className="markdown" key={appPost.substring(0, 40)}>
                    {appPost}
                  </Markdown>)
              }></Route>
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
