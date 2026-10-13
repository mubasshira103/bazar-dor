export type Product = {
  id: string | number;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  emoji: string;
  unit: string;
  price: number;
  change: number;
  description: string;
  minPrice: number;
  maxPrice: number;
  averagePrice: number;
  markets: {
    name: string;
    district: string;
    min: number;
    max: number;
    price: number;
  }[];
};

export type Category = {
  slug: string;
  name: string;
  emoji: string;
};
