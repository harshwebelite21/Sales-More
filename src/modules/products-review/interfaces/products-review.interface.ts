export interface ProductReview {
  userName: string;
  productName: string;
  rating: number;
  reviewText: string;
}

export interface MatchStage {
  'productsData.name'?: RegExp;
  rating?: number;
}
