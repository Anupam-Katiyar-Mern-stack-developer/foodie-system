import { useEffect,useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Globe,Plus,Pencil,RefreshCw,Image as ImageIcon,Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeader from '../../../components/common/PageHeader/PageHeader';
import Card from '../../../components/common/Card/Card';
import CommonForm from '../../../components/common/CommonForm/CommonForm';
import CommonTable from '../../../components/common/CommonTable/CommonTable';
import Tabs from '../../../components/common/Tabs/Tabs';
import Button from '../../../components/common/Button/Button';
import Modal from '../../../components/common/Modal/Modal';
import FileUpload from '../../../components/common/FileUpload/FileUpload';
import StatusBadge from '../../../components/common/StatusBadge/StatusBadge';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import ErrorState from '../../../components/common/ErrorState/ErrorState';
import Skeleton from '../../../components/common/Skeleton/Skeleton';
import { siteSettingsGroups,couponFields } from '../../../forms/admin/admin.form';
import { fetchAdminResource,performAdminAction } from '../../../redux/thunks/admin/admin.thunk';
import { fetchSiteSettings } from '../../../redux/thunks/public/setting.thunk';

const localDate=value=>value?new Date(new Date(value).getTime()-new Date(value).getTimezoneOffset()*60000).toISOString().slice(0,16):'';
export default function SiteSettings(){
  const dispatch=useDispatch();
  const [tab,setTab]=useState('branding');
  const [editor,setEditor]=useState(null);
  const state=useSelector(s=>s.admin.resources['site-settings']);
  const coupons=useSelector(s=>s.admin.resources.coupons);
  const busy=useSelector(s=>s.admin.actionLoading);
  const settings=state.data;
  const reload=()=>{dispatch(fetchAdminResource({resource:'site-settings'}));dispatch(fetchAdminResource({resource:'coupons'}));};
  useEffect(()=>{const a=dispatch(fetchAdminResource({resource:'site-settings'}));const b=dispatch(fetchAdminResource({resource:'coupons'}));return()=>{a.abort();b.abort();};},[dispatch]);
  const save=async values=>{
    try{await dispatch(performAdminAction({method:'put',path:'site-settings',payload:{...settings,...values}})).unwrap();toast.success('Website settings saved');reload();dispatch(fetchSiteSettings());}
    catch(error){toast.error(String(error));}
  };
  const upload=async(asset,file)=>{
    if(!file)return;
    const payload=new FormData();payload.append('image',file);
    try{await dispatch(performAdminAction({method:'post',path:`site-settings/asset?asset=${asset}`,payload})).unwrap();toast.success('Image updated');reload();dispatch(fetchSiteSettings());}catch(error){toast.error(String(error));}
  };
  const saveCoupon=async values=>{
    const payload={...values,discountValue:Number(values.discountValue),minOrder:Number(values.minOrder||0),perUserLimit:Number(values.perUserLimit||1),startsAt:values.startsAt?new Date(values.startsAt).toISOString():null,expiresAt:values.expiresAt?new Date(values.expiresAt).toISOString():null};
    try{await dispatch(performAdminAction({method:editor.id?'put':'post',path:editor.id?`coupons/${editor.id}`:'coupons',payload})).unwrap();toast.success('Coupon saved');setEditor(null);dispatch(fetchAdminResource({resource:'coupons'}));}catch(error){toast.error(String(error));}
  };
  return <div className="space-y-6"><PageHeader title="Website settings" description="Your brand, homepage, ordering rules and offers, all in one place." actions={<Button variant="outline" leftIcon={RefreshCw} loading={state.loading} onClick={reload}>Refresh</Button>}/>
    <Card><div className="flex items-center gap-4"><span className="rounded-2xl bg-orange-100 p-3 text-orange-600"><Globe className="h-6 w-6" aria-hidden="true"/></span><div><p className="font-bold">Make Foodie your own</p><p className="mt-1 text-sm text-slate-500">Changes apply to the public website. Payment secrets stay in your server environment.</p></div></div></Card>
    <Tabs tabs={[{key:'branding',label:'Brand & contact'},{key:'homepage',label:'Homepage'},{key:'ordering',label:'Ordering & payments'},{key:'coupons',label:'Offers & coupons'}]} activeTab={tab} onChange={setTab} disabled={busy}/>
    {state.error&&<ErrorState title="Unable to load settings" description={state.error} onRetry={reload}/>}
    {!settings&&state.loading&&<Skeleton height="h-80" width="w-full"/>}
    {settings&&tab!=='coupons'&&<Card title={tab==='branding'?'Brand identity':tab==='homepage'?'Homepage content':'Ordering rules'} description={tab==='ordering'?'Delivery fees apply once per restaurant. Tax applies to food after coupon discounts.':'Edit the details shown to your customers.'} padding="lg"><CommonForm key={`${tab}:${JSON.stringify(settings)}`} fields={siteSettingsGroups[tab]} defaultValues={settings} onSubmit={save} loading={busy} showCancel={false} submitText="Save website changes"/>
      {(tab==='branding'||tab==='homepage')&&<div className="mt-8 grid gap-6 border-t pt-6 sm:grid-cols-2">{(tab==='branding'?[['logo','Website logo'],['favicon','Favicon']]:[['heroImage','Hero photograph']]).map(([asset,label])=><FileUpload key={asset} label={label} existingPreview={settings[asset]} disabled={busy} onChange={file=>upload(asset,file)} helperText="JPG, PNG or WebP. Upload saves this image immediately."/>)}</div>}
      {tab==='ordering'&&<p className="mt-5 rounded-xl bg-orange-50 p-4 text-sm leading-6 text-orange-800">Razorpay needs valid test/live keys and a webhook secret in Backend/.env. Placeholder keys never process payments. SMTP credentials are needed for email delivery.</p>}
    </Card>}
    {tab==='coupons'&&<Card title="Offers & coupons" description="Create offers with expiry dates, limits and server-verified discounts." headerAction={<Button leftIcon={Plus} onClick={()=>setEditor({})}>Add offer</Button>}>{coupons.error&&<ErrorState title="Unable to load offers" description={coupons.error} onRetry={reload}/>}<CommonTable rowKey="id" loading={coupons.loading} data={coupons.data||[]} minWidth="min-w-[640px]" columns={[{key:'code',label:'Offer',render:row=><div><p className="font-bold text-orange-700">{row.code}</p><p className="mt-1 text-xs text-slate-500">{row.title}</p></div>},{key:'discountValue',label:'Discount',render:row=>row.discountType==='PERCENT'?`${row.discountValue}%`:`₹${row.discountValue}`},{key:'minOrder',label:'Minimum order',render:row=>`₹${row.minOrder}`},{key:'isActive',label:'Status',render:row=><StatusBadge variant={row.isActive?'success':'neutral'}>{row.isActive?'Enabled':'Disabled'}</StatusBadge>},{key:'actions',label:'Manage',render:row=><Button variant="ghost" leftIcon={Pencil} onClick={()=>setEditor(row)}>Edit</Button>}]} emptyState={<EmptyState icon={Tag} title="Your next great offer starts here" description="Add a coupon and let customers discover more for less."/>}/></Card>}
    <Modal open={Boolean(editor)} onClose={()=>setEditor(null)} disableClose={busy} title={editor?.id?'Edit offer':'Create an offer'} size="lg">{editor&&<CommonForm key={editor.id||'new'} fields={couponFields} defaultValues={{code:'',title:'',description:'',discountType:'PERCENT',discountValue:10,minOrder:0,maxDiscount:'',usageLimit:'',perUserLimit:1,isActive:true,...editor,startsAt:localDate(editor.startsAt),expiresAt:localDate(editor.expiresAt)}} onSubmit={saveCoupon} onCancel={()=>setEditor(null)} loading={busy} submitText="Save offer"/>}</Modal>
  </div>;
}
