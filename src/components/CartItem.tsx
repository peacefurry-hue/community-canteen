import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useStore();
  const { food, quantity } = item;

  const handleIncrease = () => {
    updateQuantity(food.id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(food.id, quantity - 1);
    } else {
      removeFromCart(food.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(food.id);
  };

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* 菜品图片 */}
          <img
            src={food.image}
            alt={food.name}
            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
          />
          
          {/* 菜品信息 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">{food.name}</h3>
            <p className="text-sm text-gray-600 truncate">{food.description}</p>
            <p className="text-orange-600 font-bold">¥{food.price}</p>
          </div>
          
          {/* 数量控制 */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrease}
              className="w-8 h-8 p-0 rounded-full"
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <span className="w-8 text-center font-semibold">{quantity}</span>
            
            <Button
              variant="primary"
              size="sm"
              onClick={handleIncrease}
              className="w-8 h-8 p-0 rounded-full"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="w-8 h-8 p-0 rounded-full text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* 小计 */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-600">小计</span>
          <span className="font-bold text-lg text-orange-600">
            ¥{(food.price * quantity).toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};