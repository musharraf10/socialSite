import React, { useEffect, useState } from "react";
import { fetchTrendingContent } from "../../../APIServices/subscribe/trendingapi";
import { Spinner, Alert, Container, Row, Col, Card, Button } from "react-bootstrap";

const Trending = () => {
  const [trendingData, setTrendingData] = useState({
    articles: [],
    videos: [],
    webinars: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await fetchTrendingContent();
        console.log("Fetched Data:", data);
        
        // Ensure data has expected structure before updating state
        setTrendingData({
          articles: data.articles || [],
          videos: data.videos || [],
          webinars: data.webinars || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <Spinner animation="border" />
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  // Function to render sections dynamically
  const renderSection = (title, content, color, buttonText) => (
    content.length > 0 ? (
      <div className="mb-5">
        <h3 className={`text-${color}`}>{title}</h3>
        <Row>
          {content.map((item) => (
            <Col md={4} key={item._id} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Img variant="top" src={item.thumbnail} alt={item.title} />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Button variant={color} href={item.contentUrl} target="_blank">
                    {buttonText}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    ) : (
      <p className="text-muted text-center">No {title.toLowerCase()} available.</p>
    )
  );

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">🔥 Trending Content</h2>
      {renderSection("📖 Top Articles", trendingData.articles, "primary", "Read More")}
      {renderSection("🎬 Top Videos", trendingData.videos, "success", "Watch Video")}
      {renderSection("📅 Top Webinars", trendingData.webinars, "warning", "Join Webinar")}
    </Container>
  );
};

export default Trending;
