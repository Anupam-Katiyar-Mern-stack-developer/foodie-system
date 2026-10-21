import { createSlice } from "@reduxjs/toolkit";
import { fetchSiteSettings } from "../../thunks/public/setting.thunk";
const settings={siteName:'Foodie',tagline:'Good food. Delivered with care.',logo:'',favicon:'',heroEyebrow:'Your neighbourhood. Your favourites.',heroTitle:'Good food,',heroHighlight:'great moments.',heroDescription:'Discover local favourites, find your next craving and let us bring something delicious to your door.',heroImage:'',heroButtonText:'Explore restaurants',announcement:'',announcementEnabled:false,supportEmail:'support@foodie.com',supportPhone:'',footerText:'A little closer to the food you love.',codEnabled:true,onlineEnabled:true,couponsEnabled:true,maintenanceMode:false,maintenanceMessage:'We’re making things better. Please check back soon.',minimumOrder:0,deliveryFee:0,freeDeliveryAbove:0,taxPercent:0};
const slice=createSlice({name:'siteSettings',initialState:{settings,loading:false,error:null},reducers:{},extraReducers:builder=>builder
  .addCase(fetchSiteSettings.pending,state=>{state.loading=true;})
  .addCase(fetchSiteSettings.fulfilled,(state,action)=>{state.settings={...state.settings,...action.payload};state.loading=false;state.error=null;})
  .addCase(fetchSiteSettings.rejected,(state,action)=>{state.loading=false;state.error=action.payload;})});
export default slice.reducer;
