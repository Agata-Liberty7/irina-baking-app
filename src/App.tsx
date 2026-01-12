import { useState } from "react";
import { useAppContext } from "./context/AppContext";

import StartScreen from "./screens/StartScreen";
import RecipeInput from "./screens/RecipeInput";
import RecipeOutput from "./screens/RecipeOutput";

import { loadProfile } from "./logic/profileLoader";

function App() {
  const {
    region,
    climate,
    mixing,
    productionMode,
    setRegion,
    setClimate,
    setMixing,
    setProductionMode
  } = useAppContext();

  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [recipeData, setRecipeData] = useState<any | null>(null);

  //
  // Когда пользователь выбирает профиль на StartScreen
  //
  const handleProfileSelect = (profileId: string) => {
    const loaded = loadProfile(profileId, region, climate, mixing);

    setSelectedProfile(profileId);
    setProfileData(loaded);          // весь профиль
    setRecipeData(loaded.defaults);  // дефолтные значения для RecipeInput
  };

  //
  // Когда пользователь нажимает "Назад" из RecipeOutput → возвращаемся к RecipeInput
  //
  const handleBackToInput = () => {
    setRecipeData(profileData?.defaults || null);
  };

  //
  // Когда пользователь нажимает "На стартовый экран"
  //
  const handleRestart = () => {
    setSelectedProfile(null);
    setProfileData(null);
    setRecipeData(null);
  };

  //
  // Когда пользователь нажимает "Рассчитать рецепт" в RecipeInput
  //
  const handleCalculate = (data: any) => {
    setRecipeData(data);
  };

  //
  // 1) Если есть рассчитанные данные → показываем RecipeOutput
  //
  if (selectedProfile && recipeData && profileData && recipeData !== profileData.defaults) {
    return (
      <RecipeOutput
        profileId={selectedProfile}
        data={recipeData}
        onBack={handleBackToInput}
        onRestart={handleRestart}
      />
    );
  }

  //
  // 2) Если выбран профиль → показываем RecipeInput
  //
  if (selectedProfile && profileData && recipeData) {
    return (
      <RecipeInput
        profileId={selectedProfile}
        onBack={handleRestart}
        onCalculate={handleCalculate}
        initialValues={recipeData}
        profile={profileData}
      />
    );
  }

  //
  // 3) Иначе → стартовый экран
  //
  return (
    <StartScreen
      region={region}
      climate={climate}
      mixing={mixing}
      productionMode={productionMode}
      onRegionChange={setRegion}
      onClimateChange={setClimate}
      onMixingChange={setMixing}
      onProductionModeChange={setProductionMode}
      onProfileSelect={handleProfileSelect}
      onCustomDough={() => handleProfileSelect("custom")}
    />
  );
}

export default App;
