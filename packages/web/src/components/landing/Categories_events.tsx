'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  FaMusic,
  FaGlassMartiniAlt,
  FaTheaterMasks,
  FaCalendarAlt,
  FaHeart,
  FaUtensils,
  FaBriefcase,
  FaMonument,
  FaList,
  FaBinoculars,
} from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SubtleDivider } from '../ui/wave-divider';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  slug?: string;
}

interface CategoriesProps {
  initialCategories?: Category[];
  selectedCategoryId?: string;
  onCategoryChange?: (categoryId: string) => void;
}

const defaultCategories: Category[] = [
  { id: 'all', name: 'All', icon: <FaList size={24} />, slug: 'all' },
  {
    id: 'concerts',
    name: 'Concerts',
    icon: <FaMusic size={24} />,
    slug: 'concerts',
  },
  {
    id: 'nightlife',
    name: 'Nightlife',
    icon: <FaGlassMartiniAlt size={24} />,
    slug: 'nightlife',
  },
  {
    id: 'arts-theater',
    name: 'Arts & Theater',
    icon: <FaTheaterMasks size={24} />,
    slug: 'arts-theater',
  },
  {
    id: 'festivals',
    name: 'Festivals',
    icon: <FaCalendarAlt size={24} />,
    slug: 'festivals',
  },
  { id: 'dating', name: 'Dating', icon: <FaHeart size={24} />, slug: 'dating' },
  {
    id: 'food-drink',
    name: 'Food & Drink',
    icon: <FaUtensils size={24} />,
    slug: 'food-drink',
  },
  {
    id: 'business',
    name: 'Business',
    icon: <FaBriefcase size={24} />,
    slug: 'business',
  },
  {
    id: 'cultural',
    name: 'Cultural',
    icon: <FaMonument size={24} />,
    slug: 'cultural',
  },
];

const Categories_events = ({
  initialCategories = defaultCategories,
  selectedCategoryId = 'all',
  onCategoryChange,
}: CategoriesProps) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] =
    useState<string>(selectedCategoryId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (initialCategories.length === 0) {
      const fetchCategories = async () => {
        try {
          const response = await fetch('/api/categories');
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          console.error('Failed to fetch categories:', error);
          setCategories(defaultCategories);
        }
      };
      fetchCategories();
    }
  }, [initialCategories]);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth < 768 ? 4 : 5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setSelectedCategory(selectedCategoryId);
  }, [selectedCategoryId]);

  const totalPages = Math.ceil(categories.length / visibleCount);
  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < totalPages - 1;

  const visibleCategories = categories.slice(
    currentIndex * visibleCount,
    (currentIndex + 1) * visibleCount
  );

  const displayCategories = [
    ...visibleCategories,
    ...Array(Math.max(0, visibleCount - visibleCategories.length)).fill(null),
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 dark:text-gray-400">
        Loading categories...
      </div>
    );
  }

  return (
    <>
      <section className="relative bg-white dark:bg-gray-900 py-8 md:py-8 mb-12 border-b border-gray-100 dark:border-gray-800">
        {/* Elegant Animated Background */}
        <SubtleDivider />
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-50/30 via-transparent to-pink-50/30 dark:from-purple-900/20 dark:via-gray-900/90 dark:to-pink-900/20"></div>

          {/* Subtle Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-300/30 dark:bg-purple-600/20"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: [null, Math.random() * 100 - 50],
                y: [null, Math.random() * 100 - 50],
                opacity: [0, 0.4, 0],
                scale: [0, Math.random() * 0.5 + 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Frosted Glass Overlay */}
        <div className="absolute inset-0 -z-10 backdrop-blur-[1px] bg-white/30 dark:bg-gray-900/50"></div>
        {/* Navigation Arrows - Modern Floating Style */}

        <div className="max-w-7xl mx-auto px-4 relative z-10 py-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block mb-6"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 text-sm font-medium">
                <FaBinoculars className="h-4 w-4 mr-2 text-purple-500 uppercase" />
                Explore with Style
              </span>
            </motion.div>
          </motion.div>
          {/* Categories Grid */}
          <div className="flex justify-center">
            <div
              ref={containerRef}
              className="grid grid-cols-4 md:grid-cols-5 gap-4 md:gap-6 w-full max-w-5xl"
            >
              {displayCategories.map((category, index) => (
                <motion.div
                  key={category?.id || `empty-${index}`}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {category ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center w-full group"
                      onClick={() => handleCategorySelect(category.id)}
                      aria-label={`Select ${category.name} category`}
                    >
                      <div className="relative p-1 md:p-2 mb-2 md:mb-4">
                        <div
                          className={`absolute inset-0 rounded-full border-[3px] ${
                            selectedCategory === category.id
                              ? 'border-purple-500 dark:border-purple-400 opacity-100'
                              : 'border-purple-200 dark:border-purple-900 opacity-0 group-hover:opacity-100'
                          } transition-opacity duration-300`}
                        />
                        <div
                          className={`p-3 md:p-5 rounded-full ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/50 dark:to-pink-800/50'
                              : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30'
                          } transition-all duration-300`}
                        >
                          <div
                            className={`${
                              selectedCategory === category.id
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                            } text-xl md:text-2xl`}
                          >
                            {category.icon}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-sm md:text-base font-semibold ${
                          selectedCategory === category.id
                            ? 'text-gray-900 dark:text-gray-100'
                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                        } text-center`}
                      >
                        {category.name}
                      </span>
                    </motion.button>
                  ) : (
                    <div className="p-3 md:p-5 opacity-0">
                      <div className="w-10 h-10 md:w-16 md:h-16"></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows - Moved below the grid */}
          <div className="flex items-center justify-center mt-4 md:mt-6 space-x-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={!canScrollPrev}
              className="p-2 rounded-full   disabled:opacity-30 transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl   border border-gray-200 dark:border-gray-700"
              aria-label="Previous categories"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-3 mt-8">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    whileHover={{ scale: 1.2 }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 w-5'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              disabled={!canScrollNext}
              className="p-2 rounded-full   disabled:opacity-30 transition-all bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl   border border-gray-200 dark:border-gray-700"
              aria-label="Next categories"
            >
              <FiChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
        <SubtleDivider />
      </section>
    </>
  );
};

export default Categories_events;
