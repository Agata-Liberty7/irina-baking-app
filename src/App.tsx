import { useState } from "react";
import { useAppContext } from "./context/AppContext";

import StartScreen from "./screens/StartScreen";
import RecipeInput from "./screens/RecipeInput";
import RecipeOutput from "./screens/RecipeOutput";
import TechCard from "./screens/TechCard";
import CustomProfileScreen from "./screens/CustomProfileScreen";

import { loadProfile } from "./logic/profileLoader";
import { loadCustomProfiles } from "./logic/customProfiles";


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

  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any | null>(null);
  const [recipeData, setRecipeData] = useState<any | null>(null);

  const [showTechCard, setShowTechCard] = useState(false);
  const [techData, setTechData] = useState<any | null>(null);

  const [showCustom, setShowCustom] = useState(false);
  const [editProfileId, setEditProfileId] = useState<string | null>(null);

  const [customProfiles, setCustomProfiles] = useState(loadCustomProfiles());

  //
  // 0) Создать кастомный профиль
  //
  const handleCustomDough = () => {
    setEditProfileId(null);
    setShowCustom(true);
  };

  //
  // 1) Редактировать кастомный профиль
  //
  const handleEditCustom = (id: string) => {
    setEditProfileId(id);
    setShowCustom(true);
  };

  //
  // 2) Удалить кастомный профиль
  //
  const handleDeleteCustom = (id: string) => {
    const updated = customProfiles.filter((p) => p.id !== id);
    localStorage.setItem("customProfiles", JSON.stringify(updated));
    setCustomProfiles(updated);

    if (selectedProfile === id) {
      setSelectedProfile(null);
      setProfileData(null);
      setRecipeData(null);
    }
  };

  //
  // 3) Сохранение кастомного профиля
  //
  const handleSaveCustomProfile = (profile: any) => {
    const updated = customProfiles.filter((p) => p.id !== profile.id);
    updated.push(profile);

    localStorage.setItem("customProfiles", JSON.stringify(updated));
    setCustomProfiles(updated);

    setShowCustom(false);
    setEditProfileId(null);

    // 🔥 гарантируем переход в RecipeInput
    setSelectedProfile(profile.id);
    const loaded = loadProfile(profile.id, climate, mixing);
    setProfileData(loaded);
    setRecipeData(loaded.defaults);

    // 🔥 сбрасываем техкарту, если вдруг была открыта
    setShowTechCard(false);
    setTechData(null);



    // 🔥 сбрасываем техкарту, если вдруг была открыта`
    setShowTechCard(false);
    setTechData(null);

  };

  //
  // 4) Выбор стандартного профиля
  //
  const handleProfileSelect = (profileId: string) => {
    const loaded = loadProfile(profileId, climate, mixing);

    setSelectedProfile(profileId);
    setProfileData(loaded);
    setRecipeData(loaded.defaults); // ещё не рассчитано
  };

  //
  // 5) Назад из RecipeOutput → RecipeInput
  //
  const handleBackToInput = () => {
    if (!profileData) return;
    setRecipeData(profileData.defaults); // сброс к исходным значениям, без _calculated
  };

  //
  // 6) На стартовый экран
  //
  const handleRestart = () => {
    setSelectedProfile(null);
    setProfileData(null);
    setRecipeData(null);
    setShowTechCard(false);
  };

  //
  // 7) Техкарта
  //
  const handleShowTechCard = (recipe: any) => {
    setTechData(recipe);
    setShowTechCard(true);
  };

  const handleBackFromTechCard = () => {
    setShowTechCard(false);
  };

  //
  // 8) Рассчитать рецепт
  //
  const handleCalculate = (data: any) => {
    // помечаем, что это уже рассчитанный рецепт
    setRecipeData({ ...data, _calculated: true });
  };

  //
  // === ЭКРАНЫ ===
  //

  if (showCustom) {
    const initialProfile =
      editProfileId && customProfiles.find((p) => p.id === editProfileId);

    return (
      <CustomProfileScreen
        initialProfile={initialProfile || null}
        onSave={handleSaveCustomProfile}
        onCancel={() => {
          setShowCustom(false);
          setEditProfileId(null);
        }}
      />
    );
  }

  if (showTechCard && techData && profileData) {
    return (
      <TechCard
        profile={profileData}
        recipe={techData}
        onBack={handleBackFromTechCard}
      />
    );
  }

  // если есть рассчитанный рецепт → экран результата
  if (selectedProfile && profileData && recipeData?._calculated) {
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

  // если профиль выбран, но рецепт ещё не рассчитан → экран ввода
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
      onCustomDough={handleCustomDough}
      onEditCustom={handleEditCustom}
      onDeleteCustom={handleDeleteCustom}
      customProfiles={customProfiles}
    />
  );
}

export default App;
