import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'USD' | 'INR';

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  convertPrice: (usdPrice: number) => { amount: number; symbol: string; formatted: string };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currency, setCurrency] = useState<Currency>('INR');

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'INR' : 'USD');
  };

  const convertPrice = (usdPrice: number) => {
    if (currency === 'USD') {
      return {
        amount: usdPrice,
        symbol: '$',
        formatted: `$${usdPrice.toLocaleString('en-US')}`
      };
    } else {
      const inrAmount = Math.round(usdPrice * 85); // 1 USD = 85 INR
      return {
        amount: inrAmount,
        symbol: '₹',
        formatted: `₹${inrAmount.toLocaleString('en-IN')}`
      };
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};
