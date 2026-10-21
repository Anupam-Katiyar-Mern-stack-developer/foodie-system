import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Bike, MapPinned, UtensilsCrossed, Leaf, Heart } from "lucide-react";
import Container from "../../common/Container/Container";
import Button from "../../common/Button/Button";
import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";
import heroImage from "../../../assets/hero.png";

export default function HeroSection() {
  const { settings } = useSelector(state => state.siteSettings);
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-[#fffaf5] pb-14 pt-8 sm:pb-20 sm:pt-14 lg:pb-24">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-orange-100/50 to-transparent" aria-hidden="true" />
      <Container>
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div className="max-w-xl">
            <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-700"><span className="h-2 w-2 rounded-full bg-orange-500" />{settings.heroEyebrow}</p>
            <h1 className="text-[clamp(2.75rem,6.2vw,5.7rem)] font-black leading-[1.02] tracking-[-0.055em] text-slate-950">{settings.heroTitle}<br /><span className="font-serif font-medium italic text-orange-600">{settings.heroHighlight}</span></h1>
            <p className="mt-7 max-w-md text-base leading-8 text-slate-600 sm:text-lg">{settings.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button size="lg" rightIcon={ArrowUpRight} onClick={() => navigate('/restaurants')}>{settings.heroButtonText}</Button><Button size="lg" variant="outline" onClick={() => navigate('/restaurant/register')}>Become a partner</Button></div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-orange-200/70 pt-6 text-sm font-medium text-slate-600"><span className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4 text-orange-600" aria-hidden="true"/>Local favourites</span><span className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-orange-600" aria-hidden="true"/>Live order tracking</span><span className="flex items-center gap-2"><Heart className="h-4 w-4 text-orange-600" aria-hidden="true"/>Made with care</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-lg pb-8 pt-4 lg:pt-0">
            <div className="absolute inset-x-6 bottom-8 top-4 rounded-t-[45%] rounded-b-[2.5rem] border border-orange-200 bg-[#f5eadb]" aria-hidden="true" />
            <span className="absolute right-7 top-5 z-10 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-orange-800">Freshly picked for you</span>
            <OptimizedImage src={settings.heroImage || heroImage} alt="A freshly prepared meal, ready to enjoy" loading="eager" showLoader={false} objectFit="contain" rounded="rounded-none" className="relative h-[330px] w-full sm:h-[440px]" wrapperClassName="relative z-[1] bg-transparent px-2 pt-7" />
            <div className="absolute -bottom-1 left-0 z-10 flex max-w-[260px] items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-xl shadow-orange-950/10 sm:-left-3"><span className="rounded-xl bg-orange-100 p-3 text-orange-600"><Bike className="h-6 w-6" aria-hidden="true"/></span><div><p className="text-sm font-bold text-slate-950">Your cravings, delivered.</p><p className="mt-1 text-xs text-slate-500">From their kitchen to your table.</p></div></div>
            <div className="absolute bottom-10 right-3 z-10 flex h-14 w-14 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-700"><Leaf className="h-6 w-6" aria-label="Fresh food"/></div>
          </div>
        </div>
      </Container>
    </section>
  );
}
