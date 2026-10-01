import {
  useSelector,
} from "react-redux";

import HeroSection from "../../../components/public/home/HeroSection";
import CategorySection from "../../../components/public/home/CategorySection";
import PopularRestaurantsSection from "../../../components/public/home/PopularRestaurantsSection";


const Home = () => {
  const {
    categories,
    fetchLoading:
      categoryLoading,
  } = useSelector(
    (state) =>
      state.publicCategory
  );


  const {
    restaurants,
    fetchLoading:
      restaurantLoading,
  } = useSelector(
    (state) =>
      state.publicRestaurant
  );


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
    </>
  );
};


export default Home;