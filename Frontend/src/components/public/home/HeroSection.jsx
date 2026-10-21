import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  TicketPercent,
  MapPin,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";
import Container from "../../common/Container/Container";
import Button from "../../common/Button/Button";
import OptimizedImage from "../../common/OptimizedImage/OptimizedImage";
import heroImage from "../../../assets/hero.png";

export default function HeroSection({ foods = [] }) {
  const { settings, offers = [] } = useSelector((state) => state.siteSettings);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0),
    [paused, setPaused] = useState(false),
    [hovered, setHovered] = useState(false),
    [copied, setCopied] = useState("");
  const [now,setNow]=useState(()=>Date.now());
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),30000);return ()=>clearInterval(timer);},[]);
  const liveOffers = settings.couponsEnabled
    ? offers
        .filter(
          (offer) =>
            offer.isActive !== false &&
            (!offer.startsAt || new Date(offer.startsAt).getTime() <= now) &&
            (!offer.expiresAt || new Date(offer.expiresAt).getTime() > now)
        )
        .slice(0, 4)
    : [];
  const slides = [
    {
      id: "welcome",
      eyebrow: settings.heroEyebrow,
      title: settings.heroTitle,
      highlight: settings.heroHighlight,
      description: settings.heroDescription,
      image: settings.heroImage || heroImage,
      cta: settings.heroButtonText,
      path: "/restaurants",
      kind: "brand",
    },
    ...liveOffers.map((offer) => ({
      id: `offer-${offer.id}`,
      eyebrow: "A little treat, on us",
      title:
        offer.discountType === "PERCENT"
          ? `${Number(offer.discountValue)}% off`
          : `?${Number(offer.discountValue)} off`,
      highlight: offer.title,
      description:
        offer.description ||
        "Something delicious tastes even better with a little saving. Apply this code at checkout.",
      image: settings.heroImage || heroImage,
      cta: "Find your favourites",
      path: "/search",
      offer,
      kind: "offer",
    })),
    ...foods
      .filter((food) => food.image && food.isAvailable !== false)
      .slice(0, 2)
      .map((food) => ({
        id: food.slug,
        eyebrow: "On the menu today",
        title: food.name,
        highlight: food.restaurantName || "Made for your cravings.",
        description:
          food.description ||
          "Discover a new favourite, freshly prepared by a local kitchen.",
        image: food.image,
        cta: "Take a closer look",
        path: `/foods/${food.slug}`,
        kind: "food",
      })),
  ];
  const current = index % slides.length,
    slide = slides[current];
  const move = (step) => {
    setIndex((value) => (value + step + slides.length) % slides.length);
    setCopied("");
  };
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || hovered || slides.length < 2 || reduced.matches) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % slides.length);
    }, 6500);
    const stop = () => {
      if (reduced.matches) clearInterval(timer);
    };
    reduced.addEventListener("change", stop);
    return () => {
      clearInterval(timer);
      reduced.removeEventListener("change", stop);
    };
  }, [paused, hovered, slides.length]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(slide.offer.code);
      setCopied(slide.offer.code);
    } catch {
      setCopied(`Use ${slide.offer.code} at checkout`);
    }
  };
  return (
    <section
      className="bg-[#f8f5ef] pb-6 pt-5 sm:pb-10 sm:pt-8"
      aria-label="Featured food and offers"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setHovered(false);
      }}
    >
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#e5dfd2] bg-[#eee9dc] sm:rounded-[2.75rem]">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[650px] w-[650px] rounded-full border-[80px] border-white/25"
            aria-hidden="true"
          />
          <div
            key={slide.id}
            className="hero-slide relative grid min-h-[540px] items-center gap-4 p-6 pb-24 sm:p-10 sm:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:p-14 lg:pb-24"
            role="group"
            aria-roledescription="slide"
            aria-label={`${current + 1} of ${slides.length}`}
          >
            <div className="relative z-10 min-w-0 max-w-xl">
              <p className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#705b37]">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                {slide.eyebrow}
              </p>
              <h1 className="text-[clamp(2.6rem,5.8vw,5.25rem)] break-words font-black leading-[1.02] tracking-[-.055em] text-[#24251f]">
                {slide.title}
                <span className="mt-1 block font-serif font-medium italic text-[#bd481c]">
                  {slide.highlight}
                </span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#68675d]">
                {slide.description}
              </p>
              {slide.offer && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={copy}
                    className="flex min-h-11 items-center gap-3 rounded-xl border border-dashed border-orange-500 bg-white/65 px-4 py-2 font-bold tracking-wider text-orange-800"
                  >
                    <TicketPercent size={18} />
                    {slide.offer.code}
                    <span className="text-[10px] font-medium tracking-normal">
                      Copy code
                    </span>
                  </button>
                  <span className="text-xs text-[#68675d]">
                    Min. order ?{Number(slide.offer.minOrder || 0)}
                    {slide.offer.maxDiscount
                      ? ` ? Up to ?${Number(slide.offer.maxDiscount)}`
                      : ""}
                  </span>
                  <span
                    role="status"
                    className="w-full text-xs text-orange-800"
                  >
                    {copied === slide.offer.code
                      ? "Code copied. Apply it at checkout."
                      : copied}
                  </span>
                </div>
              )}
              {liveOffers.length > 0 && slide.kind !== "offer" && (
                <button
                  type="button"
                  onClick={() => setIndex(1)}
                  className="mt-5 flex min-h-11 items-center gap-2 text-sm font-semibold text-orange-800"
                >
                  <TicketPercent size={17} />
                  {liveOffers[0].title} ? {liveOffers[0].code}
                  <ChevronRight size={14} />
                </button>
              )}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Button
                  size="lg"
                  rightIcon={ArrowUpRight}
                  className="!rounded-full !bg-[#24251f] px-7 hover:!bg-[#3c4034]"
                  onClick={() => navigate(slide.path)}
                >
                  {slide.cta}
                </Button>
                <button
                  type="button"
                  onClick={() => navigate("/search")}
                  className="min-h-11 text-sm font-semibold text-[#494b3e] underline decoration-[#b7b5a8] underline-offset-4"
                >
                  Browse the menu
                </button>
              </div>
            </div>
            <div className="relative mx-auto flex w-full max-w-[480px] items-center justify-center py-5 lg:py-0">
              <div
                className="absolute inset-5 rounded-full bg-[#e2d7bb]"
                aria-hidden="true"
              />
              <OptimizedImage
                src={slide.image}
                alt={
                  slide.kind === "food"
                    ? slide.title
                    : "Freshly prepared curry, rice and naan"
                }
                loading="eager"
                showLoader={false}
                objectFit={slide.kind === "food" ? "cover" : "contain"}
                rounded={
                  slide.kind === "food" ? "rounded-[2rem]" : "rounded-none"
                }
                wrapperClassName="relative w-full bg-transparent"
                className="h-[270px] w-full sm:h-[360px] lg:h-[405px]"
              />
              <span className="absolute bottom-2 left-3 rounded-full border border-white/80 bg-white/95 px-4 py-3 text-xs font-semibold text-[#494b3e] shadow-sm">
                Good food. Better company.
              </span>
            </div>
          </div>
          <div className="absolute inset-x-6 bottom-5 flex items-center justify-between border-t border-[#d6cfbd] pt-4 sm:inset-x-10 lg:inset-x-14">
            <span className="text-[11px] font-bold uppercase tracking-[.16em] text-[#787567]">
              {String(current + 1).padStart(2, "0")}{" "}
              <span className="mx-2 text-[#a9a591]">/</span>{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
            <div className="hidden items-center gap-1 sm:flex">
              {slides.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={current === i ? "true" : undefined}
                  className="flex h-11 min-w-9 items-center justify-center"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all ${
                      current === i ? "w-6 bg-[#34382c]" : "w-1.5 bg-[#b2ad9d]"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {[
                [() => move(-1), ChevronLeft, "Previous slide"],
                [
                  () => setPaused((value) => !value),
                  paused ? Play : Pause,
                  paused ? "Play slides" : "Pause slides",
                ],
                [() => move(1), ChevronRight, "Next slide"],
              ].map(([action, Icon, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#cfc8b5] text-[#4d5143] transition hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 px-2 pt-6 text-xs font-medium text-[#77776c] sm:text-sm">
          {[
            [UtensilsCrossed, "Local kitchens, lovely food"],
            [MapPin, "Track every delivery"],
            [
              ShieldCheck,
              settings.onlineEnabled
                ? "Secure checkout with Razorpay"
                : "Cash on delivery available",
            ],
          ].map(([Icon, label]) => (
            <span key={label} className="flex items-center gap-2">
              <Icon size={16} className="text-[#777f5b]" />
              {label}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
