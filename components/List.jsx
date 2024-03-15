export default function List({title, children}) {
    return (
        <div>
        <h2 className="font-bold text-2xl">{title}</h2>
            <div className="flex space-x-8">
                {children}
            </div>
        </div>
    );
}