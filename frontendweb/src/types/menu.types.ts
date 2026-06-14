// Menu Types

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  categories: MenuCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  menuId: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl?: string;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  isAvailable: boolean;
  isFeatured: boolean;
  preparationTime?: number;
  calories?: number;
  spiceLevel?: SpiceLevel;
  tags: string[];
  allergens: string[];
  nutritionInfo?: NutritionInfo;
  modifierGroups: ModifierGroup[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export enum SpiceLevel {
  NONE = 'NONE',
  MILD = 'MILD',
  MEDIUM = 'MEDIUM',
  HOT = 'HOT',
  EXTRA_HOT = 'EXTRA_HOT',
}

export interface ModifierGroup {
  id: string;
  menuItemId: string;
  name: string;
  description?: string;
  type: ModifierGroupType;
  minSelections: number;
  maxSelections: number;
  isRequired: boolean;
  displayOrder: number;
  options: ModifierOption[];
  createdAt: string;
  updatedAt: string;
}

export enum ModifierGroupType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

export interface ModifierOption {
  id: string;
  modifierGroupId: string;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  imageUrl?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateMenuRequest {
  name: string;
  description?: string;
  restaurantId: string;
}

export interface UpdateMenuRequest extends Partial<CreateMenuRequest> {
  isActive?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  displayOrder?: number;
  imageUrl?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  isActive?: boolean;
}

export interface CreateMenuItemRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  discountedPrice?: number;
  currency?: string;
  preparationTime?: number;
  calories?: number;
  spiceLevel?: SpiceLevel;
  tags?: string[];
  allergens?: string[];
  nutritionInfo?: NutritionInfo;
  displayOrder?: number;
}

export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export interface CreateModifierGroupRequest {
  name: string;
  description?: string;
  type: ModifierGroupType;
  minSelections?: number;
  maxSelections?: number;
  isRequired?: boolean;
  displayOrder?: number;
}

export interface UpdateModifierGroupRequest extends Partial<CreateModifierGroupRequest> {}

export interface CreateModifierOptionRequest {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  displayOrder?: number;
}

export interface UpdateModifierOptionRequest extends Partial<CreateModifierOptionRequest> {
  isAvailable?: boolean;
}

// Menu item with selected modifiers for cart
export interface SelectedModifier {
  modifierGroupId: string;
  modifierOptionId: string;
  name: string;
  optionName: string;
  price: number;
}

export interface MenuItemWithModifiers extends MenuItem {
  selectedModifiers?: SelectedModifier[];
  quantity?: number;
  subtotal?: number;
}
