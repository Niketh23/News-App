import React, {useState,useEffect} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props)=>{
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // constructor(props) {
  //   super(props);
  //   console.log("Hello i am a constructor");
    
  //   this.state = {
  //     articles: [],
  //     loading: true,
  //     page: 1,
  //     totalResults: 0,
  //   };
  // }

  const updateNews = async ()=> {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${
      props.category
    }&apiKey=54e538a9778a4fdcb482e7dea03c70ef&page=${
      page
    }&pagesize=${props.pageSize}`;
    setLoading(true)
    // this.setState({
    //   loading: true,
    // });
    let data = await fetch(url);
    props.setProgress(30);
    let parseData = await data.json();
    props.setProgress(70);
    setArticles(parseData.articles)
    setTotalResults(parseData.totalResults)
    setLoading(false)
    props.setProgress(100);
        // this.setState({
    //   totalResults: parseData.totalResults,
    //   articles: parseData.articles,
    //   loading: false,
    // });
  }
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(
      props.category
    )}- NewsToday`;
    updateNews();
    // esline-disable-next-line
  }, [])
  
  // async componentDidMount() {
  //   this.updateNews();
  // }

  // const handlePrevClick = async () => {
  //   setPage(page-1);
  //   // this.setState({
  //   //   page: this.state.page - 1,
  //   // });
  //   updateNews();
  // };
  // const handleNextClick = async () => {
  //   setPage(page+1);
  //   // this.setState({
  //   //   page: this.state.page + 1,
  //   // });
  //   updateNews();
  // };

  const fetchMoreData = async () => {
    // this.setState({
    //   page: this.state.page + 1,
    // });

    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${
      props.category
    }&apiKey=54e538a9778a4fdcb482e7dea03c70ef&page=${
      page+1
    }&pagesize=${props.pageSize}`;
    setPage(page+1);
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles))
    setTotalResults(parseData.totalResults)
    // setLoading(false)
    // this.setState({
    //   totalResults: parseData.totalResults,
    //   articles: articles.concat(parseData.articles),
    //   loading: false,
    // });
  };

    return (
      <div className="container my-3">
        <h1 className="text-center" style={{margin:'35px 0px',marginTop:'90px'}}>
          NewsToday - Top {capitalizeFirstLetter(props.category)}{" "}
          Headlines
        </h1>
        {loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !==totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div key={element.url} className="col-md-4">
                    <NewsItem
                      title={element.title ? element.title.slice(0, 45) : ""}
                      description={
                        element.description
                          ? element.description.slice(0, 88)
                          : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      date={element.publishedAt}
                      author={element.author}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    );
}

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
