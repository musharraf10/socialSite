import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CategoryIcon from "@mui/icons-material/Category";
import SortIcon from "@mui/icons-material/Sort";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";
import CommentIcon from "@mui/icons-material/Comment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const ITEMS_PER_PAGE = 8;


const articlesData = [
    {
        id: "1",
        category: "Articles",
        img: "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Movie Night",
        description: "Experience the magic of cinema with a perfect movie night! Grab some popcorn, cozy up with your favorite people, and enjoy a film that takes you on an unforgettable journey. Whether it's a comedy, thriller, or classic drama, movie nights are the perfect way to relax and escape reality..",
        date: "2025-02-20",
        popularity: 95
    },
    {
        id: "2",
        category: "Articles",
        img: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Study Tips",
        description: "Boost your learning efficiency with expert study tips! From time management strategies to effective note-taking techniques, mastering the art of studying can help you retain information better and perform well in exams. Stay organized, take regular breaks, and create a distraction-free environment for maximum focus..",
        date: "2025-02-18",
        popularity: 87
    },
    {
        id: "3",
        category: "Articles",
        img: "https://images.pexels.com/photos/4057663/pexels-photo-4057663.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Breaking Article",
        description: "Stay updated with the latest breaking Article from around the world. Whether it's politics, business, technology, or global events, get real-time information to stay informed and ahead of the curve. Never miss out on crucial updates that impact your daily life.",
        date: "2025-02-15",
        popularity: 92
    },
    {
        id: "4",
        category: "Articles",
        img: "https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Articlesy Living",
        description: "Achieve a balanced and fulfilling lifestyle with Articlesy living practices. Focus on nutritious eating, regular exercise, and mental well-being to enhance your quality of life. Small daily habits like drinking more water, sleeping well, and practicing mindfulness can make a huge difference in your overall Articles.",
        date: "2025-02-12",
        popularity: 80
    },
    {
        id: "5",
        category: "Articles",
        img: "https://images.pexels.com/photos/358010/pexels-photo-358010.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Music Fest",
        description: "Experience the magic of cinema with a perfect movie night! Grab some popcorn, cozy up with your favorite people, and enjoy a film that takes you on an unforgettable journey. Whether it's a comedy, thriller, or classic drama, movie nights are the perfect way to relax and escape reality..",
        date: "2025-02-10",
        popularity: 85
    },
    {
        id: "6",
        category: "Articles",
        img: "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Nutrition Guide",
        description: "Achieve a balanced and fulfilling lifestyle with Articlesy living practices. Focus on nutritious eating, regular exercise, and mental well-being to enhance your quality of life. Small daily habits like drinking more water, sleeping well, and practicing mindfulness can make a huge difference in your overall Articles.",
        date: "2025-02-08",
        popularity: 78
    },
    {
        id: "7",
        category: "Articles",
        img: "https://images.pexels.com/photos/159844/cellular-Articles-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Online Courses",
        description: "Boost your learning efficiency with expert study tips! From time management strategies to effective note-taking techniques, mastering the art of studying can help you retain information better and perform well in exams. Stay organized, take regular breaks, and create a distraction-free environment for maximum focus.",
        date: "2025-02-05",
        popularity: 88
    },
    {
        id: "8",
        category: "Articles",
        img: "https://images.pexels.com/photos/3957616/pexels-photo-3957616.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "World Article",
        description: "Stay updated with the latest breaking Article from around the world. Whether it's politics, business, technology, or global events, get real-time information to stay informed and ahead of the curve. Never miss out on crucial updates that impact your daily life.",
        date: "2025-02-03",
        popularity: 75
    },
    {
        id: "9",
        category: "Articles",
        img: "https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Movie Night",
        description: "Experience the magic of cinema with a perfect movie night! Grab some popcorn, cozy up with your favorite people, and enjoy a film that takes you on an unforgettable journey. Whether it's a comedy, thriller, or classic drama, movie nights are the perfect way to relax and escape reality..",
        date: "2025-02-01",
        popularity: 82
    },
    {
        id: "10",
        category: "Articles",
        img: "https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Study Tips",
        description: "Boost your learning efficiency with expert study tips! From time management strategies to effective note-taking techniques, mastering the art of studying can help you retain information better and perform well in exams. Stay organized, take regular breaks, and create a distraction-free environment for maximum focus..",
        date: "2025-01-30",
        popularity: 90
    },
    {
        id: "11",
        category: "Articles",
        img: "https://images.pexels.com/photos/4057663/pexels-photo-4057663.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Breaking Article",
        description: "Stay updated with the latest breaking Article from around the world. Whether it's politics, business, technology, or global events, get real-time information to stay informed and ahead of the curve. Never miss out on crucial updates that impact your daily life.",
        date: "2025-01-28",
        popularity: 95
    },
    {
        id: "12",
        category: "Articles",
        img: "https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Articlesy Living",
        description: "Achieve a balanced and fulfilling lifestyle with Articlesy living practices. Focus on nutritious eating, regular exercise, and mental well-being to enhance your quality of life. Small daily habits like drinking more water, sleeping well, and practicing mindfulness can make a huge difference in your overall Articles.",
        date: "2025-01-25",
        popularity: 79
    },
    {
        id: "13",
        category: "Articles",
        img: "https://images.pexels.com/photos/358010/pexels-photo-358010.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Music Fest",
        description: "Experience the magic of cinema with a perfect movie night! Grab some popcorn, cozy up with your favorite people, and enjoy a film that takes you on an unforgettable journey. Whether it's a comedy, thriller, or classic drama, movie nights are the perfect way to relax and escape reality..",
        date: "2025-01-23",
        popularity: 87
    },
    {
        id: "14",
        category: "Articles",
        img: "https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Nutrition Guide",
        description: "Achieve a balanced and fulfilling lifestyle with Articlesy living practices. Focus on nutritious eating, regular exercise, and mental well-being to enhance your quality of life. Small daily habits like drinking more water, sleeping well, and practicing mindfulness can make a huge difference in your overall Articles.",
        date: "2025-01-20",
        popularity: 83
    },
    {
        id: "15",
        category: "Articles",
        img: "https://images.pexels.com/photos/159844/cellular-Articles-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "Online Courses",
        description: "Boost your learning efficiency with expert study tips! From time management strategies to effective note-taking techniques, mastering the art of studying can help you retain information better and perform well in exams. Stay organized, take regular breaks, and create a distraction-free environment for maximum focus.",
        date: "2025-01-18",
        popularity: 91
    },
    {
        id: "16",
        category: "Articles",
        img: "https://images.pexels.com/photos/3957616/pexels-photo-3957616.jpeg?auto=compress&cs=tinysrgb&w=600",
        title: "World Article",
        description: "Stay updated with the latest breaking Article from around the world. Whether it's politics, business, technology, or global events, get real-time information to stay informed and ahead of the curve. Never miss out on crucial updates that impact your daily life.",
        date: "2025-01-15",
        popularity: 78
    },
    {
        id: "17",
        category: "Tutorials",
        title: "Live Webinar: Mastering React in 2025",
        description: "Join us for a deep dive into React's latest features and best practices.",
        thumbnail: "https://th.bing.com/th/id/OIP.jdCUb69papqX-tIIur9gfQHaDa?rs=1&pid=ImgDetMain",
        tutorialUrl: "https://www.youtube.com/embed/Ke90Tje7VS0",
        date: "2025-01-12",
        popularity: 93
    },
    {
        id: "18",
        category: "Tutorials",
        title: "Live Discussion: The Future of JavaScript",
        description: "Industry experts discuss upcoming trends and innovations in JavaScript.",
        thumbnail: "https://i.morioh.com/2020/03/21/4c2be688efe4.jpg",
        tutorialUrl: "https://www.youtube.com/embed/VlPiVmYuoqw",
        date: "2025-01-10",
        popularity: 85
    },
    {
        id: "19",
        category: "Tutorials",
        title: "MERN Stack Live Workshop",
        description: "Build a full-stack application with MERN in a hands-on session.",
        thumbnail: "https://miro.medium.com/v2/resize:fit:1200/1*Ik9bSDA6n96jyoTI4jpc_Q.png",
        tutorialUrl: "https://www.youtube.com/embed/7CqJlxBYj-M",
        date: "2025-01-08",
        popularity: 89
    },
    {
        id: "20",
        category: "Tutorials",
        title: "Redux in Action: State Management Strategies",
        description: "Learn how to effectively manage state in complex applications.",
        thumbnail: "https://th.bing.com/th/id/OIP.7-muN-5voQ3MesyN1vu7GQHaDH?rs=1&pid=ImgDetMain",
        tutorialUrl: "https://www.youtube.com/embed/93p3LxR9xfM",
        date: "2025-01-05",
        popularity: 87
    },
    {
        id: "21",
        category: "Tutorials",
        title: "Live CSS Workshop: Responsive Design",
        description: "Hands-on session covering CSS Grid, Flexbox, and modern design techniques.",
        thumbnail: "https://i.ytimg.com/vi/p0bGHP-PXD4/maxresdefault.jpg",
        tutorialUrl: "https://www.youtube.com/embed/ieTHC78giGQ",
        date: "2025-01-03",
        popularity: 82
    },
    {
        id: "22",
        category: "Tutorials",
        title: "Node.js & Express: Building Scalable APIs",
        description: "Live API development session with Q&A and real-time coding.",
        thumbnail: "https://qualitapps.com/wp-content/uploads/2023/02/102.png",
        tutorialUrl: "https://www.youtube.com/embed/Oe421EPjeBE",
        date: "2025-01-01",
        popularity: 90
    },
    {
        id: "23",
        category: "Videos",
        title: "Exploring the Future of AI",
        description: "A deep dive into how artificial intelligence is shaping our world.",
        thumbnail: "https://qualityhubindia.com/wp-content/uploads/2023/05/Future-of-AI-990x500.png",
        videoUrl: "https://youtu.be/Dr1I99pvdA8",
        date: "2024-12-28",
        popularity: 94
    },
    {
        id: "24",
        category: "Videos",
        title: "The Art of Minimalism in Design",
        description: "Understanding the principles of minimalistic design and its impact.",
        thumbnail: "https://thumbs.dreamstime.com/z/minimalism-design-art-movement-emphasizes-simplicity-functionality-use-minimal-elements-to-convey-message-272055538.jpg",
        videoUrl: "https://youtu.be/4UQ35-o7w_4",
        date: "2024-12-25",
        popularity: 85
    },
    {
        id: "25",
        category: "Videos",
        title: "Breaking Down Web3 and Blockchain",
        description: "An introduction to Web3 technologies and their potential.",
        thumbnail: "https://img.youtube.com/vi/ZQFzMfHIxng/0.jpg",
        videoUrl: "https://www.youtube.com/watch?v=ZQFzMfHIxng",
        date: "2024-12-22",
        popularity: 88
    },
    {
        id: "26",
        category: "Videos",
        title: "The Rise of Remote Work",
        description: "How remote work is changing industries and productivity.",
        thumbnail: "https://th.bing.com/th/id/OIP.kmIzotIVNAVvPA6ae-QUuQHaEI?rs=1&pid=ImgDetMain",
        videoUrl: "https://youtu.be/suGutWSX3tY",
        date: "2024-12-20",
        popularity: 82
    },
    {
        id: "27",
        category: "Videos",
        title: "Cybersecurity Trends in 2025",
        description: "Latest advancements and threats in cybersecurity.",
        thumbnail: "https://media.geeksforgeeks.org/wp-content/uploads/20240103122054/Cybersecurity-Trends-to-Watch-(1).jpg",
        videoUrl: "https://youtu.be/a-5Uf3TKTEE",
        date: "2024-12-18",
        popularity: 91
    },
    {
        id: "28",
        category: "Videos",
        title: "Advancements in Space Exploration",
        description: "New discoveries and missions in the cosmos.",
        thumbnail: "https://topicpie.com/wp-content/uploads/2023/12/The-Growing-Importance-of-Space-Exploration-and-Innovation.webp",
        videoUrl: "https://youtu.be/I4k8pvqNjBM",
        date: "2024-12-15",
        popularity: 87
    },
    {
        id: "29",
        category: "Videos",
        title: "The Future of Electric Vehicles",
        description: "How EVs are revolutionizing transportation.",
        thumbnail: "https://img.freepik.com/free-photo/electric-vehicle-charger-plug-with-digital-display_35913-3359.jpg?t=st=1740139573~exp=1740143173~hmac=62cbea843a17e581341ccacebcabba4d5287ef33c76b9e93fb9269a4c7494dc5&w=1800",
        videoUrl: "https://youtu.be/HgkWQCXEjHg",
        date: "2024-12-12",
        popularity: 86
    },
    {
        id: "30",
        category: "Videos",
        title: "Sustainable Energy Innovations",
        description: "Exploring new ways to harness renewable energy.",
        thumbnail: "https://energysavingtrust.org.uk/wp-content/uploads/2020/08/GettyImages-826669540-green-innovation.jpg",
        videoUrl: "https://www.youtube.com/watch?v=ZQFzMfHIxng",
        date: "2024-12-10",
        popularity: 89
    },
    {
        id: "31",
        category: "Videos",
        title: "The Psychology of Social Media",
        description: "How social media affects our mental health.",
        thumbnail: "https://cdn.iplocation.net/assets/images/blog/featured/social-media-psychology.png",
        videoUrl: "https://youtu.be/-QDjx_spkwI",
        date: "2024-12-08",
        popularity: 84
    },
    {
        id: "32",
        category: "Videos",
        title: "Understanding Quantum Computing",
        description: "A beginner's guide to the world of quantum mechanics and computing.",
        thumbnail: "https://th.bing.com/th/id/OIP.VweJuj7drkYkoR3bnj_v2QHaD3?rs=1&pid=ImgDetMain",
        videoUrl: "https://youtu.be/WhrsONrQhrU",
        date: "2024-12-05",
        popularity: 92
    },
    {
        id: "33",
        category: "Webinar",
        title: "Live Webinar: Mastering React in 2025",
        description: "Join us for a deep dive into React's latest features and best practices.",
        thumbnail: "https://th.bing.com/th/id/OIP.jdCUb69papqX-tIIur9gfQHaDa?rs=1&pid=ImgDetMain",
        tutorialUrl: "https://www.youtube.com/embed/Ke90Tje7VS0",
        date: "2024-12-03",
        popularity: 88
    },
    {
        id: "34",
        category: "Webinar",
        title: "Live Discussion: The Future of JavaScript",
        description: "Industry experts discuss upcoming trends and innovations in JavaScript.",
        thumbnail: "https://i.morioh.com/2020/03/21/4c2be688efe4.jpg",
        tutorialUrl: "https://www.youtube.com/embed/VlPiVmYuoqw",
        date: "2024-12-01",
        popularity: 85
    },
    {
        id: "35",
        category: "Webinar",
        title: "MERN Stack Live Workshop",
        description: "Build a full-stack application with MERN in a hands-on session.",
        thumbnail: "https://miro.medium.com/v2/resize:fit:1200/1*Ik9bSDA6n96jyoTI4jpc_Q.png",
        tutorialUrl: "https://www.youtube.com/embed/7CqJlxBYj-M",
        date: "2024-11-28",
        popularity: 90
    },
    {
        id: "36",
        category: "Webinar",
        title: "Redux in Action: State Management Strategies",
        description: "Learn how to effectively manage state in complex applications.",
        thumbnail: "https://th.bing.com/th/id/OIP.7-muN-5voQ3MesyN1vu7GQHaDH?rs=1&pid=ImgDetMain",
        tutorialUrl: "https://www.youtube.com/embed/93p3LxR9xfM",
        date: "2024-11-25",
        popularity: 87
    },
    {
        id: "37",
        category: "Webinar",
        title: "Live CSS Workshop: Responsive Design",
        description: "Hands-on session covering CSS Grid, Flexbox, and modern design techniques.",
        thumbnail: "https://i.ytimg.com/vi/p0bGHP-PXD4/maxresdefault.jpg",
        tutorialUrl: "https://www.youtube.com/embed/ieTHC78giGQ",
        date: "2024-11-22",
        popularity: 83
    },
    {
        id: "38",
        category: "Webinar",
        title: "Node.js & Express: Building Scalable APIs",
        description: "Live API development session with Q&A and real-time coding.",
        thumbnail: "https://qualitapps.com/wp-content/uploads/2023/02/102.png",
        tutorialUrl: "https://www.youtube.com/embed/Oe421EPjeBE",
        date: "2024-11-20",
        popularity: 89
    }
];



const SearchFilter = () => {
    const [articles, setArticles] = useState(articlesData);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("trending");
    const [page, setPage] = useState(1);
    const [activeVideo, setActiveVideo] = useState(null);
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
    const [comments, setComments] = useState({});
    const [ratings, setRatings] = useState({});

    const categories = ["All", ...new Set(articlesData.map(item => item.category))];

    useEffect(() => {
        let filtered = articlesData;

        if (search) {
            filtered = filtered.filter((article) =>
                article.title.toLowerCase().includes(search.toLowerCase()) ||
                article.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category !== "All") {
            filtered = filtered.filter((article) => article.category === category);
        }

        if (sort === "trending") {
            filtered = [...filtered].sort((a, b) => {
                const dateComparison = new Date(b.date) - new Date(a.date);
                if (dateComparison !== 0) return dateComparison;
                return b.popularity - a.popularity;
            });
        } else if (sort === "viewed") {
            filtered = [...filtered].sort((a, b) => b.popularity - a.popularity);
        }

        setArticles(filtered);
        setPage(1);
    }, [search, category, sort]);

    const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
    const paginatedArticles = articles.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const getImageSrc = (article) => {
        return article.img || article.thumbnail || "";
    };

    const handlePlayVideo = (article) => {
        if (article.videoUrl || article.tutorialUrl) {
            setActiveVideo(article);
        }
    };

    const handleCloseVideo = () => {
        setActiveVideo(null);
    };

    const getVideoEmbedUrl = (url) => {
        if (!url) return null;

        if (url.includes('youtube.com/watch?v=')) {
            return url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
        }

        if (url.includes('youtu.be/')) {
            return url.replace('youtu.be/', 'youtube.com/embed/');
        }

        return url;
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleBookmark = (articleId) => {
        if (bookmarkedArticles.includes(articleId)) {
            setBookmarkedArticles(bookmarkedArticles.filter((id) => id !== articleId));
        } else {
            setBookmarkedArticles([...bookmarkedArticles, articleId]);
        }
    };

    const handleAddComment = (articleId, comment) => {
        setComments((prevComments) => ({
            ...prevComments,
            [articleId]: [...(prevComments[articleId] || []), comment],
        }));
    };

    const handleRateArticle = (articleId, rating) => {
        setRatings((prevRatings) => ({
            ...prevRatings,
            [articleId]: rating,
        }));
    };

    const handleShareArticle = (article) => {
        const shareUrl = window.location.href;
        const shareText = `Check out this article: ${article.title} - ${article.description}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const LiveSessionsCalendar = () => {
        const [events, setEvents] = useState([
            {
                title: 'Webinar: Mastering React in 2025',
                start: new Date(2025, 1, 15, 14, 0),
                end: new Date(2025, 1, 15, 15, 30),
            },
            {
                title: 'Live Q&A: The Future of JavaScript',
                start: new Date(2025, 1, 20, 10, 0),
                end: new Date(2025, 1, 20, 11, 0),
            },
        ]);

        return (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>
                    Upcoming Live Sessions
                </Typography>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />
            </div>
        );
    };

    return (
        <div style={{
            padding: "30px",
            maxWidth: "1200px",
            margin: "auto",
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}>
            <Typography variant="h4" component="h1" style={{ marginBottom: "24px", color: "#333", fontWeight: "700" }}>
                Content Library
            </Typography>

            {/* Search and Filters */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                marginBottom: "30px",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
            }}>
                {/* Search Input */}
                <div style={{
                    flex: "1 1 300px",
                    position: "relative",
                    minWidth: "300px"
                }}>
                    <input
                        type="text"
                        placeholder="Search content..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 20px 12px 50px",
                            fontSize: "16px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            outline: "none"
                        }}
                    />
                    <SearchIcon style={{
                        position: "absolute",
                        left: "15px",
                        top: "12px",
                        color: "#666"
                    }} />
                </div>

                {/* Category Selector */}
                <div style={{
                    position: "relative",
                    minWidth: "180px"
                }}>
                    <CategoryIcon style={{
                        position: "absolute",
                        left: "15px",
                        top: "12px",
                        color: "#666",
                        zIndex: 1
                    }} />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{
                            appearance: "none",
                            width: "100%",
                            padding: "12px 20px 12px 50px",
                            fontSize: "16px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Sort Selector */}
                <div style={{
                    position: "relative",
                    minWidth: "180px"
                }}>
                    <SortIcon style={{
                        position: "absolute",
                        left: "15px",
                        top: "12px",
                        color: "#666",
                        zIndex: 1
                    }} />
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        style={{
                            appearance: "none",
                            width: "100%",
                            padding: "12px 20px 12px 50px",
                            fontSize: "16px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            cursor: "pointer"
                        }}
                    >
                        <option value="trending">Latest Trending</option>
                        <option value="viewed">Most Viewed</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <Typography variant="subtitle1" style={{ marginBottom: "20px", color: "#666" }}>
                {articles.length} items found
            </Typography>

            {/* Articles Grid */}
            {paginatedArticles.length > 0 ? (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "25px",
                    marginBottom: "30px"
                }}>
                    {paginatedArticles.map((article) => (
                        <Card key={article.id} style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            borderRadius: "12px",
                            overflow: "hidden",
                            transition: "transform 0.3s, box-shadow 0.3s",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            "&:hover": {
                                transform: "translateY(-5px)",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                            }
                        }}>
                            <div style={{
                                position: "relative",
                                paddingTop: "56.25%",
                                backgroundColor: "#eee"
                            }}>
                                {getImageSrc(article) && (
                                    <img
                                        src={getImageSrc(article)}
                                        alt={article.title}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover"
                                        }}
                                    />
                                )}

                                {(article.videoUrl || article.tutorialUrl) && (
                                    <button
                                        onClick={() => handlePlayVideo(article)}
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: "60px",
                                            height: "60px",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            zIndex: 2
                                        }}
                                    >
                                        <PlayCircleOutlineIcon style={{ fontSize: "40px" }} />
                                    </button>
                                )}

                                <div style={{
                                    position: "absolute",
                                    top: "15px",
                                    left: "15px",
                                    backgroundColor: "#3f51b5",
                                    color: "white",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    textTransform: "uppercase"
                                }}>
                                    {article.category}
                                </div>
                            </div>

                            <CardContent style={{
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                                padding: "20px"
                            }}>
                                <Typography variant="h6" component="h3" style={{
                                    fontWeight: "700",
                                    marginBottom: "10px",
                                    color: "#333",
                                    lineHeight: 1.3
                                }}>
                                    {article.title}
                                </Typography>

                                <Typography variant="body2" style={{
                                    color: "#666",
                                    marginBottom: "15px",
                                    flexGrow: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical"
                                }}>
                                    {article.description}
                                </Typography>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    borderTop: "1px solid #eee",
                                    paddingTop: "15px",
                                    fontSize: "14px",
                                    color: "#888"
                                }}>
                                    <div>
                                        {formatDate(article.date)}
                                    </div>
                                    <div>
                                        {`article.popularity && ${article.popularity * 100} views`}
                                    </div>
                                </div>

                                {/* Interactive Features */}
                                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                    <IconButton onClick={() => handleBookmark(article.id)}>
                                        <BookmarkIcon style={{ color: bookmarkedArticles.includes(article.id) ? "#3f51b5" : "#666" }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleShareArticle(article)}>
                                        <ShareIcon style={{ color: "#666" }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleRateArticle(article.id, 5)}>
                                        <StarIcon style={{ color: ratings[article.id] ? "#ffc107" : "#666" }} />
                                    </IconButton>
                                    <IconButton onClick={() => handleAddComment(article.id, "New comment")}>
                                        <CommentIcon style={{ color: "#666" }} />
                                    </IconButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div style={{
                    padding: "40px",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                }}>
                    <Typography variant="h6" style={{ color: "#666" }}>
                        No content found matching your criteria.
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setSearch("");
                            setCategory("All");
                            setSort("trending");
                        }}
                        style={{ marginTop: "15px" }}
                    >
                        Clear filters
                    </Button>
                </div>
            )}

            {/* Custom Pagination */}
            {totalPages > 0 && (
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "30px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    padding: "15px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                }}>
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 16px",
                            backgroundColor: page === 1 ? "#f1f1f1" : "#3f51b5",
                            color: page === 1 ? "#999" : "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: page === 1 ? "default" : "pointer"
                        }}
                    >
                        <ArrowBackIosIcon style={{ fontSize: "14px", marginRight: "5px" }} />
                        Previous
                    </button>

                    <Typography variant="body1">
                        Page {page} of {totalPages}
                    </Typography>

                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 16px",
                            backgroundColor: page === totalPages ? "#f1f1f1" : "#3f51b5",
                            color: page === totalPages ? "#999" : "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: page === totalPages ? "default" : "pointer"
                        }}
                    >
                        Next
                        <ArrowForwardIosIcon style={{ fontSize: "14px", marginLeft: "5px" }} />
                    </button>
                </div>
            )}

            {/* Video Modal */}
            {activeVideo && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    zIndex: 1000,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px"
                }}>
                    <div style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "900px",
                        backgroundColor: "#000",
                        borderRadius: "8px",
                        overflow: "hidden"
                    }}>
                        <button
                            onClick={handleCloseVideo}
                            style={{
                                position: "absolute",
                                top: "15px",
                                right: "15px",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                fontSize: "18px",
                                cursor: "pointer",
                                zIndex: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <CloseIcon style={{ fontSize: "20px" }} />
                        </button>

                        <div style={{ paddingTop: "56.25%", position: "relative" }}>
                            <iframe
                                src={getVideoEmbedUrl(activeVideo.videoUrl || activeVideo.tutorialUrl)}
                                title={activeVideo.title}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    border: "none"
                                }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div style={{
                            padding: "20px",
                            backgroundColor: "#111",
                            color: "white"
                        }}>
                            <Typography variant="h6" style={{ marginBottom: "10px" }}>
                                {activeVideo.title}
                            </Typography>
                            <Typography variant="body2" style={{ color: "#ccc" }}>
                                {activeVideo.description}
                            </Typography>
                        </div>
                    </div>
                </div>
            )}

            <LiveSessionsCalendar />
        </div>
    );
};

export default SearchFilter; 