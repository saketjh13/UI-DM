export default function CategoryTabs({ categories, selected, onSelect }) {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition
              ${
                selected === category
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
              }`}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        ))}
      </div>
    );
  }
  