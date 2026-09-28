export type Category = {
  id: string;
  name: string;
};

export type Place = {
  id: string;
  name: string;
  category_id: string;
  description: string;
  building: string | null;
  floor: string | null;
  hours: string | null;
  latitude: number;
  longitude: number;
  photo_url: string | null;
  is_essential: boolean;
  tour_order: number | null;
};
