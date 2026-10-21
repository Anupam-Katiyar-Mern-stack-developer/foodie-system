export const adminLoginFields = [
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "admin@foodie.com",
    required: true,
    componentProps: { autoComplete: "username" },
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    componentProps: { autoComplete: "current-password" },
  },
];

export const adminCategoryFields = (category) => [
  {
    name: "name",
    label: "Category name",
    placeholder: "e.g. North Indian",
    required: true,
  },
  {
    name: "displayOrder",
    label: "Display order",
    type: "number",
    componentProps: { min: 0, step: 1 },
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    fullWidth: true,
    placeholder: "Help customers discover this category",
  },
  {
    name: "image",
    label: "Category image",
    type: "file",
    fullWidth: true,
    required: !category,
    existingPreview: category?.image || "",
    helperText: "JPG, PNG or WebP. Use a clear food photograph.",
  },
];

export const adminProfileFields = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email address", type: "email", required: true },
  {
    name: "currentPassword",
    label: "Current password",
    type: "password",
    required: true,
    helperText: "Required to confirm account changes.",
    componentProps: { autoComplete: "current-password" },
  },
  {
    name: "newPassword",
    label: "New password (optional)",
    type: "password",
    helperText: "Leave empty to keep your current password.",
    componentProps: { autoComplete: "new-password" },
  },
];
export const siteSettingsGroups = {
  branding: [
    {name:'siteName',label:'Website name',required:true},{name:'tagline',label:'Brand tagline'},
    {name:'supportEmail',label:'Support email',type:'email'},{name:'supportPhone',label:'Support phone'},
    {name:'supportAddress',label:'Contact address',type:'textarea',fullWidth:true},
    {name:'footerText',label:'Footer description',type:'textarea',fullWidth:true},
    {name:'instagramUrl',label:'Instagram URL',type:'url'},{name:'facebookUrl',label:'Facebook URL',type:'url'},
    {name:'seoTitle',label:'Browser / SEO title'},{name:'seoDescription',label:'SEO description',type:'textarea',fullWidth:true},
  ],
  homepage:[
    {name:'heroEyebrow',label:'Hero eyebrow'},{name:'heroTitle',label:'Hero heading',required:true},
    {name:'heroHighlight',label:'Highlighted heading'},{name:'heroButtonText',label:'Primary button text',required:true},
    {name:'heroDescription',label:'Hero description',type:'textarea',fullWidth:true},
    {name:'announcement',label:'Announcement / promotional message',type:'textarea',fullWidth:true},
    {name:'announcementEnabled',label:'Show announcement bar',type:'switch'},
  ],
  ordering:[
    {name:'minimumOrder',label:'Minimum food subtotal (₹)',type:'number',componentProps:{min:0,step:0.01}},
    {name:'deliveryFee',label:'Delivery fee per restaurant (₹)',type:'number',componentProps:{min:0,step:0.01}},
    {name:'freeDeliveryAbove',label:'Free delivery above food subtotal (₹)',type:'number',helperText:'0 disables this offer.',componentProps:{min:0,step:0.01}},
    {name:'taxPercent',label:'Tax percentage on discounted food',type:'number',componentProps:{min:0,max:100,step:0.01}},
    {name:'codEnabled',label:'Enable cash on delivery',type:'switch'},{name:'onlineEnabled',label:'Enable Razorpay online payments',type:'switch'},
    {name:'couponsEnabled',label:'Enable coupon codes',type:'switch'},{name:'orderEmailsEnabled',label:'Send order confirmation emails',type:'switch'},
    {name:'maintenanceMode',label:'Pause new orders',type:'switch'},
    {name:'maintenanceMessage',label:'Message while ordering is paused',type:'textarea',fullWidth:true},
  ],
};

export const couponFields=[
  {name:'code',label:'Coupon code',required:true},{name:'title',label:'Offer title',required:true},
  {name:'description',label:'Offer description',type:'textarea',fullWidth:true},
  {name:'discountType',label:'Discount type',type:'select',options:[{label:'Percentage',value:'PERCENT'},{label:'Fixed amount (₹)',value:'FIXED'}]},
  {name:'discountValue',label:'Discount value',type:'number',required:true,componentProps:{min:0.01,step:0.01}},
  {name:'minOrder',label:'Minimum food subtotal (₹)',type:'number',componentProps:{min:0,step:0.01}},
  {name:'maxDiscount',label:'Maximum discount (₹, optional)',type:'number',componentProps:{min:0.01,step:0.01}},
  {name:'startsAt',label:'Start date (optional)',type:'datetime-local'},{name:'expiresAt',label:'Expiry date (optional)',type:'datetime-local'},
  {name:'usageLimit',label:'Total usage limit (optional)',type:'number',componentProps:{min:1,step:1}},
  {name:'perUserLimit',label:'Uses per customer',type:'number',componentProps:{min:1,step:1}},
  {name:'isActive',label:'Offer is active',type:'switch'},
];
