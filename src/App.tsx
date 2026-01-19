import { useState } from "react";
import { useAppContext } from "./context/AppContext";

import StartScreen from "./screens/StartScreen";
import RecipeInput from "./screens/RecipeInput";
import RecipeOutput from "./screens/RecipeOutput";

import { loadProfile } from "./logic/profileLoader";
import TechCard from "./screens/TechCard";


function App() {
const { 
  climate, 
  mixing, 
  productionMode, 
  roomTemp, 
  warmFermentationHours, 
  coldFermentationHours, 
  setClimate, setMixing, 
  setProductionMode, 
  setRoomTemp, 
  setWarmFermentationHours, 
  setColdFermentationHours, 
} = useAppContext();

  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [recipeData, setRecipeData] = useState<any | null>(null);
  const [showTechCard, setShowTechCard] = useState(false);
  const [techData, setTechData] = useState<any | null>(null);


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
  const handleShowTechCard = (recipe: any) => {
    setTechData(recipe);
    setShowTechCard(true);
  };
  const handleBackFromTechCard = () => {
    setShowTechCard(false);
  };


  //
  // Когда пользователь нажимает "Рассчитать рецепт"
  //
  const handleCalculate = (data: any) => {
    setRecipeData(data);
  };

  // 0) Если открыт экран технологической карты
  if (showTechCard && techData && profileData) {
    return (
      <TechCard
        profile={profileData}
        recipe={techData}
        onBack={handleBackFromTechCard}
      />
    );
  }

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
      onShowTechCard={handleShowTechCard}
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
  warmFermentationHours={warmFermentationHours} 
  coldFermentationHours={coldFermentationHours} 
  onClimateChange={setClimate} 
  onMixingChange={setMixing} 
  onProductionModeChange={setProductionMode} 
  onRoomTempChange={setRoomTemp} 
  onWarmFermentationChange={setWarmFermentationHours}
  onColdFermentationChange={setColdFermentationHours} 
  onProfileSelect={handleProfileSelect} 
  onCustomDough={() => handleProfileSelect("custom")}
/>
  );
}

export default App;
