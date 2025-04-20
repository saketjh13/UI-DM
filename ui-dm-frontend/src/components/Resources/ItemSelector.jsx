export default function ItemSelector({ items = [], selected, onSelect }) {
    if (!items.length) return null;
  
    return (
      <div className="overflow-x-auto py-2">
        <div className="flex gap-3 min-w-fit">
          {items.map((item) => (
            <button
              key={item}
              className={`px-4 py-1 rounded-full border text-sm whitespace-nowrap transition
                ${
                  selected === item
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-green-100'
                }`}
              onClick={() => onSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  }
  