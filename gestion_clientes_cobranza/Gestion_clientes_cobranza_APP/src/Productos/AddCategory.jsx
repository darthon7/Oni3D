import React, { useState } from 'react';

// Componente para el formulario de agregar categoría
export default function AddCategory({ onAdd }) {
    const [newCategory, setNewCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            onAdd(newCategory);
            setNewCategory(''); // Limpiar el input después de agregar
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="new-category" className="text-sm font-medium text-gray-600 mb-2 block">
                Nueva Categoría
            </label>
            <div className="flex items-center gap-2">
                <input
                    id="new-category"
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nombre..."
                    className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-md hover:bg-indigo-600 transition-colors disabled:bg-gray-300"
                    disabled={!newCategory.trim()}
                >
                    Añadir
                </button>
            </div>
        </form>
    );
}