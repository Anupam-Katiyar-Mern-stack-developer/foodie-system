import {
  useEffect,
} from "react";

import {
  useDispatch,
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
  addCartItem,
} from "../../../redux/thunks/public/cart.thunk";

import {
  getRestaurants,
} from "../../../redux/thunks/public/restaurant.thunk";

import {
  getFoods,
} from "../../../redux/thunks/public/food.thunk";

import {
  getCategories,
} from "../../../redux/thunks/public/category.thunk";

const Home = () => {
  const dispatch =
    useDispatch();


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
  // FETCH HOME DATA
  // =========================

  useEffect(() => {
    dispatch(
      getCategories({
        page: 1,
        limit: 6,
      })
    );
    dispatch(
      getRestaurants()
    );

    dispatch(
      getFoods()
    );
  }, [dispatch]);


  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart =
    async (food) => {
      try {
        await dispatch(
          addCartItem({
            foodSlug:
              food.slug,

            quantity: 1,
          })
        ).unwrap();

      } catch (error) {
        console.error(
          "ADD CART ERROR:",
          error
        );
      }
    };


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