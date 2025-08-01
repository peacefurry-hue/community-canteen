import React from 'react';
import { Plus } from 'lucide-react';
import { Food } from '../types';
import { useStore } from '../store/useStore';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { toast } from 'sonner';

interface FoodCardProps {
  food: Food;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const addToCart = useStore(state => state.addToCart);

  const handleAddToCart = () => {
    addToCart(food);
    toast.success(`${food.name} 已添加到饭盒！`);
  };

  return (
    <Card className="h-full">
      <div className="relative">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
        {food.isPopular && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            🔥 热门
          </div>
        )}
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-sm font-bold px-2 py-1 rounded-lg">
          ¥{food.price}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{food.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{food.description}</p>
        {food.nutrition && (
          <p className="text-green-600 text-xs mb-3">💚 {food.nutrition}</p>
        )}
        
        <Button
          onClick={handleAddToCart}
          className="w-full"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          加入饭盒
        </Button>
      </CardContent>
    </Card>
  );
};