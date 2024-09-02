import React from 'react';

interface ArtistInfoProps {
    data: {
        name: string;
        genre: string;
        location: string;
        imageUrl: string;
    };
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ data }) => {
    return (
        <div className="artist-info">
            <img
                src={data.imageUrl}
                alt={data.name}
                className="artist-image"
                loading="lazy"
            />
            <div className="artist-details">
                <h2>{data.name}</h2>
                <p>{data.genre}</p>
                <p>{data.location}</p>
            </div>
        </div>
    );
};

export default ArtistInfo;
