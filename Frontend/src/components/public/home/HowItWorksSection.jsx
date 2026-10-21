import { ShoppingBag, ChefHat, Bike, MapPinned } from "lucide-react";
import Container from "../../common/Container/Container";
const steps = [
  [
    ShoppingBag,
    "Find your favourite",
    "Browse local kitchens and build your perfect order.",
  ],
  [
    ChefHat,
    "Made fresh for you",
    "Your restaurant confirms and prepares your meal.",
  ],
  [Bike, "On its way", "A delivery partner picks it up from the kitchen."],
  [
    MapPinned,
    "Follow every step",
    "Track the journey, then enjoy your first bite.",
  ],
];
export default function HowItWorksSection() {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="rounded-[2rem] bg-[#eef0e7] p-6 sm:p-10">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#727c5c]">
                A little less effort
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#303827]">
                From craving to first bite.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-[#6c7560]">
              Your favourites are just a few simple steps away.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(([Icon, title, text], i) => (
              <div key={title}>
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#64734f]">
                    <Icon size={21} />
                  </span>
                  <span className="text-xs font-medium text-[#959e89]">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-[#39432f]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#737d67]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
