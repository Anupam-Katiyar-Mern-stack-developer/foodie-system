import { Link } from "react-router-dom";
import { ArrowUpRight, Store, Bike } from "lucide-react";
import Container from "../../common/Container/Container";
export default function PartnerCTASection() {
  return (
    <section className="pb-16 pt-3 sm:pb-20">
      <Container>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            [
              Store,
              "A kitchen worth discovering.",
              "Bring your menu to more people in your neighbourhood.",
              "Partner with us",
              "/restaurant/register",
            ],
            [
              Bike,
              "Good routes. New opportunities.",
              "Join our delivery community and get moving on your terms.",
              "Become a delivery partner",
              "/delivery/register",
            ],
          ].map(([Icon, title, text, cta, path], i) => (
            <div
              key={path}
              className={`rounded-[2rem] p-7 sm:p-9 ${
                i
                  ? "border border-[#dfdfd5] bg-[#f1ede4]"
                  : "bg-[#30382c] text-white"
              }`}
            >
              <Icon
                size={25}
                className={i ? "text-[#8b7758]" : "text-[#b3c59f]"}
              />
              <h2 className="mt-6 text-2xl font-bold tracking-tight">
                {title}
              </h2>
              <p
                className={`mt-3 text-sm leading-6 ${
                  i ? "text-[#77776c]" : "text-[#c0c7b9]"
                }`}
              >
                {text}
              </p>
              <Link
                to={path}
                className={`mt-7 inline-flex min-h-11 items-center gap-3 border-b text-sm font-semibold ${
                  i
                    ? "border-[#bcb6a5] text-[#565e48]"
                    : "border-[#6b7b5d] text-white"
                }`}
              >
                {cta}
                <ArrowUpRight size={17} />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
