import React from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  title = '社区小饭桌', 
  showBack = false, 
  showCart = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalItems = useStore(state => state.getTotalItems());

  const handleBack = () => {
    navigate(-1);
  };

  const handleCartClick = () => {
    if (location.pathname !== '/cart') {
      navigate('/cart');
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：返回按钮或Logo */}
          <div className="flex items-center">
            {showBack ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mr-2 p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            ) : (
              <div className="flex items-center">
                <span className="text-2xl mr-2">🍱</span>
              </div>
            )}
            
            <h1 className="text-lg font-bold text-gray-800 truncate">
              {title}
            </h1>
          </div>

          {/* 右侧：购物车图标 */}
          {showCart && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCartClick}
              className="relative p-2"
            >
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};