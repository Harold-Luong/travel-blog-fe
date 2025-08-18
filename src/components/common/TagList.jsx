export default function TagList({ tags, onClick, selectedTag }) {

    return (
        <div>
            {tags.map(tag => (
                <span
                    key={tag.id}
                    className={`inline-block px-2 py-1 rounded text-xs mx-1 cursor-pointer ${selectedTag === tag.id
                        ? "bg-vintageGreen text-white"
                        : "bg-vintageBrown text-white hover:bg-vintageGreen/80"}`}
                    onClick={() => onClick(tag)}>
                    {tag.name}
                </span>
            ))}
        </div>
    );
}
