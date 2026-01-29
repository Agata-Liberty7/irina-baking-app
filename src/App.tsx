import { useState } from "react";
import { useAppContext } from "./context/AppContext";

import StartScreen from "./screens/StartScreen";
import RecipeInput from "./screens/RecipeInput";
import RecipeOutput from "./screens/RecipeOutput";
import TechCard from "./screens/TechCard";
import CustomRecipeView from "./screens/CustomRecipeView";

import { loadProfile } from "./logic/profileLoader";

function App() {
  const {
    climate,
    mixing,
    productionMode,
    roomTemp,
    warmFermentationHours,
    coldFermentationHours,
    setClimate,
    setMixing,
    setProductionMode,
    setRoomTemp,
    setWarmFermentationHours,
    setColdFermentationHours,
  } = useAppContext();

  type CustomRecipe = {
    id: string;
    name: string;
    recipe: any;
    profile: any;
    conditions: any;
    timestamp: number;
  };


  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [recipeData, setRecipeData] = useState<any | null>(null);

  const [showTechCard, setShowTechCard] = useState(false);
  const [techData, setTechData] = useState<any | null>(null);

  const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>(() => {
    return JSON.parse(localStorage.getItem("customRecipes") || "[]");
  });


  const [selectedCustomRecipeId, setSelectedCustomRecipeId] = useState<string | null>(null);

  const handleOpenCustomRecipe = (id: string) => {
    setSelectedCustomRecipeId(id);
  };

  const handleDeleteCustomRecipe = (id: string) => {
    const updated = customRecipes.filter((r) => r.id !== id);
    localStorage.setItem("customRecipes", JSON.stringify(updated));
    setCustomRecipes(updated);
  };

  const handleProfileSelect = (profileId: string) => {
    const loaded = loadProfile(profileId, climate, mixing);

    setSelectedProfile(profileId);
    setProfileData(loaded);
    setRecipeData(loaded.defaults);
  };

  const handleSaveAsCustom = (calculatedRecipe: any) => {
    if (!profileData || !calculatedRecipe) return;

    const name = prompt("Введите название рецепта");
    if (!name) return;

    const newRecipe = {
      id: crypto.randomUUID(),
      name,
      recipe: calculatedRecipe, // ← теперь это готовый расчёт
      profile: profileData,
      conditions: {
        climate,
        mixing,
        productionMode,
        roomTemp,
        warmFermentationHours,
        coldFermentationHours,
      },
      timestamp: Date.now(),
    };

    const updated = [...customRecipes, newRecipe];
    localStorage.setItem("customRecipes", JSON.stringify(updated));
    setCustomRecipes(updated);
  };


  const handleBackToInput = () => {
    if (!profileData) return;
    setRecipeData(profileData.defaults);
  };

  const handleRestart = () => {
    setSelectedProfile(null);
    setProfileData(null);
    setRecipeData(null);
    setShowTechCard(false);
    setSelectedCustomRecipeId(null);
  };

  const handleShowTechCard = (recipe: any) => {
    setTechData(recipe);
    setShowTechCard(true);
  };

  const handleBackFromTechCard = () => {
    setShowTechCard(false);
  };

  const handleCalculate = (data: any) => {
    setRecipeData({ ...data, _calculated: true });
  };

  //
  // === ЭКРАНЫ ===
  //

  if (showTechCard && techData && profileData) {
    return (
      <TechCard
        profile={profileData}
        recipe={techData}
        onBack={handleBackFromTechCard}
      />
    );
  }

  if (selectedProfile && profileData && recipeData?._calculated) {
    return (
      <RecipeOutput
        profileId={selectedProfile}
        profile={profileData}
        data={recipeData}
        onBack={handleBackToInput}
        onRestart={handleRestart}
        onShowTechCard={handleShowTechCard}
        onSaveAsCustom={handleSaveAsCustom}
      />
    );
  }

  if (selectedCustomRecipeId) {
    const recipeObj = customRecipes.find((r) => r.id === selectedCustomRecipeId);

    if (!recipeObj) {
      setSelectedCustomRecipeId(null);
      return null;
    }

    return (
      <CustomRecipeView
        name={recipeObj.name}
        recipe={recipeObj.recipe}
        profile={recipeObj.profile}
        conditions={recipeObj.conditions}
        onBack={() => setSelectedCustomRecipeId(null)}
      />
    );
  }

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
      customRecipes={customRecipes}
      onOpenCustomRecipe={handleOpenCustomRecipe}
      onDeleteCustomRecipe={handleDeleteCustomRecipe}
    />
  );
}

export default App;
