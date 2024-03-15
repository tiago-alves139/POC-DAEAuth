export default function ButtonGeneric({ title }) {
    return (
        <button className="rounded bg-green-600 font-bold text-white py-3 px-6 w-fit hover:bg-blue-700 transition-colors duration-200">
            {title}
        </button>
    );
}