export type ListingTemplate = 'VEHICLE' | 'PROPERTY' | 'PRODUCT' | 'SERVICE_JOB';

export interface SubCategory {
  id: string;
  name: string;
  template: ListingTemplate;
}

export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'motor',
    name: 'Motor',
    subCategories: [
      { id: 'carros', name: 'Carros y Camionetas', template: 'VEHICLE' },
      { id: 'motos', name: 'Motos', template: 'VEHICLE' },
      { id: 'bicis', name: 'Bicicletas', template: 'VEHICLE' }
    ]
  },
  {
    id: 'inmobiliaria',
    name: 'Inmobiliaria',
    subCategories: [
      { id: 'apartamentos', name: 'Apartamentos', template: 'PROPERTY' },
      { id: 'casas', name: 'Casas', template: 'PROPERTY' },
      { id: 'fincas', name: 'Fincas', template: 'PROPERTY' }
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    subCategories: [
      { id: 'celulares', name: 'Celulares', template: 'PRODUCT' },
      { id: 'computadores', name: 'Computadores', template: 'PRODUCT' }
    ]
  }
];