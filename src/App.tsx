import { useState } from "react";
import { useAppContext } from "./context/AppContext";

import StartScreen from "./screens/StartScreen";
import RecipeInput from "./screens/RecipeInput";
import RecipeOutput from "./screens/RecipeOutput";
import TechCard from "./screens/TechCard";
import CustomRecipeView from "./screens/CustomRecipeView";

import { loadProfile } from "./logic/profileLoader";
import {LIQUID_WATER_CONTENT} from "./logic/liquidWaterContent";

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

  const n = (value: unknown, fallback = 0) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  };

  // ------------------------------------------------------------
  // 1. Открытие кастомного рецепта
  // ------------------------------------------------------------
  const handleOpenCustomRecipe = (id: string) => {
    setSelectedCustomRecipeId(id);
  };

  const handleDeleteCustomRecipe = (id: string) => {
    const updated = customRecipes.filter((r) => r.id !== id);
    localStorage.setItem("customRecipes", JSON.stringify(updated));
    setCustomRecipes(updated);
  };

  // ------------------------------------------------------------
  // 2. Выбор профиля
  // ------------------------------------------------------------
  const handleProfileSelect = (profileId: string) => {
    const loaded = loadProfile(profileId, climate, mixing, {
      productionMode,
      coldHours: coldFermentationHours,
      warmHours: warmFermentationHours,
      flourType: "normal",
      yeastForm: "instant",
    });

    setSelectedProfile(profileId);
    setProfileData(loaded);

    setRecipeData({
      mode: "flour",
      targetDoughWeight: 0,

      flour: loaded?.base?.flour ?? 1000,
      hydration: loaded?.base?.hydration ?? 60,
      salt: loaded?.base?.salt ?? 2,
      sugar: loaded?.base?.sugar ?? 0,
      fat: loaded?.base?.fat ?? 0,
      eggs: loaded?.base?.eggs ?? 0,

      yeastPct: loaded?.base?.yeast?.percent ?? 1,
      yeastForm: loaded?.base?.yeast?.type ?? "instant",

      mainFlour: loaded?.base?.mainFlour ?? "normal",
      extraFlour1: loaded?.base?.extraFlour1 ?? "normal",
      extraPct1: loaded?.base?.extraPct1 ?? 0,
      extraFlour2: loaded?.base?.extraFlour2 ?? "normal",
      extraPct2: loaded?.base?.extraPct2 ?? 0,

      liquidType: loaded?.base?.liquidType ?? "water",
      fatType: loaded?.base?.fatType ?? "butter",
      eggType: loaded?.base?.eggType ?? "whole",
      sugarType: loaded?.base?.sugarType ?? "white",

      prefermentType:
        loaded?.preferment?.type ??
        loaded?.defaultPrefermentType ??
        "none",

      prefermentFlourPct: loaded?.preferment?.percentOfFlour ?? 0,
      prefermentHydrationPct: loaded?.preferment?.hydration ?? 100,
      prefermentYeastPct: loaded?.preferment?.yeastPercentInPreferment ?? 0,
    });
  };

  // ------------------------------------------------------------
  // 3. Сохранение кастомного рецепта
  // ------------------------------------------------------------
  const handleSaveAsCustom = (calculatedRecipe: any) => {
    if (!profileData || !calculatedRecipe) return;

    const name = prompt("Введите название рецепта");
    if (!name) return;

    const newRecipe = {
      id: crypto.randomUUID(),
      name,
      recipe: calculatedRecipe,
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

  // ------------------------------------------------------------
  // 4. Возврат к RecipeInput после RecipeOutput
  // ------------------------------------------------------------
  const handleBackToInput = () => {
    if (!recipeData) return;
    setRecipeData({ ...recipeData, _calculated: false });
  };

  // ------------------------------------------------------------
  // 5. Полный сброс
  // ------------------------------------------------------------
  const handleRestart = () => {
    setSelectedProfile(null);
    setProfileData(null);
    setRecipeData(null);
    setShowTechCard(false);
    setSelectedCustomRecipeId(null);
  };

  // ------------------------------------------------------------
  // 6. Техкарта
  // ------------------------------------------------------------
  const handleShowTechCard = (recipe: any) => {
    setTechData(recipe);
    setShowTechCard(true);
  };

  const handleBackFromTechCard = () => {
    setShowTechCard(false);
  };

  // ------------------------------------------------------------
  // 7. Расчёт рецепта
  // ------------------------------------------------------------
  const handleCalculate = (data: any) => {
    if (!profileData) return;

    const flour = n(data.flour, 0);
    const hydration = n(data.hydration, 0);
    const salt = n(data.salt, 0);
    const sugar = n(data.sugar, 0);
    const fat = n(data.fat, 0);
    const eggs = n(data.eggs, 0);
    const yeastPct = n(data.yeastPct, 0);

    const extraPct1 = n(data.extraPct1, 0);
    const extraPct2 = n(data.extraPct2, 0);

    const prefermentFlourPct = n(data.prefermentFlourPct, 0);
    const prefermentHydrationPct = n(data.prefermentHydrationPct, 100);
    const prefermentYeastPct = n(data.prefermentYeastPct, 0);

const fatType = data.fatType || "butter";
const eggType = data.eggType || "whole";
const sugarType = data.sugarType || "white";
const yeastForm = data.yeastForm || "instant";
const liquidType = (data.liquidType || "water") as keyof typeof LIQUID_WATER_CONTENT;

const mainFlour = data.mainFlour || "normal";
const extraFlour1 = data.extraFlour1 || "normal";
const extraFlour2 = data.extraFlour2 || "normal";

const prefermentType = data.prefermentType || "none";

const EGG_UNIT_WEIGHTS: Record<string, number> = {
  whole: 50,
  yolk: 18,
  white: 32,
  powder: 50,
};

const YEAST_MULTIPLIER: Record<string, number> = {
  instant: 1,
  fresh: 3,
  active: 1.25,
};

const liquidWaterRatio = LIQUID_WATER_CONTENT[liquidType] ?? 1.0;
const eggUnitWeight = EGG_UNIT_WEIGHTS[eggType] ?? 50;
const yeastMultiplier = YEAST_MULTIPLIER[yeastForm] ?? 1;

const targetWater = (flour * hydration) / 100;
const liquid = Math.round(targetWater / liquidWaterRatio);
const liquidWater = Math.round(liquid * liquidWaterRatio);

    const mainFlourGr = Math.round(
      flour * (100 - extraPct1 - extraPct2) / 100
    );
    const extraFlour1Gr = Math.round(flour * extraPct1 / 100);
    const extraFlour2Gr = Math.round(flour * extraPct2 / 100);

    const saltGr = Math.round((flour * salt) / 100);
    const sugarGr = Math.round((flour * sugar) / 100);
    const fatGr = Math.round((flour * fat) / 100);
    const eggsGr = Math.round(eggs * eggUnitWeight);
    const yeast = Math.round((flour * yeastPct) / 100 * yeastMultiplier);

    let prefFlour = 0;
    let prefLiquid = 0;
    let prefWater = 0;
    let prefYeast = 0;
    let prefermentTotal = 0;

    if (prefermentType !== "none") {
      prefFlour = Math.round((flour * prefermentFlourPct) / 100);
      prefWater = Math.round((prefFlour * prefermentHydrationPct) / 100);
      prefLiquid = Math.round(prefWater / liquidWaterRatio);
      prefYeast = Math.round((yeast * prefermentYeastPct) / 100);
      prefermentTotal = prefFlour + prefLiquid + prefYeast;
    }

    const finalFlour = flour - prefFlour;
    const finalLiquid = liquid - prefLiquid;
    const finalWater = liquidWater - prefWater;
    const finalYeast = yeast - prefYeast;

    const finalDough =
      finalFlour +
      finalLiquid +
      saltGr +
      sugarGr +
      fatGr +
      eggsGr +
      finalYeast;

    const totalDough = finalDough + prefermentTotal;

    const trueHydration =
      flour > 0 ? Math.round((liquidWater / flour) * 100) : 0;

    const calculated = {
      mode: data.mode ?? "flour",
      targetDoughWeight: n(data.targetDoughWeight, 0),

      flour,
      hydration,
      trueHydration,

      liquid,
      liquidWater,
      liquidType,

      salt: saltGr,
      sugar: sugarGr,
      fat: fatGr,
      eggs,
      eggsGr,
      yeast,

      mainFlour,
      extraFlour1,
      extraPct1,
      extraFlour2,
      extraPct2,

      mainFlourGr,
      extraFlour1Gr,
      extraFlour2Gr,

      fatType,
      eggType,
      sugarType,
      yeastForm,

      prefermentType,
      prefermentFlourPct,
      prefermentHydrationPct,
      prefermentYeastPct,

      preferment: {
        type: prefermentType,
        flour: prefFlour,
        liquid: prefLiquid,
        water: prefWater,
        yeast: prefYeast,
        total: prefermentTotal,
      },

      prefFlour,
      prefLiquid,
      prefWater,
      prefYeast,
      prefermentTotal,

      finalFlour,
      finalLiquid,
      finalWater,
      finalYeast,

      finalDough,
      totalDough,
    };

    setRecipeData({ ...calculated, _calculated: true });
  };

  // ------------------------------------------------------------
  // ЭКРАНЫ
  // ------------------------------------------------------------
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