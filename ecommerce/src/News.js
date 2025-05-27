import './News.css';

import React, { useEffect, useState, useRef } from 'react';


const News = () => {
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const newsRef = useRef([]); //Store references to news items

    

    useEffect(() => {
        fetch('http://localhost:5000/news', {
            method: 'GET', 
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }) //Call the backend API
            .then(response => response.json())
            .then(data => { 
                if (data.articles && Array.isArray(data.articles)){
                setNews(data.articles);
                newsRef.current = data.articles; //Store the fetched articles 
                } else {
                    setNews([]); //Ensure 'news' is always an array
                }
            })
            .catch(error => console.error('Error fetching news:', error));
            setNews([]); //Ensure state is always an array.
        }, []);


    useEffect(() => {
        if (news && news.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % news.length);
            }, 10000); //Change slide every 10 seconds
            return () => clearInterval(interval); //Cleanup on unmount
        }
    }, [news]);



    return (
        <>
        <div className='slideshow-container'>
            <h2>Latest Financial News</h2>

            {news.length > 0 ? (
                <div className="slide">
                    <a href={news[currentIndex].url} target="_blank" rel="noopener noreferrer">
                        <img
                            src={news[currentIndex].urlToImage}
                            alt={news[currentIndex].title}
                            className="slide-image"/>
                            <h3>{news[currentIndex].title}</h3>    
                    </a> 
                    <p>{news[currentIndex].description}</p>
                </div>
            ) : (
                <p>Loading news...</p>
            )}
        </div>
        
        </>
      );
}
 
export default News;