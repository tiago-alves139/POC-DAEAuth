export default function List({title, children}) {
    return (
        <div>
        <h2 className="font-bold text-2xl">{title}</h2>
            <div className="flex space-x-8">
                {children.length > 0 ? children : <p className="text-gray-500">No items in the list.</p>}
            </div>
        </div>
    );
}