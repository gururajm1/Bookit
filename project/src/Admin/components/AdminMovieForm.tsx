import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';

interface MovieFormData {
  title: string;
  image: string;
  languages: string[];
  certification: string;
  genres: string[];
  isNewRelease: boolean;
  releaseDate: string;
  description: string;
  duration: number;
  director: string;
  cast: string[];
  rating: number;
  price: number;
}

const AdminMovieForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    image: '',
    languages: [],
    certification: '',
    genres: [],
    isNewRelease: false,
    releaseDate: '',
    description: '',
    duration: 0,
    director: '',
    cast: [],
    rating: 0,
    price: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (isEditing) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await fetch(`http://localhost:5001/bookit/admin/movies/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch movie');
      const data = await response.json();
      setFormData(data);
      setImagePreview(data.image);
    } catch (error) {
      console.error('Error fetching movie:', error);
      setError('Failed to fetch movie details');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      languages: checked
        ? [...prev.languages, value]
        : prev.languages.filter(lang => lang !== value)
    }));
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      genres: checked
        ? [...prev.genres, value]
        : prev.genres.filter(genre => genre !== value)
    }));
  };

  const handleCastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      cast: value.split(',').map(actor => actor.trim())
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = isEditing 
        ? `http://localhost:5001/bookit/admin/movies/${id}`
        : 'http://localhost:5001/bookit/admin/movies';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save movie');
      
      navigate('/admin/movies');
    } catch (error) {
      console.error('Error saving movie:', error);
      setError('Failed to save movie');
    } finally {
      setLoading(false);
    }
  };

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'];
  const genres = ['Action', 'Comedy', 'Drama', 'Romance', 'Thriller', 'Horror', 'Sci-Fi', 'Animation', 'Documentary'];
  const certifications = ['U', 'UA', 'A'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/movies')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Movie' : 'Add New Movie'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Director
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Movie Image */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Movie Image</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-48 h-48">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Movie preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-red-50 file:text-red-700
                    hover:file:bg-red-100"
                />
              </div>
            </div>
          </div>

          {/* Languages and Certification */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Languages & Certification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {languages.map((lang) => (
                    <label key={lang} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={lang}
                        checked={formData.languages.includes(lang)}
                        onChange={handleLanguageChange}
                        className="rounded text-red-500 focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification
                </label>
                <select
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Certification</option>
                  {certifications.map((cert) => (
                    <option key={cert} value={cert}>
                      {cert}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Genres */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Genres</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {genres.map((genre) => (
                <label key={genre} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.genres.includes(genre)}
                    onChange={handleGenreChange}
                    className="rounded text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cast */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Cast</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cast Members (comma-separated)
              </label>
              <input
                type="text"
                value={formData.cast.join(', ')}
                onChange={handleCastChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isNewRelease"
                  checked={formData.isNewRelease}
                  onChange={(e) => setFormData(prev => ({ ...prev, isNewRelease: e.target.checked }))}
                  className="rounded text-red-500 focus:ring-red-500"
                />
                <label htmlFor="isNewRelease" className="text-sm font-medium text-gray-700">
                  New Release
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isEditing ? 'Update Movie' : 'Add Movie'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminMovieForm;