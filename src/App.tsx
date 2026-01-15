import { useState } from "react";
import { useAppContext } from "./context/AppContext";

import StartScreen from "./screens/StartScreen";
import RecipeInput from "./screens/RecipeInput";
import RecipeOutput from "./screens/RecipeOutput";

import { loadProfile } from "./logic/profileLoader";

function App() {
  const {
    climate,
    mixing,
    productionMode,
    roomTemp,
    setClimate,
    setMixing,
    setProductionMode,
    setRoomTemp,
  } = useAppContext();

  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [recipeData, setRecipeData] = useState<any | null>(null);

  //
  // Когда пользователь выбирает профиль на StartScreen
  //
  const handleProfileSelect = (profileId: string) => {
    const loaded = loadProfile(profileId, climate, mixing);

    setSelectedProfile(profileId);
    setProfileData(loaded);
    setRecipeData(loaded.defaults);
  };

  //
  // Когда пользователь нажимает "Назад" из RecipeOutput
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
  // Когда пользователь нажимает "Рассчитать рецепт"
  //
  const handleCalculate = (data: any) => {
    setRecipeData(data);
  };

  //
  // 1) Если есть рассчитанные данные → RecipeOutput
  //
  if (
    selectedProfile &&
    recipeData &&
    profileData &&
    recipeData !== profileData.defaults
  ) {
    return (
      <RecipeOutput
        profileId={selectedProfile}
        profile={profileData}
        data={recipeData}
        onBack={handleBackToInput}
        onRestart={handleRestart}
      />
    );
  }

  //
  // 2) Если выбран профиль → RecipeInput
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
  // 3) Стартовый экран
  //
  return (
    <StartScreen
      climate={climate}
      mixing={mixing}
      productionMode={productionMode}
      roomTemp={roomTemp}
      onClimateChange={setClimate}
      onMixingChange={setMixing}
      onProductionModeChange={setProductionMode}
      onRoomTempChange={setRoomTemp}
      onProfileSelect={handleProfileSelect}
      onCustomDough={() => handleProfileSelect("custom")}
    />
  );
}

export default App;
