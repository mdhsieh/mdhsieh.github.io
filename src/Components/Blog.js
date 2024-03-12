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
import post1 from '../Writing/blog-post.1.md';
import post2 from '../Writing/blog-post.2.md';
import post3 from '../Writing/blog-post.3.md';
import post4 from '../Writing/blog-post.4.md';
import post5 from '../Writing/blog-post.5.md';
import post6 from '../Writing/blog-post.6.md';
import post7 from '../Writing/blog-post.7.md';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Markdown from './Markdown';

import ScrollToTop from "./ScrollToTop";

const sections = [
  { title: 'Apps', url: '/apps' },
  { title: 'Writing', url: '/' },
  { title: 'About', url: '/about' },
];

const sidebar = {
  title: 'About Me',
  description:
    `I\'m Michael Hsieh, a software engineer. My focus as of early 2024 is mobile app development.

I\'ve been coding since I was 16, but I believe number of years doing stuff is not as good a benchmark as what you\'ve done during that time. 

To that end, I make software, write articles, and share what I\'ve learned with other people who may need a little help in their journey like me. Thanks for stopping by my blog.`,
  archives: [
    { title: 'February 2024', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon, url: 'https://github.com/mdhsieh/' },
  ],
  image: 'images/profilepic.png',
};

// Create a path string based off the first couple words in a markdown post,
// replace any non-alphanumeric characters, like spaces and markdown syntax, with dashes, and then
// remove any leading or trailing dashes.
export const getPathFromMarkdown = function(text) {
  return text
          .substring(0, 50)
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-+/, '').replace(/-+$/, '')
          .toLowerCase()
}

const defaultTheme = createTheme();

export default function Blog() {
  const [posts, setPosts] = useState([])
  const postUrls = [post1, post2, post4, post5, post6, post7]

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
    });
  }, [])

  return (
    <Router>
      <ScrollToTop />
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

              {posts.map(post => <Route key={post.substring(0, 40)} path={"/" + getPathFromMarkdown(post) } element={
                <Markdown className="markdown">
                  {post}
                </Markdown>
              }></Route>)}

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
