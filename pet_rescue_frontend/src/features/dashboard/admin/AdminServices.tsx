import React from 'react';
import ShopServices from '../shop/ShopServices';

// For this platform, since Shop Owners and Admins share the same service logic typically, 
// and the backend `IsAdminOrShopOwner` allows both, we can reuse the ShopServices component.
function AdminServices() {
  return (
    <div>
      <div className="mb-4">
         <span className="badge badge-blue mb-2">Admin Mode</span>
         <p className="text-stone-500 text-sm">Managing all global pet services.</p>
      </div>
      <ShopServices allServices={true} />
    </div>
  );
}

export default AdminServices;
