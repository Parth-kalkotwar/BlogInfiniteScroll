import React, { Component } from "react";
import { PostList } from "../components/home";
import { Client } from "utils/prismicHelpers";
import Prismic from "prismic-javascript";
import InfiniteScroll from "react-infinite-scroll-component";

class HomePosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      total_posts: this.props.posts.length,
      posts: [],
      pageNo: 0,
    };
  }

  fetchPosts = () => {
    this.setState({ pageNo: this.state.pageNo + 1 });

    const client = Client();
    const posts = client
      .query(Prismic.Predicates.at("document.type", "post"), {
        pageSize: 1,
        page: this.state.pageNo,
        orderings: "[my.post.date desc]",
      })
      .then((posts) => {
        this.setState({ posts: this.state.posts.concat(posts.results) });
      });
  };

  MoveToTop = () => {
    this.setState({ pageNo: 0 });
  };

  componentDidMount() {
    const prop = this.fetchPosts();
  }

  render() {
    if (this.state.pageNo > this.state.total_posts && this.state.hasMore) {
      this.setState({ hasMore: false });
      return <></>;
    } else {
      return (
        <>
          <InfiniteScroll
            dataLength={this.state.posts.length}
            next={this.fetchPosts}
            hasMore={this.state.hasMore}
            loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          >
            <PostList posts={this.state.posts} />
          </InfiniteScroll>

          {!this.state.hasMore && (
            <h2 style={{ textAlign: "center" }}> You're All Caught Up...</h2>
          )}
        </>
      );
    }
  }
}
export default HomePosts;
