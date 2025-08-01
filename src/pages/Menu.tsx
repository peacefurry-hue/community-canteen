import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FoodCategory } from '../types';
import { Navbar } from '../components/Navbar';
import { FoodCard } from '../components/FoodCard';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';

const Menu: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [highlightedFood, setHighlightedFood] = useState<string | null>(null);
  
  const { foods, categories, isLoading, error, loadFoods, loadCategories } = useStore();

  const defaultCategories = [
    { id: 'all' as const, name: '全部', emoji: '🍽️' },
    { id: FoodCategory.MAIN, name: '主菜', emoji: '🍖' },
    { id: FoodCategory.DESSERT, name: '甜点', emoji: '🍰' },
    { id: FoodCategory.FRUIT, name: '水果', emoji: '🍎' },
    { id: FoodCategory.DRINK, name: '饮品', emoji: '🥤' }
  ];

  // 初始化数据加载
  useEffect(() => {
    loadFoods();
    loadCategories();
  }, [loadFoods, loadCategories]);

  // 处理URL参数
  useEffect(() => {
    const category = searchParams.get('category') as FoodCategory;
    const highlight = searchParams.get('highlight');
    
    if (category && Object.values(FoodCategory).includes(category)) {
      setSelectedCategory(category);
    }
    
    if (highlight) {
      setHighlightedFood(highlight);
      // 3秒后取消高亮
      setTimeout(() => setHighlightedFood(null), 3000);
    }
  }, [searchParams]);

  // 获取当前分类的菜品
  const getCurrentFoods = () => {
    if (selectedCategory === 'all') {
      return foods;
    }
    return foods.filter(food => food.category === selectedCategory);
  };

  const currentFoods = getCurrentFoods();
  const displayCategories = categories.length > 0 ? 
    [{ id: 'all' as const, name: '全部', emoji: '🍽️' }, ...categories.map(cat => ({
      id: cat.key as FoodCategory,
      name: cat.name,
      emoji: cat.icon
    }))] : 
    defaultCategories;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <Navbar title="选择菜品" showBack={true} />
        
        {/* 分类筛选 */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
          <div className="p-4">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {displayCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'flex-shrink-0 whitespace-nowrap',
                    selectedCategory === category.id && 'shadow-md'
                  )}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 菜品展示 */}
        <div className="p-4">
          {error && (
            <div className="text-center py-8">
              <div className="text-red-500 text-sm mb-2">⚠️ {error}</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadFoods()}
              >
                重新加载
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-gray-500">正在加载菜品...</p>
            </div>
          ) : currentFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentFoods.map((food) => (
                <div
                  key={food.id}
                  className={cn(
                    'transition-all duration-500',
                    highlightedFood === food.id && 'ring-4 ring-orange-300 ring-opacity-75 scale-105'
                  )}
                >
                  <FoodCard food={food} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                暂无{selectedCategory !== 'all' ? displayCategories.find(c => c.id === selectedCategory)?.name : ''}菜品
              </h3>
              <p className="text-gray-500 text-sm">
                请选择其他分类或稍后再来看看
              </p>
            </div>
          )}
        </div>

        {/* 底部间距 */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default Menu;