import { User, ShopOwnerProfile, UserProfile, AdminProfile } from '../types';

export const isShopOwnerProfile = (profile: any): profile is ShopOwnerProfile => {
  return profile && 'shop_name' in profile;
};

export const isUserProfile = (profile: any): profile is UserProfile => {
  return profile && 'address' in profile && !('shop_name' in profile);
};

export const isAdminProfile = (profile: any): profile is AdminProfile => {
  return profile && 'admin_level' in profile;
};

export const getShopName = (user: User): string => {
  if (isShopOwnerProfile(user.profile)) {
    return user.profile.shop_name;
  }
  return `${user.first_name} ${user.last_name}`;
};
