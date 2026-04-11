function BookCard({picture, name, author}) {

const imageURL = picture ? URL.createObjectURL(picture) : null;

return (
    <div className="card">
        {imageURL ? (
            <img src={imageURL} alt={name} />

        ) : (
            <div>Нет обложки</div>
        )}

        <h2 style={{color: 'gray',  fontSize: '24px'}}>{name}</h2>
        <p style={{color: 'white', fontSize: '16px'}}>{author}</p>
    </div>
    );
}

export default BookCard;