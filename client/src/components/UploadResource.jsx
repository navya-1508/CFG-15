import React, { useState } from "react";

export default function UploadResource() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Resource uploaded:", formData);
  };

  return (
    <div className="min-h-screen bg-white text-blue-900 px-6 py-10">
      <h2 className="text-2xl font-bold text-center mb-8">Upload Resource</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-blue-50 p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label className="block mb-1">Resource Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Resource File</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Upload Resource
        </button>
      </form>
    </div>
  );
}
