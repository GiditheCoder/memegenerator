import React from "react";
import { useState } from "react";

export default function Meme() {
    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: "http://i.imgflip.com/1bij.jpg" 
    });
    const [allMemes, setAllMemes] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState(""); // New state for search query
    const [filteredMemes, setFilteredMemes] = React.useState([]); // State for search results

    // Fetch memes from API
    React.useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => {
                setAllMemes(data.data.memes);
                setFilteredMemes(data.data.memes); // Initialize filteredMemes with allMemes
            });
    }, []);

    // Handle text changes in search input
    function handleSearchChange(event) {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter memes based on search query
        const filtered = allMemes.filter(meme => 
            meme.name.toLowerCase().includes(query)
        );
        setFilteredMemes(filtered);
    }

    // Generate a random meme image
    function getMemeImage() {
        if (filteredMemes.length === 0) return; // Handle case where no memes match the search query
        const randomNumber = Math.floor(Math.random() * filteredMemes.length);
        const url = filteredMemes[randomNumber].url;
        setMeme(prevMeme => ({
            ...prevMeme,
            randomImage: url
        }));
    }

    // Handle text changes for top/bottom input fields
    function handleChange(event) {
        const { name, value } = event.target;
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }));
    }

    return (
        <main>
            {/* Search Input */}
            <div className="search">
                <input 
                    type="text"
                    placeholder="Search memes"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search--input"
                />
            </div>

            <div className="form">
                <input 
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                />
                <button 
                    className="form--button"
                    onClick={getMemeImage}
                    disabled={filteredMemes.length === 0} // Disable button if no memes match
                >
                    Get a new meme image 🖼
                </button>
            </div>

            <div className="meme">
                <img src={meme.randomImage} className="meme--image" alt="Meme" />
                <h2 className="meme--text top">{meme.topText}</h2>
                <h2 className="meme--text bottom">{meme.bottomText}</h2>
            </div>

            {/* Display filtered meme names */}
            <ul className="meme-list">
                {filteredMemes.map(meme => (
                    <li key={meme.id}>{meme.name}</li>
                ))}
            </ul>
        </main>
    );
}
