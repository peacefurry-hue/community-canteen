import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Navbar } from '../components/Navbar';
import { CartItem } from '../components/CartItem';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, getTotalItems } = useStore();
  
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/order');
    }
  };

  const handleContinueShopping = () => {
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <Navbar title="我的饭盒" showBack={true} showCart={false} />
        
        <div className="p-4">
          {cartItems.length > 0 ? (
            <>
              {/* 饭盒统计 */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold text-gray-800">
                        饭盒内容 ({totalItems} 样菜品)
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleContinueShopping}
                    >
                      继续选餐
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 菜品列表 */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <CartItem key={item.food.id} item={item} />
                ))}
              </div>

              {/* 价格汇总 */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">菜品小计</span>
                      <span className="text-gray-800">¥{totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">配送费</span>
                      <span className="text-green-600">免费</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">总计</span>
                        <span className="text-2xl font-bold text-orange-600">
                          ¥{totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 结算按钮 */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="max-w-md mx-auto">
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                  >
                    去结算 ({totalItems} 样菜品)
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* 空购物车状态 */
            <div className="text-center py-12">
              <div className="text-8xl mb-6">🥡</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-3">
                饭盒还是空的
              </h3>
              <p className="text-gray-500 mb-6">
                快去选择你喜欢的菜品吧！
              </p>
              <Button
                onClick={handleContinueShopping}
                size="lg"
              >
                开始选餐 🍽️
              </Button>
            </div>
          )}
        </div>

        {/* 底部间距（当有内容时） */}
        {cartItems.length > 0 && <div className="h-20"></div>}
      </div>
    </div>
  );
};

export default Cart;