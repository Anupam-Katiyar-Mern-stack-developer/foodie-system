import {
  useSelector,
} from "react-redux";

import HeroSection from "../../../components/public/home/HeroSection";
import CategorySection from "../../../components/public/home/CategorySection";


const Home = () => {
  const {
    categories,
    fetchLoading,
  } = useSelector(
    (state) =>
      state.publicCategory
  );


  return (
    <>
      <HeroSection />

      <CategorySection
        categories={
          categories
        }

        loading={
          fetchLoading
        }
      />
    </>
  );
};


export default Home;