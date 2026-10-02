import {
  useSelector,
} from "react-redux";

import HeroSection from "../../../components/public/home/HeroSection";

import CategorySection from "../../../components/public/home/CategorySection";

import PopularRestaurantsSection from "../../../components/public/home/PopularRestaurantsSection";

import PopularFoodsSection from "../../../components/public/home/PopularFoodsSection";

import HowItWorksSection from "../../../components/public/home/HowItWorksSection";

import PartnerCTASection from "../../../components/public/home/PartnerCTASection";

import LiveTrackingSection from "../../../components/public/home/LiveTrackingSection";

import {
  useDispatch,

} from "react-redux";

import {
  addCartItemLocal,
} from "../../../redux/slices/public/cart.slice";

const Home = () => {
  // =========================
  // CATEGORY STATE
  // =========================

  const {
    categories,

    fetchLoading:
    categoryLoading,
  } = useSelector(
    (state) =>
      state.publicCategory
  );


  // =========================
  // RESTAURANT STATE
  // =========================

  const {
    restaurants,

    fetchLoading:
    restaurantLoading,
  } = useSelector(
    (state) =>
      state.publicRestaurant
  );


  // =========================
  // FOOD STATE
  // =========================

  const {
    foods,

    fetchLoading:
    foodLoading,
  } = useSelector(
    (state) =>
      state.publicFood
  );


  // =========================
  // ADD TO CART
  // =========================

const handleAddToCart = (
  food
) => {
  const restaurant =
    restaurants.find(
      (item) =>
        item.slug ===
        food.restaurantSlug
    );


  if (!restaurant) {
    return;
  }


  dispatch(
    addCartItemLocal({
      food,
      restaurant,
    })
  );
};

  const dispatch =
    useDispatch();

  return (
    <>
      <HeroSection />


      <CategorySection
        categories={
          categories
        }

        loading={
          categoryLoading
        }
      />


      <PopularRestaurantsSection
        restaurants={
          restaurants
        }

        loading={
          restaurantLoading
        }
      />


      <PopularFoodsSection
        foods={
          foods
        }

        loading={
          foodLoading
        }

        onAddToCart={
          handleAddToCart
        }
      />

      <HowItWorksSection />

      <LiveTrackingSection />

      <PartnerCTASection />
    </>
  );
};


export default Home;