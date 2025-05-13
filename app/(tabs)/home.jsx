import { ScrollView } from "react-native";
import CategoryJob from "../../components/Home/CategoryJob";
import Header from "../../components/Home/Header";
import JobItem from "../../components/Home/JobItem";
import SliderCompany from "../../components/Home/SliderCompany";
import SafeAreaWrapper from "../../components/SafeAreaWrapper";
const HomeScreen = () => {
  return (
    <SafeAreaWrapper>
      <ScrollView>
        <Header />
        <SliderCompany />
        <CategoryJob />
        <JobItem />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default HomeScreen;
