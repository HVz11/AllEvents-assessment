import React, { useState } from 'react';

interface ArtistInfoProps {
    data: {
        name: string;
        genre: string;
        location: string;
        imageUrl: string;
    };
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ data }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <div className="artist-info">
            {!imageLoaded && <div className="loader">Loading artist image...</div>}
            <img
                src={data.imageUrl}
                alt={data.name}
                className={`artist-image ${imageLoaded ? 'loaded' : 'loading'}`}
                onLoad={handleImageLoad}
            />
            {imageLoaded && (
                <div className="artist-details">
                    <h2>{data.name}</h2>
                    <p>{data.genre}</p>
                    <p>{data.location}</p>
                </div>
            )}
        </div>
    );
};

export default ArtistInfo;